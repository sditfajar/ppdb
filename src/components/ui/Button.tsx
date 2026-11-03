import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-control border border-transparent text-sm font-semibold transition-all duration-150 outline-none select-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 cursor-pointer [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[#1D4ED8] hover:bg-[#0037B0] text-white shadow-sm active:bg-[#0037B0] dark:bg-[#1D4ED8] dark:text-white",
        primary:
          "bg-[#1D4ED8] hover:bg-[#0037B0] text-white shadow-sm active:bg-[#0037B0] dark:bg-[#1D4ED8] dark:text-white",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground active:bg-muted/80",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/90 active:bg-secondary/95",
        ghost:
          "hover:bg-muted hover:text-foreground active:bg-muted/80",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 active:bg-destructive/95",
        danger:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 active:bg-destructive/95",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 min-h-[44px] sm:min-h-[40px] gap-2 px-4 text-sm",
        xs: "h-7 gap-1 px-2.5 text-xs",
        sm: "h-9 min-h-[44px] sm:min-h-[36px] gap-1.5 px-3 text-xs sm:text-sm",
        md: "h-11 min-h-[44px] gap-2 px-4 text-sm sm:text-base",
        lg: "h-12 min-h-[48px] gap-2.5 px-6 text-base font-bold",
        icon: "h-10 w-10 min-h-[44px] min-w-[44px] sm:min-h-[40px] sm:min-w-[40px]",
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
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
}

export function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  loading = false,
  iconLeft,
  iconRight,
  disabled,
  children,
  type = "button",
  ref,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  const isDisabled = disabled || loading;

  return (
    <Comp
      ref={ref}
      type={asChild ? undefined : type}
      data-slot="button"
      data-variant={variant}
      data-size={size}
      disabled={isDisabled}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin text-current" aria-hidden="true" />
          <span>{children}</span>
        </>
      ) : (
        <>
          {iconLeft && (
            <span className="shrink-0 inline-flex items-center" data-icon="inline-start">
              {iconLeft}
            </span>
          )}
          {children}
          {iconRight && (
            <span className="shrink-0 inline-flex items-center" data-icon="inline-end">
              {iconRight}
            </span>
          )}
        </>
      )}
    </Comp>
  );
}

export { buttonVariants };
