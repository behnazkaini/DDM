/**
 * mocks/utilityLanguage.ts
 *
 * Shim for "Utility/language"
 *
 * The real implementation uses didgah-language-cache to look up strings.
 * For the demo we fall back to the key itself, same as didgah/common translate.
 */

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
  'Max length is {n}': 'حداکثر طول {n} کاراکتر',
  'Min value is {n}': 'حداقل مقدار {n}',
  'Max value is {n}': 'حداکثر مقدار {n}',
  'Form': 'فرم',
  'LayoutType_Define': 'تعریف',
  'ThisFiledConnectTo{n}': 'این فیلد به {n} متصل است',
};

export function translate(key: string, _softwareGuid?: string): string {
  return translations[key] ?? key;
}

export function translateBySoftwareGuid(key: string, _targetSoftwareGuid: string): string {
  return translations[key] ?? key;
}
