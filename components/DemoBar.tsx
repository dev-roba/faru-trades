"use client";
import { useStore } from "@/lib/store";
import { DAY } from "@/lib/escrow";

export default function DemoBar() {
  const { s, advance, reset } = useStore();
  const day = Math.round(s.offset / DAY);
  return (
    <div className="demobar" role="region" aria-label="Demo controls">
      <div className="wrap">
        <span>Demo clock: <b>{day === 0 ? "today" : `+${day} day${day === 1 ? "" : "s"}`}</b></span>
        <span className="sp" />
        <button className="btn sm" onClick={() => advance(1)}>+1 day</button>
        <button className="btn sm" onClick={() => advance(4)}>+4 days</button>
        <button className="btn sm" onClick={() => advance(7)}>+7 days</button>
        <button className="btn sm" onClick={() => { if (confirm("Reset all demo data?")) reset(); }}>Reset demo</button>
      </div>
    </div>
  );
}
