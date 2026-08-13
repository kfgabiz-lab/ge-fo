"use client";

import {
  Children,
  isValidElement,
  useCallback,
  useEffect,
  useState,
  type ReactElement,
  type ReactNode,
  type SyntheticEvent,
} from "react";
import { FormControl, Select, type SelectProps } from "@mui/material";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export type GuideSelectProps = SelectProps & {
  useNativeOnMobile?: boolean;
};

const MOBILE_MQ = "(max-width: 780px)";

function mergeClassNames(...parts: (string | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

function menuItemLabel(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(menuItemLabel).join("");
  if (isValidElement(node)) {
    return menuItemLabel((node as ReactElement<{ children?: ReactNode }>).props.children);
  }
  return "";
}

function convertMenuItemsToOptions(children: ReactNode) {
  return Children.toArray(children).flatMap((child) => {
    if (!isValidElement(child)) return [];

    const element = child as ReactElement<{
      value?: unknown;
      children?: ReactNode;
      disabled?: boolean;
    }>;

    if (!("value" in element.props)) return [];

    const value = element.props.value ?? "";

    return [
      <option key={String(value)} value={String(value)} disabled={element.props.disabled}>
        {menuItemLabel(element.props.children)}
      </option>,
    ];
  });
}

function mergeMenuProps(menuProps?: SelectProps["MenuProps"]) {
  const paperSlot =
    menuProps?.slotProps?.paper &&
    typeof menuProps.slotProps.paper === "object" &&
    !("apply" in menuProps.slotProps.paper)
      ? menuProps.slotProps.paper
      : undefined;

  const listSlot =
    menuProps?.slotProps?.list &&
    typeof menuProps.slotProps.list === "object" &&
    !("apply" in menuProps.slotProps.list)
      ? menuProps.slotProps.list
      : undefined;

  const customMenuClass = mergeClassNames(
    paperSlot?.className,
    menuProps?.PaperProps?.className,
  );

  const menuListClassName = mergeClassNames(
    customMenuClass ? undefined : "guide_field__select-menu-list",
    listSlot?.className,
    menuProps?.MenuListProps?.className,
  );

  return {
    disableScrollLock: true,
    marginThreshold: 0,
    anchorOrigin: { vertical: "bottom" as const, horizontal: "left" as const },
    transformOrigin: { vertical: "top" as const, horizontal: "left" as const },
    ...menuProps,
    slotProps: {
      ...menuProps?.slotProps,
      paper: {
        elevation: 0,
        ...paperSlot,
        className: mergeClassNames(
          customMenuClass ? undefined : "guide_field__select-menu",
          customMenuClass,
        ),
      },
      list: {
        ...listSlot,
        className: menuListClassName,
      },
    },
    MenuListProps: {
      ...menuProps?.MenuListProps,
      className: menuListClassName,
    },
  };
}

export default function GuideSelect({
  MenuProps,
  open: openProp,
  onOpen,
  onClose,
  children,
  useNativeOnMobile = true,
  displayEmpty,
  renderValue,
  value,
  defaultValue,
  className,
  fullWidth = true,
  error,
  disabled,
  ...rest
}: GuideSelectProps) {
  const isMobile = useMediaQuery(MOBILE_MQ);
  const [mounted, setMounted] = useState(false);
  const isOpenControlled = openProp !== undefined;
  const [openUncontrolled, setOpenUncontrolled] = useState(false);
  const open = isOpenControlled ? openProp : openUncontrolled;
  const valueProps =
    value !== undefined
      ? { value }
      : defaultValue !== undefined
        ? { defaultValue }
        : displayEmpty
          ? { defaultValue: "" }
          : {};

  useEffect(() => {
    setMounted(true);
  }, []);

  const closeMenu = useCallback(
    (event: SyntheticEvent) => {
      if (!isOpenControlled) {
        setOpenUncontrolled(false);
      }
      onClose?.(event);
    },
    [isOpenControlled, onClose],
  );

  const handleOpen = useCallback(
    (event: SyntheticEvent) => {
      if (!isOpenControlled) {
        setOpenUncontrolled(true);
      }
      onOpen?.(event);
    },
    [isOpenControlled, onOpen],
  );

  const handleClose = useCallback(
    (event: SyntheticEvent) => {
      if (!isOpenControlled) {
        setOpenUncontrolled(false);
      }
      onClose?.(event);
    },
    [isOpenControlled, onClose],
  );

  useEffect(() => {
    if (!open) return;

    const handleScroll = (event: Event) => {
      if (event.target !== document) return;
      closeMenu({} as SyntheticEvent);
    };

    window.addEventListener("scroll", handleScroll, { passive: true, capture: true });

    return () => {
      window.removeEventListener("scroll", handleScroll, { capture: true });
    };
  }, [closeMenu, open]);

  const placeholderText =
    displayEmpty && renderValue ? menuItemLabel(renderValue("" as never)) : "";
  const useNative = Boolean(mounted && useNativeOnMobile && isMobile);

  const select = useNative ? (
    <Select
      key="guide-select-native"
      native
      displayEmpty={displayEmpty}
      fullWidth={fullWidth}
      {...rest}
      {...valueProps}
    >
      {displayEmpty ? <option value="">{placeholderText}</option> : null}
      {convertMenuItemsToOptions(children)}
    </Select>
  ) : (
    <Select
      key="guide-select-custom"
      fullWidth={fullWidth}
      {...rest}
      {...valueProps}
      displayEmpty={displayEmpty}
      renderValue={renderValue}
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      MenuProps={mergeMenuProps(MenuProps)}
    >
      {children}
    </Select>
  );

  return (
    <FormControl
      className={className}
      fullWidth={fullWidth}
      error={error}
      disabled={disabled}
      variant="outlined"
    >
      {select}
    </FormControl>
  );
}
