import * as React from "react";

import { cn } from "@/lib/utils";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ className, children, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={cn(
        "h-11 w-full appearance-none rounded-lg border border-white/15 bg-white/5 bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='%2394a3b8' stroke-width='1.75' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m5 7 5 6 5-6'/%3E%3C/svg%3E\")] bg-[length:1rem_1rem] bg-[right_0.75rem_center] bg-no-repeat px-3 pr-9 text-sm text-white transition-all duration-200 focus:border-blue-300/50 focus:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:shadow-[0_0_0_4px_rgba(56,189,248,0.15)] disabled:cursor-not-allowed disabled:opacity-50 [&>option]:bg-slate-900 [&>option]:text-slate-100",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
});
Select.displayName = "Select";

export { Select };
