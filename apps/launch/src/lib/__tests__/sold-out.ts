import { CURRENT_BOWLS, type BowlId } from "@/lib/current-offer";

/** Runs `check` with a bowl temporarily marked sold out, so sold-out rules stay covered whatever this week's menu is. */
export async function withSoldOut<T>(id: BowlId, check: () => T | Promise<T>): Promise<T> {
  const bowl = CURRENT_BOWLS.find((item) => item.id === id)!;
  const previous = bowl.available;
  bowl.available = false;
  try {
    return await check();
  } finally {
    bowl.available = previous;
  }
}
