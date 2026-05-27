import React from "react";
import clsx from "clsx";
import { RippleButton } from "@/components/ripple-button";

export type ButtonVariant = "coral" | "emerald" | "white";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  className?: string;
  children: React.ReactNode;
}

const base =
  "inline-flex items-center justify-center rounded-full font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 min-h-[44px] px-6 py-3 text-[16px] shadow-md disabled:opacity-60 disabled:cursor-not-allowed";

const variantStyles: Record<ButtonVariant, string> = {
  coral:
    "bg-coral text-white hover:bg-coral-deep shadow-coral/20 focus-visible:ring-coral border-0",
  emerald:
    "bg-white border-2 border-emerald-mid text-emerald-mid hover:bg-emerald-mid hover:text-white focus-visible:ring-emerald-mid",
  white:
    "bg-white text-navy border-2 border-navy hover:bg-emerald-mid hover:text-white focus-visible:ring-emerald-mid",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "coral", className, children, ...props }, ref) => (
    <RippleButton
      ref={ref}
      className={clsx(base, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </RippleButton>
  )
);
Button.displayName = "Button";
