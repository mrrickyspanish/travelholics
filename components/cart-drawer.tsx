"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X, Minus, Plus, ShoppingBag, ShieldCheck, ArrowRight, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/lib/cart-context";
import { formatMerchPrice } from "@/lib/shop-catalog";

export function CartDrawer() {
  const { items, count, subtotal, removeItem, updateQty, clearCart, drawerOpen, closeDrawer } = useCart();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Lock scroll while open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  // ESC to close
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeDrawer(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [drawerOpen, closeDrawer]);

  async function handleCheckout() {
    if (!items.length) return;
    setIsPending(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: items.map((i) => ({ productId: i.productId, quantity: i.quantity, color: i.color, size: i.size })) }),
      });
      const data = await res.json() as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? "Checkout failed.");
      clearCart();
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm"
            onClick={closeDrawer}
            aria-hidden
          />

          {/* Drawer panel */}
          <motion.div
            ref={drawerRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 36 }}
            className="fixed right-0 top-0 bottom-0 z-[201] flex w-full max-w-[420px] flex-col bg-white shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-[#059669]" />
                <span className="text-[0.95rem] font-bold text-[#0a1a2e]">
                  Your Cart {count > 0 && <span className="ml-1 text-[#059669]">({count})</span>}
                </span>
              </div>
              <button
                onClick={closeDrawer}
                aria-label="Close cart"
                className="flex h-8 w-8 items-center justify-center rounded-full text-stone-400 transition-colors hover:bg-stone-100 hover:text-[#0a1a2e]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                  <ShoppingBag className="h-12 w-12 text-stone-200" />
                  <p className="text-[0.88rem] font-semibold text-stone-400">Your cart is empty</p>
                  <button
                    onClick={closeDrawer}
                    className="mt-2 text-[0.8rem] font-semibold text-[#059669] underline underline-offset-2"
                  >
                    Continue shopping
                  </button>
                </div>
              ) : (
                <ul className="flex flex-col gap-5">
                  {items.map((item) => (
                    <li key={item.productId} className="flex gap-4">
                      {/* Thumbnail */}
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-stone-50">
                        <Image src={item.image} alt={item.name} fill className="object-contain p-2" sizes="80px" />
                      </div>

                      {/* Details */}
                      <div className="flex flex-1 flex-col justify-between min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-[0.85rem] font-bold leading-snug text-[#0a1a2e]">
                            {item.displayName ?? item.name}
                          </p>
                          <button
                            onClick={() => removeItem(item.productId)}
                            aria-label={`Remove ${item.name}`}
                            className="flex-shrink-0 text-stone-300 transition-colors hover:text-rose-400"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          {/* Qty stepper */}
                          <div className="flex items-center gap-2 rounded-lg border border-stone-200 px-2 py-1">
                            <button
                              onClick={() => updateQty(item.productId, item.quantity - 1)}
                              aria-label="Decrease quantity"
                              className="flex h-4 w-4 items-center justify-center text-stone-400 transition-colors hover:text-[#0a1a2e]"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-4 text-center text-[0.8rem] font-bold text-[#0a1a2e]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQty(item.productId, item.quantity + 1)}
                              aria-label="Increase quantity"
                              className="flex h-4 w-4 items-center justify-center text-stone-400 transition-colors hover:text-[#0a1a2e]"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          <span className="text-[0.88rem] font-black text-[#1e3a8a]">
                            {formatMerchPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-stone-100 px-6 py-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-[0.85rem] font-semibold text-stone-500">Subtotal</span>
                  <span className="text-[1.1rem] font-black text-[#0a1a2e]">{formatMerchPrice(subtotal)}</span>
                </div>

                {error && (
                  <p className="mb-3 rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600">{error}</p>
                )}

                <button
                  onClick={handleCheckout}
                  disabled={isPending}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#059669] py-4 text-[0.95rem] font-bold text-white transition-all hover:bg-[#047857] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPending ? "Opening checkout…" : "Checkout"}
                  {!isPending && <ArrowRight className="h-4 w-4" />}
                </button>

                <div className="mt-3 flex items-center justify-center gap-1.5 text-[0.68rem] font-semibold text-stone-400">
                  <ShieldCheck className="h-3 w-3 text-[#059669]" />
                  Secure checkout via Stripe
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
