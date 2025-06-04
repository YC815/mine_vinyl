import * as DialogPrimitive from "@radix-ui/react-dialog";
import { FC } from "react";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogClose = DialogPrimitive.Close;

export const DialogOverlay: FC<DialogPrimitive.DialogOverlayProps> = ({ className = "", ...props }) => (
  <DialogPrimitive.Overlay
    className={"fixed inset-0 bg-black/50 backdrop-blur-sm " + className}
    {...props}
  />
);

export const DialogContent: FC<DialogPrimitive.DialogContentProps> = ({ className = "", children, ...props }) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      className={
        "fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white p-6 shadow-lg " +
        className
      }
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPortal>
);
