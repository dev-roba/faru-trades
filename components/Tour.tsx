"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { businesses } from "@/lib/data";

type C = ReturnType<typeof useStore>;
type R = ReturnType<typeof useRouter>;
const fl = businesses.find((b) => b.id === "faru-logistics")!;

const steps: { title: string; body: string; run: (c: C, r: R) => void }[] = [
  { title: "Meet the buyer", body: "Tembo Retail in Nairobi needs freight to Mombasa from a supplier it has never met. Every business in this directory is screened before it can trade.", run: (c, r) => { c.reset(); r.push("/"); } },
  { title: "Find and vet a supplier", body: "Tembo opens Faru Logistics: verified badge, rating, prices, delivery times. They can chat in the app to scope the job, and a warning appears if the deal is steered off-platform.", run: (_c, r) => r.push("/business/faru-logistics") },
  { title: "Pay into escrow", body: "Tembo approves an M-Pesa prompt for KSh 45,000. The money sits in escrow, not with the supplier. Faru Trades keeps 2.5% (KSh 1,125) only when the job completes.", run: (c, r) => { c.placeOrder(fl, fl.services[0], { receipt: "SDM4K7Q2XP", phone: "+254712345678" }); r.push("/orders"); } },
  { title: "The work is delivered", body: "Three days pass and the delivery period ends. The 4-day dispute window opens, and Tembo could freeze the funds right here.", run: (c) => c.advance(3) },
  { title: "No dispute, funds unlock", body: "Four quiet days later the hold ends and the payout unlocks automatically. Nobody had to chase anybody for money.", run: (c) => c.advance(4) },
  { title: "The supplier gets paid", body: "Switching to Faru Logistics. The available balance is the payout minus the 2.5% commission, and it can be withdrawn in one tap.", run: (c, r) => { c.act("faru-logistics"); r.push("/dashboard"); } },
  { title: "The business model", body: "Two engines: $25 per business per month, plus 2.5% of every transaction. Load the Low and Mid cases to see roughly $8K and $46K a month, and the unit economics below.", run: (c, r) => { c.act("tembo"); r.push("/economics"); } },
  { title: "Built to launch in 3 months", body: "Web app and PWA first, escrow engine included, KSh 84,000 MVP. Questions are welcome, and the Reset demo button at the bottom starts everything again.", run: (_c, r) => r.push("/") },
];

export default function Tour() {
  const c = useStore();
  const r = useRouter();
  const [i, setI] = useState<number | null>(null);
  const go = (n: number) => { setI(n); steps[n].run(c, r); };

  useEffect(() => {
    if (i === null) return;
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") setI(null);
      if (e.key === "ArrowRight" && i < steps.length - 1) go(i + 1);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  });

  if (i === null) return <button className="btn tour-start" onClick={() => go(0)}>Start investor tour</button>;
  const st = steps[i];
  const last = i === steps.length - 1;
  return (
    <aside className="tour" role="dialog" aria-label="Investor tour">
      <div className="tour-n">Step {i + 1} of {steps.length}</div>
      <h2>{st.title}</h2>
      <p>{st.body}</p>
      <div className="actions">
        {last ? <button className="btn" onClick={() => setI(null)}>Finish</button> : <button className="btn" onClick={() => go(i + 1)}>Next</button>}
        <button className="btn ghost" onClick={() => go(0)}>Restart</button>
        <button className="btn ghost" onClick={() => setI(null)}>Close</button>
      </div>
    </aside>
  );
}
