"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import type { Business, Service } from "@/lib/data";
import { feeOf } from "@/lib/escrow";
import { ksh } from "@/lib/format";

type Phase = "form" | "sending" | "pin" | "ok" | "fail";
const OUTCOMES = { success: "Customer enters PIN (success)", cancel: "Customer cancels the prompt", funds: "Insufficient M-Pesa balance" } as const;

function normalize(p: string): string | null {
  const d = p.replace(/[\s+-]/g, "");
  if (/^0[17]\d{8}$/.test(d)) return "254" + d.slice(1);
  if (/^254[17]\d{8}$/.test(d)) return d;
  return null;
}
const code = () => {
  const a = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "S";
  for (let i = 0; i < 9; i++) s += a[Math.floor(Math.random() * a.length)];
  return s;
};

export default function MpesaCheckout({ svc, biz, onPaid, onClose }: {
  svc: Service; biz: Business; onPaid: (p: { receipt: string; phone: string }) => void; onClose: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("form");
  const [phone, setPhone] = useState("0712 345 678");
  const [outcome, setOutcome] = useState<keyof typeof OUTCOMES>("success");
  const [err, setErr] = useState<string | null>(null);
  const [fail, setFail] = useState("");
  const [receipt, setReceipt] = useState("");
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach((t) => clearTimeout(t)), []);
  const later = (fn: () => void, ms: number) => { timers.current.push(window.setTimeout(fn, ms)); };

  const start = (e: FormEvent) => {
    e.preventDefault();
    const n = normalize(phone);
    if (!n) { setErr("Enter a Safaricom number like 0712 345 678."); return; }
    setErr(null);
    setPhase("sending");
    later(() => setPhase("pin"), 1400);
    later(() => {
      if (outcome === "success") {
        const r = code();
        setReceipt(r);
        setPhase("ok");
        later(() => onPaid({ receipt: r, phone: "+" + n }), 2000);
      } else {
        setFail(outcome === "cancel" ? "Request cancelled by the customer. No money was taken." : "The M-Pesa balance is too low for this payment. No money was taken.");
        setPhase("fail");
      }
    }, 4600);
  };

  return (
    <div className="modal-bg" onClick={() => phase !== "ok" && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-label="Pay with M-Pesa" onClick={(e) => e.stopPropagation()}>
        <div className="g-head"><b>Pay with M-Pesa</b></div>
        <p className="sub">{svc.title} from {biz.name}</p>

        {phase === "form" && (
          <form className="form" onSubmit={start}>
            <div className="break">
              <div><span>Paid into escrow now</span><b>{ksh(svc.price)}</b></div>
              <div><span>Faru Trades commission (2.5%)</span><span>{ksh(feeOf(svc.price))}</span></div>
              <div><span>Supplier receives after hold</span><span>{ksh(svc.price - feeOf(svc.price))}</span></div>
            </div>
            <label htmlFor="mp">M-Pesa phone number</label>
            <input id="mp" type="text" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
            {err && <p className="err" role="alert">{err}</p>}
            <label htmlFor="oc">Demo outcome (presenter only)</label>
            <select id="oc" value={outcome} onChange={(e) => setOutcome(e.target.value as keyof typeof OUTCOMES)}>
              {Object.entries(OUTCOMES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <div className="actions">
              <button className="btn" type="submit">Send M-Pesa prompt</button>
              <button className="btn ghost" type="button" onClick={onClose}>Cancel</button>
            </div>
          </form>
        )}

        {phase === "sending" && <p role="status"><b>Sending request to {phone}...</b></p>}

        {phase === "pin" && (
          <div role="status">
            <p><b>Check your phone.</b> Enter your M-Pesa PIN to authorise.</p>
            <div className="mp-phone">
              <div className="mp-top">M-PESA</div>
              <div className="mp-body">Pay <b>{ksh(svc.price)}</b> to <b>FARU TRADES ESCROW</b>?<div className="mp-pin">&bull; &bull; &bull; &bull;</div></div>
            </div>
            <div className="mp-bar"><i /></div>
          </div>
        )}

        {phase === "ok" && (
          <div role="status">
            <p><span className="tag ok">Payment confirmed</span></p>
            <p><b>Receipt {receipt}.</b> {ksh(svc.price)} is now held in escrow. {biz.name} cannot touch it until delivery plus 4 days.</p>
          </div>
        )}

        {phase === "fail" && (
          <div role="alert">
            <p className="err">{fail}</p>
            <div className="actions">
              <button className="btn" onClick={() => setPhase("form")}>Try again</button>
              <button className="btn ghost" onClick={onClose}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
