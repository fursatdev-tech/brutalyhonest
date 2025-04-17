import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { BeatLoader } from "react-spinners";
import { Variable } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-accent hover:bg-primary/90",
        white:
          "bg-background shadow-lg text-secondary hover:muted-background hover:shadow-2xl",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-accent hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary-light underline-offset-4 hover:underline",
        rounded: "px-2 py-1 border-primary border-2 rounded-full",
        roundedfill:
          "px-2 py-1 border-primary border-2 rounded-full font-bold bg-primary text-white",
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
  loading?: boolean;
}

const getLoaderSize = (size: string | null | undefined) => {
  switch (size) {
    case "sm":
      return 6;
    case "lg":
      return 10;
    default:
      return 8;
  }
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, loading = false, asChild = false, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {loading ? <BeatLoader size={getLoaderSize(size)} /> : props.children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
