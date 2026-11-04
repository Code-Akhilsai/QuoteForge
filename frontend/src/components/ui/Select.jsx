import { forwardRef, useRef, useEffect, useCallback } from "react";
import { cn } from "@/utils/helpers";

const Select = forwardRef(({ className, label, value, onValueChange, disabled, ...props }, ref) => {
  const selectRef = useRef(null);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        const select = selectRef.current;
        const options = Array.from(select?.options || []);
        const currentIndex = options.findIndex((o) => o.selected);
        if (e.key === "ArrowDown" && currentIndex < options.length - 1) {
          e.preventDefault();
          options[currentIndex + 1].selected = true;
          select.dispatchEvent(new Event("change"));
        } else if (e.key === "ArrowUp" && currentIndex > 0) {
          e.preventDefault();
          options[currentIndex - 1].selected = true;
          select.dispatchEvent(new Event("change"));
        }
      }
    },
    [],
  );

  useEffect(() => {
    const select = selectRef.current;
    if (!select) return;
    select.addEventListener("keydown", handleKeyDown);
    return () => select.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="w-full" ref={ref}>
      {label && <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>}
      <select
        ref={selectRef}
        value={value ?? ""}
        onChange={(e) => onValueChange?.(e.target.value)}
        disabled={disabled}
        className={cn(
          "flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    </div>
  );
});

Select.displayName = "Select";

export { Select };
export default Select;
