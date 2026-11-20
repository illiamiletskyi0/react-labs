/**
 * Ред'юсер черги замовлень. Стан нормалізований, щоб гість зберігався один
 * раз, а замовлення посилалося на нього через customerId:
 *
 *   {
 *     orders: {
 *       byId: { o41: { id, number, status, customerId, items }, … },
 *       ids: ['o41', 'o42', …],
 *     },
 *     customers: {
 *       byId: { c1: { id: 'c1', name: 'Оля' }, … },
 *       ids: ['c1', …],
 *     },
 *     lastNumber: 46,
 *   }
 *
 * ids зберігають порядок надходження. Напої лишаються всередині замовлення:
 * вони не повторюються між замовленнями, тож нормалізувати їх немає сенсу.
 * lastNumber — номер останнього виданого замовлення; він живе в стані, щоб
 * ред'юсер був чистим, а номер скасованого замовлення не діставався новому.
 *
 * Дії — події на сторінці:
 *   { type: 'order_placed', order: { id, customer: { id, name }, items } }
 *       бариста надіслав нове замовлення з форми. Номер і статус 'new'
 *       дає ред'юсер, кожен напій отримує done: false. Гість потрапляє в
 *       customers, якщо його там ще немає. id замовлення й гостя створює
 *       обробник події.
 *   { type: 'item_toggled', orderId, itemId }
 *       бариста відмітив напій готовим або зняв позначку
 *   { type: 'order_advanced', orderId }
 *       бариста натиснув «Почати», «Готово» чи «Видати»: замовлення
 *       переходить у наступну колонку
 *   { type: 'order_cancelled', orderId }
 *       бариста натиснув «Скасувати замовлення»
 *   { type: 'customer_renamed', customerId, name }
 *       бариста виправив ім'я гостя в «Деталях»
 *
 * Компоненти й тести читають стан лише через selectColumn і selectOrder
 * унизу файлу.
 */

const nextStatus = { new: 'brewing', brewing: 'ready', ready: 'served' }

/** Початковий нормалізований стан черги з вкладених замовлень loadOrders(). */
export function createInitialState(orders) {
  const orderById = {}
  const customerById = {}
  const customerIds = []
  let lastNumber = 0

  for (const order of orders) {
    orderById[order.id] = {
      id: order.id,
      number: order.number,
      status: order.status,
      customerId: order.customer.id,
      items: order.items,
    }
    if (!customerById[order.customer.id]) {
      customerById[order.customer.id] = { ...order.customer }
      customerIds.push(order.customer.id)
    }
    lastNumber = Math.max(lastNumber, order.number)
  }

  return {
    orders: { byId: orderById, ids: orders.map((order) => order.id) },
    customers: { byId: customerById, ids: customerIds },
    lastNumber,
  }
}

export function queueReducer(state, action) {
  switch (action.type) {
    case 'order_placed': {
      const number = state.lastNumber + 1
      const { id, customer, items } = action.order
      const order = {
        id,
        number,
        status: 'new',
        customerId: customer.id,
        items: items.map((item) => ({ ...item, done: false })),
      }
      const customerExists = Boolean(state.customers.byId[customer.id])
      return {
        ...state,
        lastNumber: number,
        orders: {
          byId: { ...state.orders.byId, [id]: order },
          ids: [...state.orders.ids, id],
        },
        customers: {
          byId: {
            ...state.customers.byId,
            [customer.id]: { id: customer.id, name: customer.name },
          },
          ids: customerExists
            ? state.customers.ids
            : [...state.customers.ids, customer.id],
        },
      }
    }
    case 'item_toggled': {
      const order = state.orders.byId[action.orderId]
      return {
        ...state,
        orders: {
          ...state.orders,
          byId: {
            ...state.orders.byId,
            [action.orderId]: {
              ...order,
              items: order.items.map((item) =>
                item.id === action.itemId
                  ? { ...item, done: !item.done }
                  : item,
              ),
            },
          },
        },
      }
    }
    case 'order_advanced': {
      const order = state.orders.byId[action.orderId]
      return {
        ...state,
        orders: {
          ...state.orders,
          byId: {
            ...state.orders.byId,
            [action.orderId]: {
              ...order,
              status: nextStatus[order.status],
            },
          },
        },
      }
    }
    case 'order_cancelled': {
      // Гостя лишаємо в customers: у нього може бути інше замовлення, а
      // історія скасування (§4.6) має зберегти його дані.
      const byId = { ...state.orders.byId }
      delete byId[action.orderId]
      return {
        ...state,
        orders: {
          ...state.orders,
          byId,
          ids: state.orders.ids.filter((id) => id !== action.orderId),
        },
      }
    }
    case 'customer_renamed': {
      return {
        ...state,
        customers: {
          ...state.customers,
          byId: {
            ...state.customers.byId,
            [action.customerId]: {
              ...state.customers.byId[action.customerId],
              name: action.name,
            },
          },
        },
      }
    }
    default:
      throw new Error(`Unknown action: ${action.type}`)
  }
}

/**
 * Замовлення однієї колонки (status) у порядку надходження, кожне разом із
 * гостем і напоями.
 */
export function selectColumn(state, status) {
  return state.orders.ids
    .map((id) => selectOrder(state, id))
    .filter((order) => order?.status === status)
}

/** Замовлення за id разом із гостем і напоями; undefined, якщо його немає. */
export function selectOrder(state, id) {
  const order = state.orders.byId[id]
  if (!order) return undefined
  return {
    id: order.id,
    number: order.number,
    status: order.status,
    customer: state.customers.byId[order.customerId],
    items: order.items,
  }
}
