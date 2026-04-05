# Zustand و useSyncExternalStore

## useSyncExternalStore چیست؟

`useSyncExternalStore` یک هوک built-in ری‌اکت ۱۸ هست که برای **subscribe شدن به external store ها** طراحی شده. یعنی هر state ای که خارج از React tree مدیریت میشه (مثلاً یه plain JS object یا یه event emitter) رو میتونی با این هوک به صورت **concurrent-safe** به ری‌اکت وصل کنی.

### چرا به این هوک نیاز داریم؟

قبل از ری‌اکت ۱۸، کتابخانه‌های state management معمولاً از `useEffect` + `useState` برای sync کردن external state استفاده می‌کردن. اما با concurrent rendering ری‌اکت ۱۸، این رویکرد ممکنه باعث **tearing** بشه — یعنی بخش‌های مختلف UI مقادیر متفاوتی از یک state رو نشون بدن.

`useSyncExternalStore` این مشکل رو حل می‌کنه و تضمین می‌کنه که همه‌ی componentها در یک render pass، مقدار یکسانی از store می‌بینن.

### امضای هوک

```ts
const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)
```

| پارامتر | توضیح |
|---|---|
| `subscribe` | تابعی که یک callback می‌گیره و هر وقت store تغییر کرد، اون callback رو صدا می‌زنه. باید یک unsubscribe function برگردونه. |
| `getSnapshot` | تابعی که مقدار فعلی store رو برمی‌گردونه. باید **referentially stable** باشه (اگه store تغییر نکرده، همون reference قبلی رو برگردونه). |
| `getServerSnapshot` | (اختیاری) برای SSR — مقدار اولیه‌ی store در سمت سرور. |

### مثال ساده: ساختن یک store از صفر

```ts
// store.ts
type Listener = () => void;

let count = 0;
const listeners = new Set<Listener>();

export const counterStore = {
  getSnapshot: () => count,

  subscribe: (listener: Listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  increment: () => {
    count++;
    listeners.forEach((l) => l());
  },

  decrement: () => {
    count--;
    listeners.forEach((l) => l());
  },
};
```

```tsx
// Counter.tsx
import { useSyncExternalStore } from "react";
import { counterStore } from "./store";

function Counter() {
  const count = useSyncExternalStore(
    counterStore.subscribe,
    counterStore.getSnapshot
  );

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={counterStore.increment}>+</button>
      <button onClick={counterStore.decrement}>-</button>
    </div>
  );
}
```

> **نکته:** هر جای React tree که از `useSyncExternalStore` با همین store استفاده کنی، همه‌شون sync هستن و tearing نداری.

---

## Zustand چیست؟

Zustand یک کتابخانه‌ی **سبک و minimalist** برای state management در ری‌اکت هست. در هسته‌ی خودش دقیقاً از همین الگوی `useSyncExternalStore` استفاده می‌کنه.

### فلسفه‌ی Zustand

- **بدون Provider/Context:** نیازی به wrap کردن app با Provider نیست.
- **بدون boilerplate:** نه reducer نیاز داری، نه action type، نه dispatch.
- **Selective subscription:** کامپوننت‌ها فقط به بخشی از state که استفاده می‌کنن subscribe میشن.
- **خارج از React tree:** store یه plain JS object هست — می‌تونی از بیرون React هم بهش دسترسی داشته باشی.

### نصب

```bash
npm install zustand
```

### مثال پایه

```ts
// useCounterStore.ts
import { create } from "zustand";

interface CounterState {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));

export default useCounterStore;
```

```tsx
// Counter.tsx
import useCounterStore from "./useCounterStore";

function Counter() {
  const count = useCounterStore((state) => state.count);
  const increment = useCounterStore((state) => state.increment);
  const decrement = useCounterStore((state) => state.decrement);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
}
```

### Selective Subscription — مهم‌ترین نکته‌ی Zustand

```tsx
// ❌ بد: هر تغییری در store باعث re-render میشه
const state = useCounterStore();

// ✅ خوب: فقط وقتی count تغییر کنه re-render میشه
const count = useCounterStore((state) => state.count);
```

وقتی بدون selector صدا بزنی، کل state رو subscribe می‌کنی. اما با selector، Zustand با `Object.is` مقایسه می‌کنه و فقط وقتی مقدار select-شده تغییر کنه، re-render انجام میشه.

---

## رابطه‌ی Zustand و useSyncExternalStore

Zustand در نسخه‌های جدید (v4+) زیر هود دقیقاً از `useSyncExternalStore` استفاده می‌کنه. ساختار ساده‌شده‌ی `create` تقریباً اینطوریه:

```ts
// ساختار مفهومی (simplified)
function create(createState) {
  let state;
  const listeners = new Set();

  const setState = (partial) => {
    const nextState =
      typeof partial === "function" ? partial(state) : partial;
    if (!Object.is(nextState, state)) {
      state = Object.assign({}, state, nextState);
      listeners.forEach((listener) => listener());
    }
  };

  const getState = () => state;

  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  // اینجا store ساخته میشه
  state = createState(setState, getState);

  // هوک ری‌اکت
  function useStore(selector = (s) => s) {
    return useSyncExternalStore(
      subscribe,
      () => selector(getState())
    );
  }

  return useStore;
}
```

> **خلاصه:** Zustand یه لایه‌ی ergonomic روی `useSyncExternalStore` هست که subscribe/getSnapshot رو مخفی می‌کنه و selector-based subscription بهت میده.

---

## مثال واقعی‌تر: Todo Store با Middleware

```ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface Todo {
  id: string;
  text: string;
  done: boolean;
}

interface TodoState {
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  removeTodo: (id: string) => void;
}

const useTodoStore = create<TodoState>()(
  devtools(
    persist(
      immer((set) => ({
        todos: [],

        addTodo: (text) =>
          set((state) => {
            state.todos.push({
              id: crypto.randomUUID(),
              text,
              done: false,
            });
          }),

        toggleTodo: (id) =>
          set((state) => {
            const todo = state.todos.find((t) => t.id === id);
            if (todo) todo.done = !todo.done;
          }),

        removeTodo: (id) =>
          set((state) => {
            state.todos = state.todos.filter((t) => t.id !== id);
          }),
      })),
      { name: "todo-storage" } // localStorage key
    )
  )
);
```

### Middlewareهای مهم Zustand

| Middleware | کاربرد |
|---|---|
| `devtools` | اتصال به Redux DevTools |
| `persist` | ذخیره در localStorage/sessionStorage |
| `immer` | نوشتن mutation-style با immutable update |
| `subscribeWithSelector` | امکان subscribe به بخش خاصی از store خارج از React |

---

## دسترسی به Store خارج از React

یکی از قابلیت‌های خیلی مفید Zustand اینه که store یه vanilla JS object هست:

```ts
// خارج از هر component
const currentCount = useCounterStore.getState().count;

// subscribe بدون React
const unsub = useCounterStore.subscribe((state) => {
  console.log("count changed:", state.count);
});

// set از بیرون
useCounterStore.setState({ count: 42 });
```

این خیلی به درد میخوره وقتی:
- توی یه utility function هستی
- توی یه middleware (مثلاً axios interceptor) هستی
- نیاز داری state رو توی test بخونی

---

## مقایسه‌ی سریع

| ویژگی | `useSyncExternalStore` خام | Zustand |
|---|---|---|
| سطح abstraction | Low-level hook | High-level library |
| Selector support | دستی باید پیاده کنی | Built-in |
| Middleware | ❌ | ✅ (devtools, persist, immer, ...) |
| Provider نیاز داره؟ | ❌ | ❌ |
| SSR support | با `getServerSnapshot` | با `persist` middleware |
| Bundle size | 0 (built-in) | ~1.1KB gzipped |
| مناسب برای | یادگیری مفهوم / custom stores | اپلیکیشن‌های واقعی |

---

## جمع‌بندی

1. **`useSyncExternalStore`** مکانیزم پایه‌ی ری‌اکت ۱۸ برای خوندن concurrent-safe از external storeهاست.
2. **Zustand** یه لایه‌ی بسیار سبک و developer-friendly روی همین مکانیزم هست.
3. وقتی `useCounterStore((s) => s.count)` می‌نویسی، زیر هود داره `useSyncExternalStore` صدا زده میشه.
4. مزیت اصلی Zustand نسبت به Context API: **selective subscription** — فقط componentهایی re-render میشن که واقعاً به بخش تغییرکرده‌ی state وابسته‌ان.