import { Localization } from "./localisation-types";

const k = {
  key1: "key1",
  key2: "key2",
  key3: "key3"
};

export const translations: Localization<typeof k> = {
  da: {
    key1: "DA:key1",
    key2: "DA:key2",
    key3: `
    DA:key 3
    Template literal`
  },
  en: {
    key1: "EN:key2"
  }
};
