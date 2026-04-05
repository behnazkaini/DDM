export const findPrimaryKeys = (structure:any[], targetKey:string) => {
  const result = [];
  for (const item of structure) {
    if (item.Key === targetKey && Array.isArray(item.Value) && item.Value.length > 0) {
      for (const val of item.Value) {
        const hasValidKeyValue =
          Array.isArray(val.KeyValues) &&
          val.KeyValues.some(
            kv =>
              kv.Value !== null &&
              kv.Value !== undefined &&
              (!(Array.isArray(kv.Value)) || kv.Value.length > 0)
          );

        if (hasValidKeyValue) {
          result.push(val.PrimaryKey);
        }
      }
    }

    if (Array.isArray(item.KeyValues)) {
      const nestedResult = findPrimaryKeys(item.KeyValues, targetKey);
      result.push(...nestedResult);
    }

    if (Array.isArray(item.Value) && item.Value.length > 0) {
      const nestedResult = findPrimaryKeys(item.Value, targetKey);
      result.push(...nestedResult);
    }
  }

  return result.filter(Boolean);
};

export const hasKeyInStructure = (structure: any[], targetKey: string): boolean => {
  for (const item of structure) {
    if (item.Key === targetKey) {
      return true;
    }

    if (Array.isArray(item.KeyValues)) {
      if (hasKeyInStructure(item.KeyValues, targetKey)) {
        return true;
      }
    }

    if (Array.isArray(item.Value)) {
      if (hasKeyInStructure(item.Value, targetKey)) {
        return true;
      }
    }
  }
  return false;
};

