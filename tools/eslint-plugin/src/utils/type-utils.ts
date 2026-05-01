//
// Copied from @ilbrando/utils
//

export type Maybe<T> = T | undefined | null;

/** Same as the builtin `Omit` but typesafe. */
export type OmitSafe<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/** Gets the keys of a type for the props which are of a specific type.
 *
 * @example
 * type O = {
 *   name: string;
 *   age: number;
 *   jobTitle: string
 * }
 * type StringProps = PropKeysOf<O, string>; // => "name" | "jobTitle"
 */
export type PropKeysOf<T, TPropValue> = {
  [P in keyof T]: T[P] extends TPropValue ? P : never;
}[keyof T];

export type RemoveUndefined<T> = Exclude<T, undefined>;
export type RemoveNull<T> = Exclude<T, null>;
export type RemoveNullUndefined<T> = Exclude<T, null | undefined>;

/** Makes all optional props on a type mandatory.
 *
 * @example
 * type Foo = {
 *   name: string;
 *   age?: number;
 *   jobTitle: string | null;
 * }
 * // becomes
 * type Foo = {
 *   name: string;
 *   age: number;
 *   jobTitle: string;
 * }
 */
export type RemoveOptional<Type> = {
  [Property in keyof Type]-?: RemoveNullUndefined<Type[Property]>;
};

/** Makes all props on a type optional (they can be undefined).
 *
 * @example
 * type Foo = {
 *   name: string;
 *   age: number;
 * }
 * // becomes
 * type Foo = {
 *   name?: string;
 *   age?: number;
 * }
 */
export type MakeOptional<Type> = {
  [Property in keyof Type]?: Type[Property];
};

/** Makes all props on a type nullable.
 *
 * @example
 * type Foo = {
 *   name: string;
 *   age: number;
 * }
 * // becomes
 * type Foo = {
 *   name: string | null;
 *   age: number | null;
 * }
 */
export type MakeNullable<Type> = {
  [Property in keyof Type]: Type[Property] | null;
};

/** Infers the item type of an array.
 *
 * @example
 * type A = string[];
 * type I = InferArrayItem<A>; // => string
 */
export type InferArrayItem<T> = T extends Array<infer I> ? I : never;

/** You can use this for string unions where you want to allow all
 * values but also want some intellisense.
 *
 * @example
 * type S = "a" | "b";
 * const s: Arbitrary<S> = "a"; // intellisense will show "a" and "b".
 * const x: Arbitrary<S> = "y"; // but all other strings are also valid
 */
export type Arbitrary<T extends string> = T | Omit<string, T>;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
