"use client";
import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { stageOf, feeOf, netOf } from "@/lib/escrow";
import { ksh, dateOf } from "@/lib/format";
import EscrowTimeline from "@/components/EscrowTimeline";

const badge = { held: ["wait", "Held in escrow"], hold: ["wait", "4-day hold"], released: ["ok", "Released"], disputed: ["bad", "Disputed"], refunded: ["bad", "Refunded"] } as const;

export default function Orders() {
  const { s, now, deliver, dispute, rule, nameOf } = useStore();
  const [tab, setTab] = useState<"buying" | "selling">("buying");
  const [reasonFor, setReasonFor] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  if (!s.ready) return <div className="wrap page">Loading...</div>;

  const mine = s.orders.filter((o) => (tab === "buying" ? o.buyerId === s.actingAs : o.supplierId === s.actingAs));

  return (
    <div className="wrap page">
      <h1>Orders</h1>
      <p className="sub">Watch the money move. Use the demo clock below to skip ahead through the delivery period and the 4-day hold.</p>
      <div className="tabs">
        <button className="chip" aria-pressed={tab === "buying"} onClick={() => setTab("buying")}>Buying</button>
        <button className="chip" aria-pressed={tab === "selling"} onClick={() => setTab("selling")}>Selling</button>
      </div>
      {mine.length === 0 && <p className="empty">Nothing here yet. <Link href="/">Find a supplier in the directory</Link> and place an order.</p>}
      {mine.map((o) => {
        const st = stageOf(o, now);
        const [cls, label] = badge[st];
        const other = tab === "buying" ? o.supplierId : o.buyerId;
        return (
          <article className="order" key={o.id}>
            <div className="head">
              <h3>{o.title}</h3>
              <span className={`tag ${cls}`}>{label}</span>
            </div>
            <div className="sub">{o.id}. {tab === "buying" ? "Supplier" : "Buyer"}: <Link href={`/business/${other}`}>{nameOf(other)}</Link>. Ordered {dateOf(o.createdAt)}. {o.mode}.</div>
            <div style={{ marginTop: 8 }}><strong>{ksh(o.amount)}</strong> <span className="sub">{tab === "selling" ? `you receive ${ksh(netOf(o))} after the ${ksh(feeOf(o.amount))} commission` : "paid into escrow"}</span></div>
            {o.receipt && <div className="sub">M-Pesa receipt {o.receipt} from {o.phone}</div>}
            <EscrowTimeline o={o} now={now} />
            {o.dispute && <p className="sub">Dispute reason: {o.dispute.reason}</p>}
            <div className="actions">
              {tab === "selling" && !o.delivered && (st === "held") && <button className="btn sm" onClick={() => deliver(o.id)}>Mark delivered</button>}
              {tab === "buying" && (st === "held" || st === "hold") && reasonFor !== o.id && <button className="btn sm warn" onClick={() => setReasonFor(o.id)}>Raise a dispute</button>}
              {st === "disputed" && (<>
                <span className="sub">Support ruling (demo):</span>
                <button className="btn sm ghost" onClick={() => rule(o.id, "refund")}>Refund buyer</button>
                <button className="btn sm ghost" onClick={() => rule(o.id, "release")}>Release to supplier</button>
              </>)}
            </div>
            {reasonFor === o.id && (
              <form className="actions" onSubmit={(e) => { e.preventDefault(); if (reason.trim()) { dispute(o.id, reason.trim()); setReasonFor(null); setReason(""); } }}>
                <input type="text" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="What went wrong?" aria-label="Dispute reason" style={{ flex: 1, minWidth: 220 }} />
                <button className="btn sm warn" type="submit">Freeze funds</button>
                <button className="btn sm ghost" type="button" onClick={() => setReasonFor(null)}>Cancel</button>
              </form>
            )}
          </article>
        );
      })}
    </div>
  );
}
