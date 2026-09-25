"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { animate, motion, useDragControls, useMotionValue, useReducedMotion, useTransform, type PanInfo } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A native bottom sheet on phones and a centered dialog on larger screens —
 * brand adaptation of 21st.dev kokonutd/smooth-drawer and ruixen.ui/bottom-drawers.
 * Built on <dialog> for focus trapping, Escape, and an inert background; drag
 * the handle down (or swipe fast) to dismiss.
 */
export function BottomSheet({
  open,
  onClose,
  labelledBy,
  closeLabel,
  footer,
  className,
  children,
}: {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  closeLabel: string;
  /** Pinned to the bottom of the sheet (e.g. the primary action). */
  footer?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const reduced = useReducedMotion();
  const drag = useDragControls();
  const y = useMotionValue(0);
  const backdrop = useTransform(y, [0, 400], [1, 0]);

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (open && !el.open) {
      y.set(0);
      el.showModal();
      document.documentElement.style.overflow = "hidden";
    }
    if (!open && el.open) el.close();
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open, y]);

  const dismiss = () => {
    if (reduced) return onClose();
    animate(y, 600, { duration: 0.25, ease: [0.4, 0, 1, 1] }).then(onClose);
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 110 || info.velocity.y > 600) dismiss();
    else animate(y, 0, { type: "spring", stiffness: 420, damping: 36 });
  };

  return (
    <dialog
      ref={dialog}
      aria-labelledby={labelledBy}
      onCancel={(event) => {
        event.preventDefault();
        dismiss();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) dismiss();
      }}
      className="m-0 h-full max-h-none w-full max-w-none bg-transparent p-0 backdrop:bg-transparent open:flex open:items-end md:open:items-center md:open:justify-center"
    >
      <motion.div aria-hidden="true" style={{ opacity: backdrop }} className="pointer-events-none fixed inset-0 bg-forest/45 backdrop-blur-[2px]" />
      {open ? (
        <motion.div
          style={{ y }}
          initial={reduced ? false : { y: 480, opacity: 0.6 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 340, damping: 34 }}
          drag="y"
          dragListener={false}
          dragControls={drag}
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0.05, bottom: 0.9 }}
          onDragEnd={onDragEnd}
          className={cn(
            "relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-[1.25rem] bg-oat shadow-[0_-20px_60px_-20px_rgb(44_58_52/0.55)] md:max-w-2xl md:rounded-lg",
            className,
          )}
        >
          <div
            onPointerDown={(event) => drag.start(event)}
            className="absolute inset-x-0 top-0 z-10 flex cursor-grab touch-none justify-center bg-linear-to-b from-oat via-oat/85 to-transparent pt-3 pb-5 active:cursor-grabbing md:hidden"
          >
            <span className="h-1.5 w-11 rounded-full bg-forest/25" aria-hidden="true" />
          </div>
          <button
            type="button"
            onClick={dismiss}
            aria-label={closeLabel}
            className="absolute top-4 right-4 z-20 flex size-11 items-center justify-center rounded-full bg-oat/90 text-forest shadow-sm backdrop-blur transition-colors hover:bg-forest hover:text-oat"
          >
            <X className="size-5" aria-hidden />
          </button>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
          {footer ? (
            <div className="shrink-0 border-t border-forest/10 bg-oat px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:px-8 md:pb-6">
              {footer}
            </div>
          ) : null}
        </motion.div>
      ) : null}
    </dialog>
  );
}
