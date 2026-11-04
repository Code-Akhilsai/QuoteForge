import { forwardRef } from "react";
import { cn } from "@/utils/helpers";

const Card = forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden", className)}
      {...props}
    />
  );
});

Card.displayName = "Card";

const CardHeader = ({ className, ...props }) => (
  <div className={cn("grid flex-1 p-4", className)} {...props} />
);

CardHeader.displayName = "CardHeader";

const CardTitle = ({ className, ...props }) => (
  <h3 className={cn("text-lg font-semibold leading-none tracking-tight text-slate-900", className)} {...props} />
);

CardTitle.displayName = "CardTitle";

const CardDescription = ({ className, ...props }) => (
  <p className={cn("text-sm text-slate-500", className)} {...props} />
);

CardDescription.displayName = "CardDescription";

const CardContent = ({ className, ...props }) => (
  <div className={cn("p-4 pt-0", className)} {...props} />
);

CardContent.displayName = "CardContent";

const CardFooter = ({ className, ...props }) => (
  <div className={cn("grid items-center p-4 pt-0", className)} {...props} />
);

CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
export default Card;
