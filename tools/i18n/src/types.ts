export type KeyEntry = {
  key: string;
  da: string;
  translation: string | null;
};

export type FileTranslations = {
  filePath: string;
  keys: KeyEntry[];
};

export type JsonKeyEntry = { key: string; da: string; [lang: string]: string | null };

export type JsonFileTranslations = {
  filePath: string;
  keys: JsonKeyEntry[];
};
