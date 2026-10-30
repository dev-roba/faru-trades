import { stageOf, unlockAt, type Order } from "@/lib/escrow";
import { dateOf, daysUntil } from "@/lib/format";

const labels = ["Funds in", "Held", "Delivered", "4-day hold", "Released"];

export default function EscrowTimeline({ o, now }: { o: Order; now: number }) {
  const st = stageOf(o, now);
  const at = st === "released" ? 4 : st === "hold" ? 3 : st === "held" ? 1 : -1;
  const done = (i: number) => (st === "released" ? true : st === "hold" ? i <= 2 : st === "held" ? i <= 0 : false);
  return (
    <>
      <div className="steps" role="list" aria-label="Escrow progress">
        {labels.map((l, i) => (
          <div role="listitem" key={l} className={`step ${i === 0 ? "pay " : ""}${i === at ? "now" : done(i) ? "done" : ""}`}>{l}</div>
        ))}
      </div>
      <div className="meta" style={{ fontSize: 14, color: "var(--muted)" }}>
        {st === "held" && `Locked until the delivery period ends on ${dateOf(o.createdAt + o.deliveryDays * 86400000)}. Funds unlock ${dateOf(unlockAt(o))}.`}
        {st === "hold" && `Dispute window open. Funds unlock in ${daysUntil(unlockAt(o), now)} day(s), on ${dateOf(unlockAt(o))}.`}
        {st === "released" && "Released. The supplier can withdraw."}
        {st === "disputed" && "Frozen while support reviews the dispute."}
        {st === "refunded" && "Refunded to the buyer after a dispute ruling."}
      </div>
    </>
  );
}
