export function transform(value, valueTransformer) {
  return transformImpl(value, valueTransformer, createValueTransformerOptions(null, null, null, null));
}

function createContextImpl(valueTransformerOptions, transformArray, transformObject, value, valueOld) {
  return {
    equals,
    parent: valueTransformerOptions?.parent || null,
    parentIndex: valueTransformerOptions?.parentIndex || null,
    parentKey: valueTransformerOptions?.parentKey || null,
    parents: valueTransformerOptions?.parents || [],
    transformArray,
    transformObject,
    value,
    valueIndex: valueTransformerOptions?.valueIndex || null,
    valueKey: valueTransformerOptions?.valueKey || null,
    valueOld,
  };
}

function createValueTransformerOptions(valueTransformerOptions, parent, valueIndex, valueKey) {
  return {
    parent,
    parentIndex: valueTransformerOptions?.valueIndex || null,
    parentKey: valueTransformerOptions?.valueKey || null,
    parents: parent ? [...(valueTransformerOptions?.parents || []), parent] : [...(valueTransformerOptions?.parents || [])],
    valueIndex,
    valueKey,
  };
}

function equals(a, b, configuration = { isOrderIgnoredForMap: true, isOrderIgnoredForObject: true }) {
  if (typeof a !== "object" && typeof b !== "object") {
    return Object.is(a, b);
  } else if (a === null && b === null) {
    return true;
  } else if (a === null || b === null || typeof a !== typeof b) {
    return false;
  } else if (a === b) {
    return true;
  } else if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false;
    } else {
      for (let i = 0; i < a.length; i++) {
        if (!equals(a[i], b[i])) {
          return false;
        }
      }

      return true;
    }
  } else if (Array.isArray(a) || Array.isArray(b)) {
    return false;
  } else if (Object.keys(a).length !== Object.keys(b).length) {
    return false;
  } else if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  } else if (a instanceof Map && b instanceof Map) {
    if (a.size !== b.size) {
      return false;
    } else {
      const aKeyValues = [];
      const bKeyValues = [];

      for (const [k, v] of a) {
        if (!b.has(k)) {
          return false;
        } else {
          aKeyValues.push([k, v]);
        }
      }

      for (const [k, v] of b) {
        if (!a.has(k)) {
          return false;
        } else {
          bKeyValues.push([k, v]);
        }
      }

      for (let i = 0; i < aKeyValues.length; i++) {
        if (!configuration || configuration.isOrderIgnoredForMap) {
          let hasFoundKeyValuePair = false;

          for (let j = 0; j < bKeyValues.length; j++) {
            if (equals(aKeyValues[i][0], bKeyValues[j][0])) {
              if (!equals(aKeyValues[i][1], bKeyValues[j][1])) {
                return false;
              } else {
                hasFoundKeyValuePair = true;
              }
            }
          }

          if (!hasFoundKeyValuePair) {
            return false;
          }
        } else if (!equals(aKeyValues[i][0], bKeyValues[i][0]) || !equals(aKeyValues[i][1], bKeyValues[i][1])) {
          return false;
        }
      }

      return true;
    }
  } else if (!configuration || configuration.isOrderIgnoredForObject) {
    for (const [k, v] of Object.entries(a)) {
      if (!(k in b)) {
        return false;
      } else if (!equals(v, b[k])) {
        return false;
      }
    }

    return true;
  } else {
    const aKeyValues = [];
    const bKeyValues = [];

    for (const [k, v] of Object.entries(a)) {
      if (!(k in b)) {
        return false;
      } else {
        aKeyValues.push([k, v]);
      }
    }

    for (const [k, v] of Object.entries(b)) {
      if (!(k in a)) {
        return false;
      } else {
        bKeyValues.push([k, v]);
      }
    }

    for (let i = 0; i < aKeyValues.length; i++) {
      if (!equals(aKeyValues[i][0], bKeyValues[i][0]) || !equals(aKeyValues[i][1], bKeyValues[i][1])) {
        return false;
      }
    }
  }
}

function transformArray(array, arrayFilter, arrayTransformer) {
  if (Array.isArray(array)) {
    const arrayToFilterAndTransform = [...array];
    const arrayFiltered = [];

    if (arrayFilter && typeof arrayFilter === "function") {
      for (let i = 0; i < arrayToFilterAndTransform.length; i++) {
        if (!arrayFilter(arrayToFilterAndTransform[i], i)) {
          arrayFiltered.push(arrayToFilterAndTransform.splice(i--, 1)[0]);
        }
      }
    }

    if (arrayTransformer && typeof arrayTransformer === "function") {
      arrayTransformer(arrayToFilterAndTransform, arrayFiltered);
    }

    return equals(array, arrayToFilterAndTransform) ? array : arrayToFilterAndTransform;
  } else {
    return [];
  }
}

function transformArrayImpl(value, valueTransformer, valueTransformerOptions) {
  const oldArray = value;
  const newArray = [...oldArray];

  let hasTransformed = false;

  for (let index = 0; index < newArray.length; index++) {
    const oldElementValue = newArray[index];
    const newElementValue = transformImpl(oldElementValue, valueTransformer, createValueTransformerOptions(valueTransformerOptions, newArray, index, null));

    if (!equals(oldElementValue, newElementValue)) {
      newArray[index] = newElementValue;

      hasTransformed = true;
    }
  }

  const oldArrayAgain = hasTransformed ? newArray : oldArray;
  const newArrayAgain = valueTransformer(createContextImpl(valueTransformerOptions, transformArray, null, oldArrayAgain, value));

  return equals(oldArrayAgain, newArrayAgain) ? oldArrayAgain : newArrayAgain;
}

function transformImpl(value, valueTransformer, valueTransformerOptions) {
  if (!valueTransformer) {
    return value;
  } else if (value === null || value === undefined || typeof value === "bigint" || typeof value === "boolean" || typeof value === "function" || typeof value === "number" || typeof value === "string" || typeof value === "symbol") {
    return transformValueImpl(value, valueTransformer, valueTransformerOptions);
  } else if (Array.isArray(value)) {
    return transformArrayImpl(value, valueTransformer, valueTransformerOptions);
  } else if (typeof value === "object") {
    return transformObjectImpl(value, valueTransformer, valueTransformerOptions);
  } else {
    return value;
  }
}

function transformObject(object, objectFilter, objectTransformer) {
  if (object !== null && typeof object === "object" && !Array.isArray(object)) {
    const objectToFilterAndTransform = { ...object };
    const objectFiltered = {};

    if (objectFilter && typeof objectFilter === "function") {
      for (const [k, v] of Object.entries(object)) {
        if (!objectFilter(objectToFilterAndTransform[k], k)) {
          objectFiltered[k] = v;

          delete objectToFilterAndTransform[k];
        }
      }
    }

    if (objectTransformer && typeof objectTransformer === "function") {
      objectTransformer(objectToFilterAndTransform, objectFiltered);
    }

    return equals(object, objectToFilterAndTransform) ? object : objectToFilterAndTransform;
  } else {
    return {};
  }
}

function transformObjectImpl(value, valueTransformer, valueTransformerOptions) {
  const oldObject = value;
  const newObject = { ...oldObject };

  let hasTransformed = false;

  for (const [key, oldPropertyValue] of Object.entries(newObject)) {
    const newPropertyValue = transformImpl(oldPropertyValue, valueTransformer, createValueTransformerOptions(valueTransformerOptions, newObject, null, key));

    if (!equals(oldPropertyValue, newPropertyValue)) {
      newObject[key] = newPropertyValue;

      hasTransformed = true;
    }
  }

  const oldObjectAgain = hasTransformed ? newObject : oldObject;
  const newObjectAgain = valueTransformer(createContextImpl(valueTransformerOptions, null, transformObject, oldObjectAgain, value));

  return equals(oldObjectAgain, newObjectAgain) ? oldObjectAgain : newObjectAgain;
}

function transformValueImpl(value, valueTransformer, valueTransformerOptions) {
  const oldValue = value;
  const newValue = valueTransformer(createContextImpl(valueTransformerOptions, null, null, value, value));

  return equals(oldValue, newValue) ? oldValue : newValue;
}
