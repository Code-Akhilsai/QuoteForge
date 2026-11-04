import { forwardRef } from "react";
import { cn } from "@/utils/helpers";
import { X } from "lucide-react";

const DialogOverlay = ({ className, ...props }) => (
  <div className={cn("fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className)} {...props} />
);
DialogOverlay.displayName = "DialogOverlay";

const DialogContent = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 rounded-lg sm:max-lg",
      className,
    )}
    {...props}
  />
));
DialogContent.displayName = "DialogContent";

const DialogHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
);
DialogHeader.displayName = "DialogHeader";

const DialogTitle = ({ className, ...props }) => (
  <h2 className={cn("text-lg font-semibold text-slate-900", className)} {...props} />
);
DialogTitle.displayName = "DialogTitle";

const DialogDescription = ({ className, ...props }) => (
  <p className={cn("text-sm text-slate-500", className)} {...props} />
);
DialogDescription.displayName = "DialogDescription";

const DialogClose = forwardRef(({ className, ...props }, ref) => (
  <button ref={ref} className={cn("rounded-sm text-slate-500 ring-offset-background transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:pointer-events-none data-[state=open]:bg-slate-100", "size-7 p-1", className)} {...props}>
    <X className="size-4" />
    <span className="sr-only">Close</span>
  </button>
));
DialogClose.displayName = "DialogClose";

const DialogFooter = ({ className, ...props }) => (
  <div className={cn("mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end", className)} {...props} />
);
DialogFooter.displayName = "DialogFooter";

export { DialogOverlay, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose, DialogFooter };
