export const DAY = 86_400_000;
export const HOLD_DAYS = 4;
export const FEE_RATE = 0.025;

export type Order = {
  id: string; buyerId: string; supplierId: string; serviceId: string; title: string;
  amount: number; deliveryDays: number; mode: "B2B" | "B2C"; createdAt: number; delivered: boolean;
  dispute?: { reason: string; ruling?: "refund" | "release" };
};
export type Stage = "held" | "hold" | "released" | "disputed" | "refunded";

export const unlockAt = (o: Order) => o.createdAt + (o.deliveryDays + HOLD_DAYS) * DAY;
export const feeOf = (amount: number) => Math.round(amount * FEE_RATE);
export const netOf = (o: Order) => o.amount - feeOf(o.amount);

/** The whole escrow engine in one function: where is this order's money right now? */
export function stageOf(o: Order, now: number): Stage {
  if (o.dispute?.ruling === "refund") return "refunded";
  if (o.dispute?.ruling === "release") return "released";
  if (o.dispute) return "disputed";
  if (now >= unlockAt(o)) return "released";
  if (o.delivered || now >= o.createdAt + o.deliveryDays * DAY) return "hold";
  return "held";
}

export function wallet(orders: Order[], id: string, now: number, withdrawn: number) {
  let pending = 0, released = 0, inEscrow = 0, spent = 0;
  for (const o of orders) {
    const s = stageOf(o, now);
    if (o.supplierId === id) {
      if (s === "released") released += netOf(o);
      else if (s !== "refunded") pending += netOf(o);
    }
    if (o.buyerId === id) {
      if (s === "held" || s === "hold" || s === "disputed") inEscrow += o.amount;
      else if (s === "released") spent += o.amount;
    }
  }
  return { pending, available: released - withdrawn, withdrawn, inEscrow, spent };
}
