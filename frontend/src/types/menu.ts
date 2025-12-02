export type MenuItem = {
  id: string;
  title?: string;
  icon?: string;
  href?: string;
  children?: MenuItem[];
  isLabel?: boolean;
};
