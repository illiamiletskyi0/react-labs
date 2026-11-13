# ЛР-6. Альтернативна версія: Formik + Yup

Варіант §4.8 лабораторної роботи № 6 курсу «Розробка вебзастосунків на
React»: та сама форма бронювання столика, що в `lab-6`, але замість React Hook
Form і Zod для неї використано Formik і Yup. Форма підписки `SubscribeForm`
лишилася на Zod, як у §4.7. Інструкція:
https://denysmatsevych.github.io/web-development-2026/react/labs/lab-6/

## Що є в проєкті

- `src/components/BookingForm.jsx` — форма бронювання на Formik: `getFieldProps`,
  `validationSchema`, `validateForm`, `submitForm`, `resetForm`;
- `src/components/GuestsStepper.jsx` — той самий контрольований компонент із
  ЛР-5, значення зберігає `formik.values.guests`;
- `src/bookingSchema.js` — та сама схема правил, записана Yup;
- `src/api.js` — імітований сервер; перевіряє бронювання тією самою Yup-схемою
  через `validateSync`;
- `src/components/SubscribeForm.jsx` — форма підписки з §4.7 без змін, на Zod;
- `src/index.css` — стилі сторінки.

## Команди

`npm install` виконуйте в корені репозиторію `react-labs`, решту — у теці
`lab-6-alt/`:

- `npm run dev`: dev-сервер
- `npm run lint`: ESLint
- `npm run format:check`: перевірка форматування Prettier
- `npm run build`: production-збірка в `dist/`

## Порівняння з React Hook Form і Zod

### Бібліотеки та версії

| Версія      | Бібліотеки форм        | Бібліотеки схем                                 |
| ----------- | ---------------------- | ----------------------------------------------- |
| `lab-6`     | React Hook Form 7.92.0 | Zod 4.6.7, `@hookform/resolvers` 7.0.6          |
| `lab-6-alt` | Formik 2.4.9           | Yup 1.7.1, Zod 4.6.7 (лише для `SubscribeForm`) |

### Що замінило API React Hook Form

| React Hook Form + Zod                            | Formik + Yup                                                                                                                     |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| `register('name')`                               | `formik.getFieldProps('name')` + `ref` для фокуса                                                                                |
| `<Controller name="guests" control={control} …>` | `GuestsStepper value={formik.values.guests}` і `formik.setFieldValue('guests', value)`                                           |
| `useWatch({ control, name: 'comment' })`         | `formik.values.comment` (контрольоване поле)                                                                                     |
| `handleSubmit(onValid)`                          | власний `handleFormSubmit`: `validateForm()` → фокус на першій помилці → `submitForm()`; `onSubmit` у Formik викликає `dispatch` |
| `zodResolver(bookingSchema)`                     | `validationSchema={bookingSchema}`                                                                                               |
| `reset()`                                        | `formik.resetForm()`                                                                                                             |
| `setFocus('name')`                               | `nameRef.current.focus()`                                                                                                        |
| `trigger('time')` після зміни дати               | Yup перевіряє всю схему на кожну зміну (`validateOnChange`), тому помилка часу оновлюється сама                                  |

### Розмір збірки

| Версія      | Основний JS-файл | Gzip      |
| ----------- | ---------------- | --------- |
| `lab-6`     | 353.68 kB        | 109.36 kB |
| `lab-6-alt` | 359.23 kB        | 111.49 kB |

CSS в обох версіях — 2.85 kB. Різниця в JS невелика, бо в `lab-6-alt` Zod
лишився для форми підписки, а Formik і Yup замінили React Hook Form і
`@hookform/resolvers`.

### Які компоненти рендеряться під час введення в полі «Ім'я»

Перевірено лічильником рендерів; у React DevTools це видно як **Highlight
updates when components render**.

- `lab-6` (React Hook Form): під час введення імені **не рендериться жоден
  React-компонент** — оновлюється лише DOM-значення неконтрольованого поля.
  `BookingForm` перерендериться пізніше, коли після blur зміниться стан
  помилки, або коли змінюється коментар (`useWatch`).
- `lab-6-alt` (Formik): кожна літера оновлює стан Formik, тому рендериться
  `BookingForm`, а разом із ним його дочірній `GuestsStepper`. `SubscribeForm`
  і `App` не рендеряться.

### Останні релізи

| Бібліотека            | Версія | Дата релізу |
| --------------------- | ------ | ----------- |
| Formik                | 2.4.9  | 10.11.2025  |
| Yup                   | 1.7.1  | 21.09.2025  |
| React Hook Form       | 7.92.0 | 11.11.2026  |
| Zod                   | 4.6.7  | 12.10.2026  |
| `@hookform/resolvers` | 7.0.6  | 11.11.2026  |

### Яку пару взяти наступного проєкту

Для наступного проєкту я взяв би React Hook Form + Zod: неконтрольовані поля
рендеряться менше, одна схема використовується і формою, і сервером, а обидві
бібліотеки активно випускають релізи. Formik + Yup працює й читається простіше
для невеликої форми, але контрольовані поля рендерять форму на кожну літеру, а
останній реліз Formik вийшов понад рік тому. Yup добре підходить, якщо команда
вже знає цю бібліотеку; для нового коду я обрав би Zod через спільну схему з
сервером і `safeParse`. Різниця в розмірі збірки між версіями майже не
відчутна, тож вирішальними є зручність API та кількість рендерів.
