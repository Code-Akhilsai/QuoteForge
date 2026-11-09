import { forwardRef } from "react";
import { cn } from "@/utils/helpers";

const Select = forwardRef(
  (
    {
      className,
      label,
      value,
      onValueChange,
      onChange,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {label}
          </label>
        )}
        <select
          ref={ref}
          value={value ?? ""}
          onChange={(e) => {
            onChange?.(e);
            onValueChange?.(e.target.value);
          }}
          disabled={disabled}
          className={cn(
            "flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
            className,
          )}
          {...props}
        >
          {children}
        </select>
      </div>
    );
  },
);

Select.displayName = "Select";

export { Select };
export default Select;
