"use client";

import clsx from "clsx";
import { FC, ReactNode, useEffect, MouseEvent, TouchEvent } from "react";

import { ModalBody } from "./ModalBody";
import { ModalFooter } from "./ModalFooter";
import { ModalHeader } from "./ModalHeader";
import { Portal } from "@/components/atoms";

interface ModalComponentProps {
  children: ReactNode;
  open: boolean;
  onClose?: () => void;
  classes?: {
    wrapper?: string;
    container?: string;
    background?: string;
  };
  isStopScroll?: boolean;
  isDisabledPortal?: boolean;
}

interface ModalComponentType extends ModalComponentProps {
  displayName?: string;
}

const ModalComponent: FC<ModalComponentType> = ({
  children,
  classes,
  onClose,
  open,
  isStopScroll,
  isDisabledPortal,
}) => {
  const handleClick = (
    event: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>
  ) => {
    event.stopPropagation();
  };

  useEffect(() => {
    if (open && !isStopScroll) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "visible";
      document.body.style.touchAction = "auto";
    }
    return () => {
      document.body.style.overflow = "visible";
      document.body.style.touchAction = "auto";
    };
  }, [open]);

  if (!open) {
    return null;
  }
  return (
    <Portal isDisabledPortal={isDisabledPortal}>
      {onClose && (
        <div
          onClick={onClose}
          className={clsx(
            "fixed inset-0 backdrop-blur-md bg-black bg-opacity-20 z-[1000]",
            classes?.background
          )}
        ></div>
      )}
      <div
        onClick={() => onClose && onClose()}
        className={clsx(
          "fixed left-1/2 top-1/2 w-full flex justify-center items-center px-4 -translate-x-1/2 -translate-y-1/2 z-[1001]",
          classes?.wrapper
        )}
      >
        <div
          onClick={handleClick}
          className={clsx(
            "w-11/12 md:w-full max-h-11/12 p-6 relative border border-slate-blue bg-deep-navy rounded-xl overflow-auto",
            classes?.container
          )}
          role="dialog"
          aria-labelledby="modal"
        >
          {children}
        </div>
      </div>
    </Portal>
  );
};

ModalComponent.displayName = "Modal";
ModalHeader.displayName = "Modal.Header";
ModalBody.displayName = "Modal.Body";
ModalFooter.displayName = "Modal.Footer";

export const Modal = Object.assign(ModalComponent, {
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter,
});
