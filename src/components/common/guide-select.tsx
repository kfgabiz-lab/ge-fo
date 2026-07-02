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
import { Select, type SelectProps } from "@mui/material";
import { useMediaQuery } from "@/hooks/use-media-query";

export type GuideSelectProps = SelectProps & {
  /** 모바일(780px 이하)에서 OS 네이티브 select 사용. 기본 true */
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
  ...rest
}: GuideSelectProps) {
  const isMobile = useMediaQuery(MOBILE_MQ);
  const [mounted, setMounted] = useState(false);
  const isOpenControlled = openProp !== undefined;
  const [openUncontrolled, setOpenUncontrolled] = useState(false);
  const open = isOpenControlled ? openProp : openUncontrolled;

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

    const handleScroll = () => {
      closeMenu({} as SyntheticEvent);
    };

    window.addEventListener("scroll", handleScroll, { passive: true, capture: true });

    return () => {
      window.removeEventListener("scroll", handleScroll, { capture: true });
    };
  }, [closeMenu, open]);

  if (mounted && useNativeOnMobile && isMobile) {
    return (
      <Select native {...rest}>
        {convertMenuItemsToOptions(children)}
      </Select>
    );
  }

  return (
    <Select
      {...rest}
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      MenuProps={mergeMenuProps(MenuProps)}
    >
      {children}
    </Select>
  );
}
