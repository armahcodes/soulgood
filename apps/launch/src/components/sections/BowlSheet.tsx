"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { animate, motion, useDragControls, useMotionValue, useReducedMotion, useTransform, type PanInfo } from "motion/react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CURRENT_OFFER, type CurrentBowl } from "@/lib/current-offer";
import { mixFeaturing } from "@/lib/pathway-mix";
import { haptic } from "@/lib/haptics";

/**
 * Bowl details as a native bottom sheet on phones and a centered dialog on
 * larger screens — brand adaptation of 21st.dev kokonutd/smooth-drawer and
 * ruixen.ui/bottom-drawers. Built on <dialog> for focus trapping, Escape, and
 * an inert background; drag the handle (or swipe the sheet) down to dismiss.
 */
export function BowlSheet({ bowl, onClose }: { bowl: CurrentBowl | null; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const reduced = useReducedMotion();
  const drag = useDragControls();
  const y = useMotionValue(0);
  const backdrop = useTransform(y, [0, 400], [1, 0]);

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (bowl && !el.open) {
      y.set(0);
      el.showModal();
      document.documentElement.style.overflow = "hidden";
    }
    if (!bowl && el.open) el.close();
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [bowl, y]);

  const dismiss = () => {
    if (reduced) return onClose();
    animate(y, 600, { duration: 0.25, ease: [0.4, 0, 1, 1] }).then(onClose);
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 110 || info.velocity.y > 600) dismiss();
    else animate(y, 0, { type: "spring", stiffness: 420, damping: 36 });
  };

  const startMix = () => {
    if (!bowl) return;
    haptic();
    window.sessionStorage.setItem("soulbowls:bowlSelection", JSON.stringify(mixFeaturing(bowl.id)));
    window.sessionStorage.setItem("soulbowls:peopleCount", "1");
    window.sessionStorage.setItem("soulbowls:mealsPerDay", "1");
    router.push("/checkout");
  };

  return (
    <dialog
      ref={dialog}
      aria-labelledby="bowl-sheet-title"
      onCancel={(event) => {
        event.preventDefault();
        dismiss();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) dismiss();
      }}
      className="m-0 h-full max-h-none w-full max-w-none bg-transparent p-0 backdrop:bg-transparent open:flex open:items-end md:open:items-center md:open:justify-center"
    >
      <motion.div
        aria-hidden="true"
        style={{ opacity: backdrop }}
        className="pointer-events-none fixed inset-0 bg-forest/45 backdrop-blur-[2px]"
      />
      {bowl ? (
        <motion.div
          key={bowl.id}
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
          className="relative max-h-[92dvh] w-full overflow-y-auto overscroll-contain rounded-t-[1.25rem] bg-oat shadow-[0_-20px_60px_-20px_rgb(44_58_52/0.55)] md:max-w-2xl md:rounded-lg md:pb-6"
        >
          <div
            onPointerDown={(event) => drag.start(event)}
            className="sticky top-0 z-10 flex cursor-grab touch-none justify-center bg-oat/90 pt-3 pb-2 backdrop-blur active:cursor-grabbing md:hidden"
          >
            <span className="h-1.5 w-11 rounded-full bg-forest/20" aria-hidden="true" />
          </div>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Close bowl details"
            className="absolute top-4 right-4 z-20 flex size-11 items-center justify-center rounded-full bg-oat/90 text-forest shadow-sm backdrop-blur transition-colors hover:bg-forest hover:text-oat"
          >
            <X className="size-5" aria-hidden />
          </button>

          <div className="grid md:grid-cols-[0.9fr_1.1fr]">
            <div
              onPointerDown={(event) => drag.start(event)}
              className={`relative mx-5 aspect-[4/3] touch-none overflow-hidden rounded-lg md:m-0 md:aspect-auto md:min-h-full md:rounded-none md:rounded-l-lg ${bowl.tone}`}
            >
              <Image src={bowl.imagePath} alt={`${bowl.name} in a 32 ounce Soul Good jar`} fill unoptimized sizes="(min-width: 768px) 320px, 100vw" className="object-cover" />
              {!bowl.available ? (
                <span className="absolute top-3 left-3 rounded-md bg-forest px-2.5 py-1.5 text-[0.62rem] font-bold tracking-[0.14em] text-oat uppercase">Sold out</span>
              ) : null}
            </div>

            <div className="px-5 pt-5 md:p-8">
              <p className="text-[0.65rem] font-bold tracking-[0.18em] text-clay uppercase">{bowl.serving} · 32 oz jar</p>
              <h2 id="bowl-sheet-title" className="mt-2 text-4xl leading-none tracking-[-0.03em] text-forest">{bowl.name}</h2>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {bowl.dietary.map((tag) => (
                  <span key={tag} className="rounded-full border border-forest/12 bg-card px-3 py-1 text-xs font-semibold text-forest/75">
                    {tag}
                  </span>
                ))}
              </div>

              <dl className="mt-6 grid gap-4 text-sm leading-6">
                <div>
                  <dt className="text-[0.65rem] font-bold tracking-[0.16em] text-forest/60 uppercase">What’s inside</dt>
                  <dd className="mt-1 text-forest/80">{bowl.ingredients}</dd>
                </div>
                <div>
                  <dt className="text-[0.65rem] font-bold tracking-[0.16em] text-forest/60 uppercase">Allergens</dt>
                  <dd className="mt-1">
                    {bowl.allergen ? (
                      <span className="font-semibold text-clay">{bowl.allergen}</span>
                    ) : (
                      <span className="text-forest/75">No named major allergen on the current label. Cross-contact can still occur.</span>
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.65rem] font-bold tracking-[0.16em] text-forest/60 uppercase">Enjoy it</dt>
                  <dd className="mt-1 text-forest/75">
                    {CURRENT_OFFER.coldServing} {CURRENT_OFFER.warmServing}
                  </dd>
                </div>
              </dl>

              <div className="sticky bottom-0 mt-6 -mx-5 grid gap-2 border-t border-forest/10 bg-oat px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:static md:mx-0 md:border-0 md:bg-transparent md:px-0 md:pt-2 md:pb-0">
                <Button type="button" size="lg" className="w-full" disabled={!bowl.available} onClick={startMix}>
                  {bowl.available ? "Build a mix with this bowl" : "Sold out this week"}
                </Button>
                <p className="text-center text-xs text-forest/60">
                  {bowl.available ? "Starts you with two of these and a variety of the others. Change anything at checkout." : "Check back soon, or choose another bowl."}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </dialog>
  );
}
