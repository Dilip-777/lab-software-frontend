import { cva, type VariantProps } from "class-variance-authority";
import React from "react";
import { cn } from "../utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center  gap-1 active:translate-y-[1px] transition-transform duration-200 ease-in-out",
  {
    variants: {
      variant: {
        default: "bg-palatinateBlue hover:bg-backgroundHover text-white",
        unstyled: "border-none rounded-none",
        outlined:
          "text-palatinateBlue border border-palatinateBlue/20 hover:border-palatinateBlue/40",
      },
      size: {
        default: "font-bold py-2 px-3 text-sm rounded",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "size">,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  Icon?: React.ReactNode;
  label: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "default", size, loading, Icon, label, ...props },
    ref
  ) => {
    return (
      <button
        className={cn(
          buttonVariants({ variant, size, className }),
          loading && "bg-gray-200 hover:bg-gray-100 text-gray-500"
        )}
        disabled={loading}
        ref={ref}
        {...props}
      >
        {label}
        {loading && (
          <div
            className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] ml-1"
            role="status"
          ></div>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
