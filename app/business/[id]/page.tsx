"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { businesses, type Service } from "@/lib/data";
import { useStore } from "@/lib/store";
import { feeOf } from "@/lib/escrow";
import { ksh } from "@/lib/format";
import Chat from "@/components/Chat";

export default function Profile() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { s, isVerified, placeOrder, biz } = useStore();
  const [open, setOpen] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const b = biz.find((x) => x.id === id);
  if (!s.ready) return <div className="wrap page">Loading...</div>;
  if (!b) return <div className="wrap page"><h1>Business not found</h1><p className="sub"><Link href="/">Back to the directory</Link></p></div>;

  const buy = (svc: Service) => { const e = placeOrder(b, svc); if (e) setErr(e); else router.push("/orders"); };
  const self = s.actingAs === b.id;

  return (
    <div className="wrap page">
      <Link href="/" className="sub">Directory</Link>
      <h1 style={{ marginTop: 10 }}>{b.name} {isVerified(b.id) ? <span className="tag ok">Verified</span> : <span className="tag wait">Verification pending</span>}</h1>
      <p className="sub">{b.category} in {b.city}. {b.jobs ? `Rated ${b.rating} over ${b.jobs} jobs.` : "New on Faru Trades."}</p>
      <p style={{ maxWidth: "62ch" }}>{b.about}</p>

      <div className="grid2">
        <div>
          <h2 style={{ fontSize: 22 }}>Services</h2>
          {b.services.map((svc) => (
            <div className="svc" key={svc.id}>
              <div className="top"><strong>{svc.title}</strong><span className="price">{ksh(svc.price)}</span></div>
              <div className="sub">{svc.blurb} Delivered in {svc.days} day{svc.days > 1 ? "s" : ""}. <span className="tag">{svc.mode}</span></div>
              {!self && open !== svc.id && <div className="actions"><button className="btn sm" onClick={() => { setOpen(svc.id); setErr(null); }}>{svc.mode === "B2C" ? "Buy" : "Order"}</button></div>}
              {open === svc.id && (
                <>
                  <div className="break">
                    <div><span>Paid into escrow now</span><b>{ksh(svc.price)}</b></div>
                    <div><span>Faru Trades commission (2.5%)</span><span>{ksh(feeOf(svc.price))}</span></div>
                    <div><span>Supplier receives</span><span>{ksh(svc.price - feeOf(svc.price))}</span></div>
                    <div><span>Funds unlock</span><span>day {svc.days + 4} after order</span></div>
                  </div>
                  {err && <p className="err" role="alert">{err}</p>}
                  <div className="actions">
                    <button className="btn" onClick={() => buy(svc)}>Pay {ksh(svc.price)} into escrow</button>
                    <button className="btn ghost" onClick={() => { setOpen(null); setErr(null); }}>Cancel</button>
                  </div>
                </>
              )}
            </div>
          ))}
          {self && <p className="note">This is your own profile, so ordering is switched off. Use "Acting as" at the top to be a buyer.</p>}
        </div>
        {!self && <Chat withId={b.id} />}
      </div>
    </div>
  );
}
