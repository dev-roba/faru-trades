"use client";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { CONSUMER, RATE, TIER_LIMIT } from "@/lib/data";
import { wallet, stageOf, feeOf } from "@/lib/escrow";
import { ksh } from "@/lib/format";

export default function Dashboard() {
  const { s, now, actor, isVerified, verify, withdraw } = useStore();
  const [busy, setBusy] = useState(false);
  if (!s.ready) return <div className="wrap page">Loading...</div>;
  if (actor.id === CONSUMER.id) return <div className="wrap page"><h1>Wallet</h1><p className="sub">Consumers pay at checkout and track orders under Orders. Switch to a business with "Acting as" to see a wallet.</p></div>;

  const w = wallet(s.orders, actor.id, now, s.withdrawn[actor.id] ?? 0);
  const sales = s.orders.filter((o) => o.supplierId === actor.id);
  const commission = sales.filter((o) => stageOf(o, now) === "released").reduce((a, o) => a + feeOf(o.amount), 0);
  const ok = isVerified(actor.id);

  return (
    <div className="wrap page">
      <h1>{actor.name}</h1>
      <p className="sub">Wallet and business dashboard.</p>

      <div className="stats">
        <div className="stat key"><span>Available to withdraw</span><b>{ksh(w.available)}</b></div>
        <div className="stat"><span>Pending in escrow (your sales)</span><b>{ksh(w.pending)}</b></div>
        <div className="stat"><span>Your purchases held in escrow</span><b>{ksh(w.inEscrow)}</b></div>
        <div className="stat"><span>Withdrawn so far</span><b>{ksh(w.withdrawn)}</b></div>
      </div>
      <div className="actions">
        <button className="btn" disabled={w.available <= 0} onClick={() => withdraw(actor.id, w.available)}>Withdraw {ksh(Math.max(0, w.available))}</button>
        {w.available <= 0 && <span className="sub">Nothing unlocked yet. Funds release at delivery period + 4 days.</span>}
      </div>

      <div className="grid2">
        <section className="panel">
          <h2>Verification</h2>
          {ok ? <p><span className="tag ok">Verified</span> Full limits unlocked, with a badge on your profile.</p> : (
            <>
              <p><span className="tag wait">Pending</span> Until you are verified, orders are capped at {ksh(TIER_LIMIT)} each.</p>
              <button className="btn" disabled={busy} onClick={() => { setBusy(true); setTimeout(() => { verify(actor.id); setBusy(false); }, 1400); }}>{busy ? "Checking registration..." : "Run verification check (demo)"}</button>
              <p className="note">In production this calls Youverify or Didit for identity and business registration checks.</p>
            </>
          )}
        </section>
        <section className="panel">
          <h2>What you pay Faru Trades</h2>
          <table className="t"><tbody>
            <tr><td>Monthly platform fee</td><td>$25 (about {ksh(25 * RATE)})</td></tr>
            <tr><td>Commission per transaction</td><td>2.5%</td></tr>
            <tr><td>Commission on released sales</td><td>{ksh(commission)}</td></tr>
          </tbody></table>
        </section>
      </div>
    </div>
  );
}
