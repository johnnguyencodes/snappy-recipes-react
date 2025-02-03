import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative z-10 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-lightmode-background dark:ring-offset-darkmode-background ring-offset-2 transition-colors focus:outline-none focus:ring-2 focus:ring-lightmode-red dark:focus:ring-darkmode-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lightmode-red dark:focus-visible:ring-darkmode-yellow disabled:pointer-events-none disabled:opacity-50 transition focus-visible:ring duration-300 focus:ring",
  {
    variants: {
      variant: {
        default:
          "border-1 border-lightmode-panel bg-lightmode-dimmed5 text-lightmode-text hover:bg-lightmode-dimmed3/80 dark:border-darkmode-dark1 dark:bg-darkmode-dimmed5 dark:text-darkmode-text dark:hover:bg-darkmode-dimmed4/80",
        image:
          "border-1 border-lightmode-panel bg-lightmode-dimmed5 text-lightmode-text dark:text-darkmode-text",
        primary:
          "border-lightmode-panel bg-lightmode-red text-lightmode-background hover:bg-lightmode-purple dark:border-darkmode-dark1 dark:bg-darkmode-yellow dark:text-darkmode-background dark:hover:bg-darkmode-green",
        link: "bg-lightmode-red text-lightmode-background decoration-2 underline-offset-4 hover:bg-lightmode-purple hover:underline dark:bg-darkmode-yellow dark:text-darkmode-background dark:hover:bg-darkmode-green",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
