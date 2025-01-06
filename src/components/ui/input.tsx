import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "relative z-0 flex h-10 w-full rounded-md border border-input border-lightmode-panel bg-lightmode-panel px-3 py-2 text-sm ring-offset-background transition duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-lightmode-dimmed3 focus:ring-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-lightmode-text focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-darkmode-dark1 dark:bg-darkmode-dark1 dark:placeholder:text-darkmode-dimmed3 dark:focus:ring-darkmode-dark1 dark:focus-visible:ring-darkmode-text",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
