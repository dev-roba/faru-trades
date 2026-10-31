"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { businesses, categories, type Mode } from "@/lib/data";
import { useStore } from "@/lib/store";
import { ksh } from "@/lib/format";
import Pulse from "@/components/Pulse";

export default function Directory() {
  const { s, isVerified, biz } = useStore();
  const cats = Array.from(new Set(biz.map((b) => b.category)));
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode | null>(null);

  const list = useMemo(() => biz.filter((b) => {
    if (b.id === s.actingAs) return false;
    if (cat && b.category !== cat) return false;
    if (mode && !b.services.some((x) => x.mode === mode)) return false;
    const hay = (b.name + b.city + b.category + b.services.map((x) => x.title).join(" ")).toLowerCase();
    return hay.includes(q.toLowerCase());
  }), [q, cat, mode, s.actingAs, biz]);

  return (
    <>
      <div className="wrap hero">
        <h1>Trade with businesses you have <mark>never met.</mark></h1>
        <p>Every business here is screened. Every payment sits in escrow until the work is delivered and the dispute window has closed.</p>
        <div className="stickers"><div className="sticker c"><b>2.5%</b>only, per transaction</div><div className="sticker b"><b>+4 days</b>dispute window before payout</div></div>
        <div style={{ marginTop: 28 }}><Pulse /></div>
        <p className="demo-note">Demo build with simulated payments. Figures above update as you trade.</p>
        <div className="search">
          <input type="search" placeholder="Search freight, printing, insurance, Mombasa..." value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search the directory" />
        </div>
        <div className="chips" role="group" aria-label="Filters">
          {cats.map((c) => <button key={c} className="chip" aria-pressed={cat === c} onClick={() => setCat(cat === c ? null : c)}>{c}</button>)}
          <button className="chip" aria-pressed={mode === "B2B"} onClick={() => setMode(mode === "B2B" ? null : "B2B")}>Sells to businesses</button>
          <button className="chip" aria-pressed={mode === "B2C"} onClick={() => setMode(mode === "B2C" ? null : "B2C")}>Sells to consumers</button>
        </div>

        <div className="ledger">
          {list.length === 0 && <p className="empty">No businesses match. Clear a filter or try another word.</p>}
          {list.map((b) => {
            const from = Math.min(...b.services.map((x) => x.price));
            return (
              <Link key={b.id} href={`/business/${b.id}`} className="row">
                <div>
                  <h3>{b.name} {isVerified(b.id) ? <span className="tag ok">Verified</span> : <span className="tag wait">Verification pending</span>}</h3>
                  <div className="meta">{b.category} in {b.city}. {b.services.length} service{b.services.length > 1 ? "s" : ""}{b.jobs ? `, rated ${b.rating} over ${b.jobs} jobs.` : ". New on Faru Trades."}</div>
                </div>
                <div className="meta">{[...new Set(b.services.map((x) => x.mode))].join(" and ")}</div>
                <div className="meta">from <span className="from">{ksh(from)}</span></div>
              </Link>
            );
          })}
        </div>
      </div>

      <section className="strip" aria-label="How escrow works">
        <div className="wrap">
          <h2>How your money is protected</h2>
          <p>Funds move only when it is safe to move them. The supplier gets paid after the delivery period plus four days.</p>
          <ol>
            <li><b>Funds in</b>Buyer pays into escrow</li>
            <li><b>Held</b>Locked for the delivery period</li>
            <li><b>Delivered</b>Supplier completes the work</li>
            <li><b>4-day hold</b>Dispute window stays open</li>
            <li><b>Released</b>Supplier withdraws, minus 2.5%</li>
          </ol>
        </div>
      </section>
    </>
  );
}
