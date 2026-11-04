import { forwardRef } from "react";
import { cn } from "@/utils/helpers";

const Checkbox = forwardRef(({ className, checked, onCheckedChange, disabled, ...props }, ref) => {
  return (
    <label className={cn("flex items-center cursor-pointer gap-2", disabled && "opacity-50 cursor-not-allowed", className)}>
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        disabled={disabled}
        className={cn(
          "size-4 rounded border-slate-200 text-indigo-600 focus:ring-0",
          className,
        )}
        {...props}
      />
    </label>
  );
});

Checkbox.displayName = "Checkbox";

export { Checkbox };
export default Checkbox;
