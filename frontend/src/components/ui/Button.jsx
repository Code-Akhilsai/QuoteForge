import { forwardRef } from "react";
import { cn } from "@/utils/helpers";

const Button = forwardRef(({ className, variant = "default", size = "medium", disabled, asChild = false, ...props }, ref) => {
  const Comp = asChild ? ({ children, ...rest }) => <span {...rest}>{children}</span> : "button";

  const variants = {
    default: "bg-slate-900 text-white hover:bg-slate-800",
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
    outline: "border border-slate-200 bg-transparent text-slate-900 hover:bg-slate-100",
    ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
    danger: "bg-rose-600 text-white hover:bg-rose-700",
    success: "bg-emerald-600 text-white hover:bg-emerald-700",
    warning: "bg-amber-600 text-white hover:bg-amber-700",
  };

  const sizes = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-4 py-2 text-sm",
    large: "px-6 py-3 text-base",
  };

  return (
    <Comp
      ref={ref}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none border",
        variants[variant],
        sizes[size],
        className,
      )}
      {...(asChild ? {} : { type: "button" })}
      {...props}
    />
  );
});

Button.displayName = "Button";

export { Button };
export default Button;
