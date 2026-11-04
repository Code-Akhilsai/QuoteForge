import { forwardRef } from "react";
import { cn } from "@/utils/helpers";

const Avatar = forwardRef(({ className, src, alt, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full", className)}
      {...props}
    >
      {src ? (
        <img src={src} alt={alt} className="aspect-square h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-100 text-slate-500 text-xs font-semibold">
          {alt?.charAt(0)?.toUpperCase() || "?"}
        </div>
      )}
    </div>
  );
});

Avatar.displayName = "Avatar";

export { Avatar };
export default Avatar;
