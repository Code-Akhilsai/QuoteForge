import { forwardRef } from "react";
import { cn } from "@/utils/helpers";

const TableContainer = ({ className, ...props }) => (
  <div className={cn("rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden", className)} {...props} />
);
TableContainer.displayName = "TableContainer";

const Table = forwardRef(({ className, ...props }, ref) => (
  <table ref={ref} className={cn("w-full text-sm caption-bottom", className)} {...props} />
));
Table.displayName = "Table";

const TableHeader = ({ className, ...props }) => (
  <thead className={cn("[&_tr]:border-b [&_tr]:border-slate-100", className)} {...props} />
);
TableHeader.displayName = "TableHeader";

const TableBody = ({ className, ...props }) => (
  <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />
);
TableBody.displayName = "TableBody";

const TableFooter = ({ className, ...props }) => (
  <tfoot className={cn("[&_tr]:border-b [&_tr]:border-slate-100", className)} {...props} />
);
TableFooter.displayName = "TableFooter";

const TableRow = ({ className, ...props }) => (
  <tr className={cn("[&_td]:border-b [&_td]:border-slate-100 [&_td]:p-4 [&_th]:p-4 [&_th]:font-medium [&_th]:text-left [&_th]:text-slate-600 [&_td]:text-slate-900 [&_th]:first:rounded-tl-xl [&_th]:last:rounded-tr-xl [&_td]:first:rounded-tl-xl [&_td]:last:rounded-tr-xl hover:[&_td]:bg-slate-50", className)} {...props} />
);
TableRow.displayName = "TableRow";

const TableHead = ({ className, ...props }) => (
  <th className={cn("font-medium text-slate-600", className)} {...props} />
);
TableHead.displayName = "TableHead";

const TableCell = ({ className, ...props }) => (
  <td className={cn("text-slate-900", className)} {...props} />
);
TableCell.displayName = "TableCell";

export { TableContainer, Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell };
export default Table;
