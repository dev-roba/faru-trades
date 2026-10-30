"use client";
import { useState } from "react";
import { RATE } from "@/lib/data";
import { ksh, usd } from "@/lib/format";

const presets = { low: { n: 150, t: 4, a: 300 }, mid: { n: 500, t: 6, a: 450 } };
const SALARIES = 140000, MARKETING = 75000; // KSh per month, from the operations deck

type SliderProps = { label: string; v: number; set: (x: number) => void; min: number; max: number; step?: number; fmt?: (x: number) => string };
function Slider({ label, v, set, min, max, step = 1, fmt = (x) => String(x) }: SliderProps) {
  return (
    <div className="field">
      <label>{label}<span>{fmt(v)}</span></label>
      <input type="range" min={min} max={max} step={step} value={v} onChange={(e) => set(+e.target.value)} aria-label={label} />
    </div>
  );
}

export default function Economics() {
  const [n, setN] = useState(150), [t, setT] = useState(4), [a, setA] = useState(300);
  const sub = n * 25, gmv = n * t * a, com = gmv * 0.025, rev = sub + com;
  const infra = n < 100 ? 100 : n < 300 ? 1300 : 1900;
  const net = rev * RATE - SALARIES - MARKETING - infra * RATE;

  return (
    <div className="wrap page">
      <h1>Platform economics</h1>
      <p className="sub">Two engines: a $25 monthly fee per business and 2.5% on every escrow transaction. Move the sliders or load a case from the proposal.</p>
      <div className="actions">
        <button className="chip" onClick={() => { setN(presets.low.n); setT(presets.low.t); setA(presets.low.a); }}>Low case</button>
        <button className="chip" onClick={() => { setN(presets.mid.n); setT(presets.mid.t); setA(presets.mid.a); }}>Mid case</button>
      </div>
      <div className="calc">
        <div>
          <Slider label="Active businesses" v={n} set={setN} min={10} max={1000} step={10} />
          <Slider label="Transactions per business, per month" v={t} set={setT} min={1} max={12} />
          <Slider label="Average transaction" v={a} set={setA} min={50} max={1000} step={10} fmt={(x) => "$" + x} />
        </div>
        <div>
          <div className="sub">Monthly revenue run-rate</div>
          <div className="big">{usd(rev)}</div>
          <table className="t"><tbody>
            <tr><td>Subscriptions</td><td>{usd(sub)}</td></tr>
            <tr><td>Commission (2.5% of {usd(gmv)} GMV)</td><td>{usd(com)}</td></tr>
            <tr><td>Infrastructure (deck tier)</td><td>{usd(infra)}</td></tr>
            <tr><td>People: salaries + marketing</td><td>{ksh(SALARIES + MARKETING)}</td></tr>
            <tr><td>Net per month after those costs</td><td style={{ color: net < 0 ? "var(--brick)" : "var(--acacia)" }}>{ksh(net)}</td></tr>
          </tbody></table>
          <p className="note">Illustrative planning estimates at KSh {RATE} per USD. Excludes management pay, tax and payment-processor fees.</p>
        </div>
      </div>
    </div>
  );
}
