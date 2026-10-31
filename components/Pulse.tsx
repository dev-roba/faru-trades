"use client";
import { useStore } from "@/lib/store";
import { stageOf, feeOf } from "@/lib/escrow";
import { ksh } from "@/lib/format";

export default function Pulse() {
  const { s, now } = useStore();
  if (!s.ready) return null;
  let held = 0, open = 0, done = 0, fee = 0;
  for (const o of s.orders) {
    const st = stageOf(o, now);
    if (st === "held" || st === "hold" || st === "disputed") { held += o.amount; open++; }
    if (st === "released") { done++; fee += feeOf(o.amount); }
  }
  return (
    <div className="stats" aria-label="Live platform figures">
      <div className="stat key"><span>Held in escrow right now</span><b>{ksh(held)}</b></div>
      <div className="stat"><span>Orders in progress</span><b>{open}</b></div>
      <div className="stat"><span>Orders completed</span><b>{done}</b></div>
      <div className="stat"><span>Commission earned (2.5%)</span><b>{ksh(fee)}</b></div>
    </div>
  );
}
