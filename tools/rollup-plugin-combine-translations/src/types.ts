/** A tree of translation texts. Leaves are the texts and the branches are named after folders, files and keys. */
export type TranslationTree = { [key: string]: string | TranslationTree };

/** The translations for each language. */
export type CombinedTranslations = Record<string, TranslationTree>;

export type CombineTranslationsOptions = {
  /** The languages that can be used in the `translations` objects. Every language is always present in the result,
   * even if no file contains translations for it.
   *
   * @default ["da", "en"]
   */
  languages?: string[];
  /** Imports ending with this extension are replaced by the combined translations.
   *
   * @default ".trans"
   */
  extension?: string;
};
