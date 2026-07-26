"use client";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

type GuideDatePickerProviderProps = {
  children: React.ReactNode;
};

export default function GuideDatePickerProvider({ children }: GuideDatePickerProviderProps) {
  return <LocalizationProvider dateAdapter={AdapterDayjs}>{children}</LocalizationProvider>;
}
