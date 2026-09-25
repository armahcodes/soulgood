"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type PanInfo,
} from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Swipeable product stack — brand adaptation of 21st.dev
 * ayushmxxn/image-stack-carousel. The front jar can be dragged or swiped away
 * (it flies out, then tucks in behind the stack); arrow buttons and the
 * keyboard do the same. A slow idle rotation plays until the visitor interacts,
 * pauses on hover/focus, and is off under reduced motion.
 */

export type JarStackItem = {
  id: string;
  name: string;
  image: string;
  alt: string;
  meta: string;
  detail: string;
  /** Background tint behind the stack while this jar is in front (rgba). */
  tint: string;
};

const SWIPE_THRESHOLD = 90;
const AUTOPLAY_MS = 4200;
const SPRING = { type: "spring", stiffness: 260, damping: 28 } as const;

export function JarStack({ items, className }: { items: readonly JarStackItem[]; className?: string }) {
  const reduced = useReducedMotion();
  const [order, setOrder] = useState(() => items.map((item) => item.id));
  const [exiting, setExiting] = useState<{ id: string; dir: 1 | -1 } | null>(null);
  const [interacted, setInteracted] = useState(false);
  const [paused, setPaused] = useState(false);
  const byId = useMemo(() => new Map(items.map((item) => [item.id, item])), [items]);
  const front = byId.get(order[0])!;

  const next = useCallback(
    (dir: 1 | -1 = 1) => {
      if (exiting) return;
      if (dir === -1) {
        // Bring the last jar back to the front (reverse direction).
        setOrder((current) => [current[current.length - 1], ...current.slice(0, -1)]);
        return;
      }
      setExiting({ id: order[0], dir: 1 });
    },
    [exiting, order],
  );

  const finishExit = useCallback(() => {
    setOrder((current) => [...current.slice(1), current[0]]);
    setExiting(null);
  }, []);

  const userNext = (dir: 1 | -1) => {
    setInteracted(true);
    next(dir);
  };

  useEffect(() => {
    if (reduced || interacted || paused) return;
    const timer = window.setTimeout(() => next(1), AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [interacted, next, order, paused, reduced]);

  return (
    <div
      className={cn("relative flex flex-col items-center", className)}
      role="region"
      aria-roledescription="carousel"
      aria-label="This week’s Soul Bowls™"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") userNext(1);
        if (event.key === "ArrowLeft") userNext(-1);
      }}
    >
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 -z-10 rounded-lg"
        animate={{ backgroundColor: front.tint }}
        transition={{ duration: reduced ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
      />

      <div
        className="relative mt-2 aspect-[4/5] w-[min(54vw,16rem)] sm:w-[19rem] lg:w-[min(20vw,18.5rem)]"
        style={{ perspective: 1200 }}
      >
        {order.map((id, index) => {
          const item = byId.get(id)!;
          return (
            <StackCard
              key={id}
              item={item}
              index={index}
              total={order.length}
              exitDir={exiting?.id === id ? exiting.dir : null}
              reduced={Boolean(reduced)}
              onSwipe={(dir) => {
                setInteracted(true);
                if (!exiting) setExiting({ id, dir });
              }}
              onExitDone={finishExit}
            />
          );
        })}
      </div>

      <div className="mt-6 w-full max-w-sm px-5 text-center sm:mt-7" aria-live="polite" aria-atomic="true">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={front.id}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[0.62rem] font-bold tracking-[0.18em] text-forest/65 uppercase">{front.meta}</p>
            <p className="mt-2 font-serif text-3xl leading-none tracking-[-0.02em] text-forest">{front.name}</p>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-forest/72">{front.detail}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-5 mb-6 flex items-center gap-4">
        <button
          type="button"
          onClick={() => userNext(-1)}
          aria-label="Previous bowl"
          className="flex size-11 items-center justify-center rounded-full border border-forest/20 bg-oat/80 text-forest backdrop-blur transition-colors hover:border-forest hover:bg-forest hover:text-oat"
        >
          <ArrowLeft className="size-4" aria-hidden />
        </button>
        <div className="flex items-center gap-1.5" aria-hidden="true">
          {items.map((item) => (
            <span
              key={item.id}
              className={cn(
                "h-1.5 rounded-full transition-all duration-500 ease-(--ease-soft)",
                item.id === front.id ? "w-6 bg-forest" : "w-1.5 bg-forest/25",
              )}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => userNext(1)}
          aria-label="Next bowl"
          className="flex size-11 items-center justify-center rounded-full border border-forest/20 bg-oat/80 text-forest backdrop-blur transition-colors hover:border-forest hover:bg-forest hover:text-oat"
        >
          <ArrowRight className="size-4" aria-hidden />
        </button>
      </div>
      <p className="sr-only">Drag or swipe the front jar, or use the previous and next buttons, to see each bowl.</p>
    </div>
  );
}

function StackCard({
  item,
  index,
  total,
  exitDir,
  reduced,
  onSwipe,
  onExitDone,
}: {
  item: JarStackItem;
  index: number;
  total: number;
  exitDir: 1 | -1 | null;
  reduced: boolean;
  onSwipe: (dir: 1 | -1) => void;
  onExitDone: () => void;
}) {
  const isFront = index === 0;
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateY = useTransform(x, [-220, 220], [-14, 14]);
  const rotateX = useTransform(y, [-220, 220], [10, -10]);
  const dragRotate = useTransform(x, [-300, 300], [-10, 10]);

  // Fly out, hand off to the parent (which moves this jar to the back), then tuck in.
  useEffect(() => {
    if (exitDir === null) return;
    if (reduced) {
      onExitDone();
      return;
    }
    const distance = exitDir * 420;
    const flyX = animate(x, distance, { duration: 0.32, ease: [0.4, 0, 0.2, 1] });
    const flyY = animate(y, -24, { duration: 0.32 });
    flyX.then(() => {
      onExitDone();
      animate(x, 0, SPRING);
      animate(y, 0, SPRING);
    });
    return () => {
      flyX.stop();
      flyY.stop();
    };
  }, [exitDir, onExitDone, reduced, x, y]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const far = Math.abs(info.offset.x) > SWIPE_THRESHOLD || Math.abs(info.velocity.x) > 600;
    if (far) onSwipe(info.offset.x >= 0 ? 1 : -1);
    else {
      animate(x, 0, SPRING);
      animate(y, 0, SPRING);
    }
  };

  const depth = Math.min(index, 3);

  return (
    <motion.div
      className={cn("absolute inset-0 touch-pan-y select-none", isFront ? "cursor-grab active:cursor-grabbing" : "pointer-events-none")}
      style={{ x, y, rotateX: isFront ? rotateX : 0, rotateY: isFront ? rotateY : 0, rotateZ: isFront ? dragRotate : 0, zIndex: total - index }}
      drag={isFront && exitDir === null ? true : false}
      dragSnapToOrigin={false}
      dragElastic={0.6}
      dragMomentum={false}
      onDragEnd={onDragEnd}
      aria-hidden={!isFront}
    >
      <motion.div
        className="relative h-full w-full overflow-hidden rounded-lg bg-sand shadow-[0_30px_50px_-28px_rgb(44_58_52/0.55)]"
        initial={false}
        animate={{
          rotate: depth * 4.5,
          scale: 1 - depth * 0.045,
          y: depth * -6,
          opacity: index > 3 ? 0 : 1,
        }}
        style={{ transformOrigin: "85% 90%" }}
        transition={reduced ? { duration: 0 } : SPRING}
      >
        <Image
          src={item.image}
          alt={isFront ? item.alt : ""}
          fill
          unoptimized
          draggable={false}
          loading={index < 2 ? "eager" : "lazy"}
          fetchPriority={isFront ? "high" : "auto"}
          sizes="(min-width: 1024px) 24vw, 62vw"
          className="pointer-events-none object-cover"
        />
      </motion.div>
    </motion.div>
  );
}
