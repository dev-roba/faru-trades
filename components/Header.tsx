"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { businesses, CONSUMER } from "@/lib/data";
import { useStore } from "@/lib/store";

export function Mark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect x="1.5" y="1.5" width="29" height="29" fill="#FFC72C" stroke="#111" strokeWidth="3" />
      <path d="M2 30L16 2l14 28z" fill="#E8452C" stroke="#111" strokeWidth="2" />
      <circle cx="16" cy="21" r="4" fill="#1F3FBF" stroke="#111" strokeWidth="2" />
    </svg>
  );
}

const links = [["/", "Directory"], ["/orders", "Orders"], ["/dashboard", "Wallet"], ["/economics", "Economics"]];

export default function Header() {
  const path = usePathname();
  const { s, act } = useStore();
  return (
    <header className="top">
      <div className="wrap">
        <Link href="/" className="brand"><Mark />FARU TRADES <small>bizz.it</small></Link>
        <nav className="main" aria-label="Main">
          {links.map(([href, label]) => (
            <Link key={href} href={href} aria-current={path === href ? "page" : undefined}>{label}</Link>
          ))}
        </nav>
        <label className="acting">Acting as
          <select value={s.actingAs} onChange={(e) => act(e.target.value)} aria-label="Acting as">
            {businesses.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            <option value={CONSUMER.id}>{CONSUMER.name} (B2C)</option>
          </select>
        </label>
      </div>
    </header>
  );
}
