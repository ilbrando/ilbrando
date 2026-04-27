export type Localization<T> = {
  da: T;
  en?: Partial<T>;
};

export type Language = keyof Localization<unknown>;
