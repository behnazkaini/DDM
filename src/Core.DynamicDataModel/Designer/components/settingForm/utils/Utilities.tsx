import { IDictionary } from "../../../../../typings/Core.DynamicDataModel/Types";

export const sortDictionaryByOrder = (dictionary: IDictionary<{ order: number }>): Array<{ key: string; order: number }> => {
  return Object.entries(dictionary)
    .map(([key, value]) => ({ key, order: value.order }))
    .sort((a, b) => a.order - b.order);
}

