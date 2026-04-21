"use client";

import { useState } from "react";

type Ripple = { x: number; y: number; size: number; id: number };

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  rippleColor?: string;
};

export const RippleButton = ({
  children,
  className = "",
  onClick,
  rippleColor = "rgba(255,255,255,0.3)",
  style,
  ...props
}: Props) => {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    const id = Date.now();
    setRipples((prev) => [...prev, { x, y, size, id }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 650);
    onClick?.(e);
  };

  return (
    <button
      {...props}
      className={`relative overflow-hidden ${className}`}
      style={style}
      onClick={handleClick}
    >
      {ripples.map((r) => (
        <span
          key={r.id}
          aria-hidden="true"
          className="pointer-events-none absolute rounded-full animate-ripple"
          style={{
            left: r.x,
            top: r.y,
            width: r.size,
            height: r.size,
            background: rippleColor,
          }}
        />
      ))}
      {children}
    </button>
  );
};
