//
// Copied from @ilbrando/utils
//

import { DeepPartial, Maybe } from "./type-utils";

/** Returns `true` if {@param value} is `undefined` */
export const isUndefined = (value: unknown) => value === undefined;

/** Returns `true` if {@param value} is `null` */
export const isNull = (value: unknown) => value === null;

/** Returns `true` if {@param value} is not `null` and not `undefined`.
 * You can use this function instead of relying on JavaScript's {@link https://developer.mozilla.org/en-US/docs/Glossary/Truthy|truthy system}
 * which can give unexpected results.
 */
export const hasValue = <T>(value: T | undefined | null): value is T => {
  return !isUndefined(value) && !isNull(value);
};

export const isString = (value: unknown): value is string => {
  return hasValue(value) && typeof value === "string";
};

export const isNumber = (value: unknown): value is number => {
  return hasValue(value) && typeof value === "number";
};

export const isObject = (value: unknown): value is object => {
  return hasValue(value) && typeof value === "object";
};

export const hasValueAndNotEmptyString = <T>(value: T | undefined | null): value is T => {
  if (!hasValue(value)) return false;
  if (typeof value !== "string") return false;
  if (value === "") return false;
  return true;
};

/** You can use this when the Typescript compiler can't determine that a value is not
 * `null` or `undefined`. If the values i `null` or `undefined` an `Error` is thrown.
 * You can provide the message for the error to help identifying where in the code the
 * error happened.
 *
 * @example
 * const someValue: number | undefined = 42;
 * const value = ensure(someValue); // => number (or throws)
 */
export const ensureValue = <T>(value: Maybe<T>, message?: string): T => {
  if (value === undefined) throw Error(`ensureValue (value is undefined): ${message ?? "did not expect this"}.`);
  if (value === null) throw Error(`ensureValue (value is null): ${message ?? "did not expect this"}.`);
  return value;
};

/** Returns true if two values are equal. If the values are objects their properties are
 * examined recursively.
 */
export const isEqual = <T>(v1: Maybe<T>, v2: Maybe<T>) => {
  if (v1 === v2) return true;
  if (v1 instanceof Date && v2 instanceof Date) return v1.getTime() === v2.getTime();
  if (isObject(v1) && isObject(v2)) {
    const keys = Reflect.ownKeys(v1);
    return keys.every(key => isEqual(v1[key], v2[key]));
  }
  return false;
};

/**
 * Returns a new instance of obj where all props with value null or undefined
 * are removed (deleted).
 */
export const removeNullProps = <T>(obj: T) => {
  if (!isObject(obj)) return obj;
  const result: Partial<T> = { ...obj };
  const keys = Reflect.ownKeys(obj);
  for (const key of keys) {
    const value = Reflect.get(obj, key);
    if (!hasValue(value)) {
      Reflect.deleteProperty(result, key);
      continue;
    }
    if (value instanceof Date) continue;
    if (typeof value === "object") {
      Reflect.set(result, key, removeNullProps(value));
    }
  }
  return result;
};

export const undefinedToNull = <T extends Record<string, unknown>>(obj: T) => {
  const result = { ...obj };
  const keys = Reflect.ownKeys(obj);
  for (const key of keys) {
    const value = Reflect.get(obj, key);
    if (!hasValue(value)) {
      Reflect.set(result, key, null);
      continue;
    }
    if (value instanceof Date) continue;
    if (typeof value === "object") {
      Reflect.set(result, key, removeNullProps(value));
    }
  }
  return result;
};

/**
 * Deep merges two objects. The resulting object will contain all the properties in
 * either of the two objects. If a property has a value in object 2 it overrides
 * the corresponding value in object 1.
 *
 * This function can break type safety because it is up to the caller to ensure
 * that the two partial objects in combination results in a valid object of the
 * specified type.
 */
export const deepMerge = <T extends Record<string, unknown>>(obj1: DeepPartial<T>, obj2: DeepPartial<T>): T => {
  const result = { ...obj1 };
  const keys = [...new Set([...Reflect.ownKeys(obj1), ...Reflect.ownKeys(obj2)])];
  for (const key of keys) {
    const value1 = Reflect.get(obj1, key);
    const value2 = Reflect.get(obj2, key);
    Reflect.set(result, key, value2 ?? value1);
    if (typeof value1 === "object" || typeof value2 === "object") {
      Reflect.set(result, key, deepMerge(value1 ?? {}, value2 ?? {}));
    }
  }
  return result as T;
};

/**
 * This can be used for instance in switch statements to catch unexpected values.
 * @example
 * const foo: "a"|"b" = "a";
 * switch (foo) {
 *   case "a":
 *      return true;
 *   case "b":
 *     return false;
 *   default:
 *     assertNever(value);
 * }
 */
export const assertNever = (value: never): never => {
  throw Error(`Unsupported value ${value}.`);
};

export const nameof = <T>(key: keyof T) => key;
