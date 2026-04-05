/**
 * mocks/common.ts
 *
 * Shim for "didgah/common"
 *
 * Exports used by the Renderer code:
 *   guid            — newGuid()
 *   translate       — returns translation string (falls back to the key itself)
 *   utility         — misc helpers including groupBy
 *   calendar        — date helpers used in validation
 *   DidgahClientJS  — client-side utility object
 *   DidgahDeferred  — deferred promise helper
 *   object          — Object-like utilities
 */

// ── guid ──────────────────────────────────────────────────────────────────────
export const guid = {
  newGuid(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  },
};

// ── translate ─────────────────────────────────────────────────────────────────
const translations: Record<string, string> = {
  Save:    'ذخیره',
  Cancel:  'انصراف',
  Delete:  'حذف',
  Add:     'افزودن',
  Edit:    'ویرایش',
  Search:  'جستجو',
  Close:   'بستن',
  Yes:     'بله',
  No:      'خیر',
  Error:   'خطا',
  Confirm: 'تأیید',
  Display: 'نمایش',
  AreYouSure: 'آیا مطمئنید؟',
  SelectOne:  'لطفاً یک مورد انتخاب کنید',
  SaveSuccessful: 'با موفقیت ذخیره شد',
  SortWarningMessage: 'امکان مرتب‌سازی با سطر در حال افزودن وجود ندارد',
  Status: 'وضعیت',
  FillRequiredData: 'لطفاً فیلدهای اجباری را پر کنید',
  For: 'برای',
  Record: 'رکورد',
  AddRowToNext: 'افزودن سطر بعد',
  TableCanNotAddMoreRow: 'جدول {0} نمی‌تواند بیش از {1} سطر داشته باشد',
  TableCanNotRemoveMoreRow: 'جدول {0} باید حداقل {1} سطر داشته باشد',
  Required: 'اجباری است',
  'ThisFiledConnectTo{n}': 'این فیلد به {n} متصل است',
  'Max length is {n}': 'حداکثر طول {n} کاراکتر',
  'Min value is {n}': 'حداقل مقدار {n}',
  'Max value is {n}': 'حداکثر مقدار {n}',
  'Form': 'فرم',
  'LayoutType_Define': 'تعریف',
};

export function translate(key: string): string {
  return translations[key] ?? key;
}

// ── utility ───────────────────────────────────────────────────────────────────
export const utility = {
  /** Deep equality check */
  isEqual(a: any, b: any): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
  },
  /** Safe JSON parse — returns defaultValue on error */
  tryParseJson<T>(json: string, defaultValue: T): T {
    try { return JSON.parse(json) as T; }
    catch { return defaultValue; }
  },
  /** Debounce */
  debounce(fn: (...args: any[]) => void, ms: number) {
    let timer: ReturnType<typeof setTimeout>;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), ms);
    };
  },
  /**
   * Group an array by a key selector.
   * Returns a Record<string, T[]>.
   */
  groupBy<T>(array: T[], key: keyof T | ((item: T) => string)): Record<string, T[]> {
    const result: Record<string, T[]> = {};
    array.forEach(item => {
      const k = typeof key === 'function' ? key(item) : String(item[key]);
      if (!result[k]) result[k] = [];
      result[k].push(item);
    });
    return result;
  },
};

// ── calendar ──────────────────────────────────────────────────────────────────
export const calendar = {
  parseJalali(_dateStr: string): Date | null { return null; },
  today(): Date { return new Date(); },
};

// ── DidgahClientJS ────────────────────────────────────────────────────────────
export const DidgahClientJS = {
  trigger(_element: Element | null, _eventName: string, _data?: any): void {},
  on(_eventName: string, _handler: (...args: any[]) => void): void {},
  off(_eventName: string, _handler: (...args: any[]) => void): void {},
};

// ── DidgahDeferred ────────────────────────────────────────────────────────────
// Used by Widget/Display/index.tsx and Widget/Edit/index.tsx.
// The real implementation is a deferred promise.  This stub satisfies
// the import without throwing.
export class DidgahDeferred<T = any> {
  promise: Promise<T>;
  resolve!: (value: T | PromiseLike<T>) => void;
  reject!:  (reason?: any) => void;

  constructor() {
    this.promise = new Promise<T>((res, rej) => {
      this.resolve = res;
      this.reject  = rej;
    });
  }
}

// ── dragDrop — drag-and-drop utilities (Designer-only, no-op stubs) ───────────
export const dragDrop = {
  useDrag: () => [{}],
  useDrop: () => [{}],
  DragDropContext: ({ children }: any) => children,
  /** Returns a no-op div wrapper — called at module level in Designer files */
  makeDragElementComponent: (_type: string, _tag: string) =>
    ({ children, ...rest }: any) => children ?? null,
  makeDropElementComponent: (_type: string, _tag: string) =>
    ({ children, ...rest }: any) => children ?? null,
  makeDropContainerComponent: (_type: string, _tag: string) =>
    ({ children, ...rest }: any) => children ?? null,
  makeSortableDragElementComponent: (_type: string, _tag: string) =>
    ({ children, ...rest }: any) => children ?? null,
  makeDropAreaComponent: (_type: string, _tag: string) =>
    ({ children, ...rest }: any) => children ?? null,
};

// ── object — misc Object utilities (used in Utility/helpers.ts) ───────────────
export const object = {
  assign<T>(target: T, ...sources: Partial<T>[]): T {
    return Object.assign(target as any, ...sources) as T;
  },
};
