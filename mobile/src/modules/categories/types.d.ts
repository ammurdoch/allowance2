export type Category = {
  label: string;
  value: string;
  iconPack: string;
  icon: string;
};

export type CategoryObject = {
  [value: string]: Category;
};
