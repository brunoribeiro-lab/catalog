export type DialogAction = {
  label: string;
  onPress?: () => void;
  role?: "default" | "destructive" | "cancel";
};

export type DialogProps = {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  message?: React.ReactNode;
  actions?: DialogAction[];
  stacked?: boolean;
  closeOnBackdrop?: boolean;
};
