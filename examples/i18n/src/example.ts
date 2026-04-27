import { Localization } from "./localisation-types";

const k = {
  key1: "key1",
  key2: "key2"
};

export const translations: Localization<typeof k> = {
  da: {
    key1: "DA:key1",
    key2: "DA:key2"
  },
  en: {
    key1: "EN:key2"
  }
};
