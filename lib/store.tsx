"use client";
import { createContext, useContext, useEffect, useMemo, useReducer, useRef, type ReactNode } from "react";
import { businesses, CONSUMER, TIER_LIMIT, type Service, type Business } from "./data";
import { DAY, type Order } from "./escrow";

export type Msg = { id: string; from: string; to: string; text: string; at: number; warn?: boolean };
export type Account = { name: string; email: string; via: "google" | "email"; businessId?: string };
type State = {
  ready: boolean; actingAs: string; offset: number; orders: Order[]; messages: Msg[];
  verified: Record<string, boolean>; withdrawn: Record<string, number>;
  account: Account | null; extra: Business[];
};
type Action =
  | { t: "load"; s: State } | { t: "act"; id: string } | { t: "advance"; days: number } | { t: "reset" }
  | { t: "order"; o: Order } | { t: "deliver"; id: string } | { t: "dispute"; id: string; reason: string }
  | { t: "rule"; id: string; ruling: "refund" | "release" } | { t: "msg"; m: Msg }
  | { t: "verify"; id: string } | { t: "withdraw"; id: string; amount: number }
  | { t: "signin"; a: Account } | { t: "signout" } | { t: "addbiz"; b: Business };

const KEY = "faru-trades-demo-v1";
const uid = () => Math.random().toString(36).slice(2, 9);

function seed(): State {
  const n = Date.now();
  return {
    ready: true, actingAs: "tembo", offset: 0, verified: {}, withdrawn: {}, account: null, extra: [],
    orders: [
      { id: "FT-1001", buyerId: "tembo", supplierId: "faru-logistics", serviceId: "fl-1", title: "Nairobi to Mombasa freight, 7-tonne truck", amount: 45000, deliveryDays: 3, mode: "B2B", createdAt: n - 2 * DAY, delivered: false },
      { id: "FT-1000", buyerId: "tembo", supplierId: "kijani-print", serviceId: "kp-1", title: "Branded packaging, 500 units", amount: 28000, deliveryDays: 5, mode: "B2B", createdAt: n - 12 * DAY, delivered: true },
      { id: "FT-0999", buyerId: "pwani-fresh", supplierId: "tembo", serviceId: "tembo-1", title: "Shelf-ready merchandising audit", amount: 9000, deliveryDays: 3, mode: "B2B", createdAt: n - 9 * DAY, delivered: true },
      { id: "FT-0998", buyerId: "savanna-accounting", supplierId: "tembo", serviceId: "tembo-1", title: "Shelf-ready merchandising audit", amount: 9000, deliveryDays: 3, mode: "B2B", createdAt: n - 1 * DAY, delivered: false },
    ],
    messages: [
      { id: "m1", from: "faru-logistics", to: "tembo", text: "Truck is booked for Thursday. Send the pallet list when you can.", at: n - 2 * DAY },
      { id: "m2", from: "tembo", to: "faru-logistics", text: "Will do. Order placed through escrow.", at: n - 2 * DAY + 60000 },
    ],
  };
}

function reducer(s: State, a: Action): State {
  switch (a.t) {
    case "load": return a.s;
    case "signin": return { ...s, account: a.a, actingAs: a.a.businessId ?? s.actingAs };
    case "signout": return { ...s, account: null };
    case "addbiz": return { ...s, extra: [...s.extra, a.b] };
    case "act": return { ...s, actingAs: a.id };
    case "advance": return { ...s, offset: s.offset + a.days * DAY };
    case "reset": return seed();
    case "order": return { ...s, orders: [a.o, ...s.orders] };
    case "deliver": return { ...s, orders: s.orders.map((o) => (o.id === a.id ? { ...o, delivered: true } : o)) };
    case "dispute": return { ...s, orders: s.orders.map((o) => (o.id === a.id ? { ...o, dispute: { reason: a.reason } } : o)) };
    case "rule": return { ...s, orders: s.orders.map((o) => (o.id === a.id && o.dispute ? { ...o, dispute: { ...o.dispute, ruling: a.ruling } } : o)) };
    case "msg": return { ...s, messages: [...s.messages, a.m] };
    case "verify": return { ...s, verified: { ...s.verified, [a.id]: true } };
    case "withdraw": return { ...s, withdrawn: { ...s.withdrawn, [a.id]: (s.withdrawn[a.id] ?? 0) + a.amount } };
  }
}

// In-chat guardrail from the proposal: warn when a deal is being steered off-platform.
const OFF_PLATFORM = /(whatsapp|m-?pesa|pay (me )?direct|outside (the )?(platform|app)|send (it )?to my|\+?254\s?\d{6,}|\b0[17]\d{8}\b)/i;
const REPLIES = [
  "Sounds good. Can you confirm the quantity and delivery location?",
  "Thanks for the details. I can start as soon as the order is placed.",
  "Understood. I'll keep everything on the platform so it's on record.",
  "Yes, that timeline works for us.",
];

type Ctx = {
  account: Account | null; biz: Business[]; nameOf: (id: string) => string; signIn: (a: Account) => void; signOut: () => void; register: (b: Business, a: Account) => void;
  s: State; now: number; actor: { id: string; name: string }; isVerified: (id: string) => boolean;
  act: (id: string) => void; advance: (d: number) => void; reset: () => void;
  placeOrder: (b: Business, svc: Service) => string | null;
  deliver: (id: string) => void; dispute: (id: string, reason: string) => void; rule: (id: string, r: "refund" | "release") => void;
  send: (to: string, text: string) => void; verify: (id: string) => void; withdraw: (id: string, amount: number) => void;
};
const C = createContext<Ctx | null>(null);
export const useStore = () => { const c = useContext(C); if (!c) throw new Error("StoreProvider missing"); return c; };

export function StoreProvider({ children }: { children: ReactNode }) {
  const [s, d] = useReducer(reducer, { ready: false, actingAs: "tembo", offset: 0, orders: [], messages: [], verified: {}, withdrawn: {}, account: null, extra: [] } as State);
  const ref = useRef(s); ref.current = s;

  useEffect(() => {
    try { const raw = localStorage.getItem(KEY); d({ t: "load", s: raw ? { ...seed(), ...JSON.parse(raw), ready: true } : seed() }); }
    catch { d({ t: "load", s: seed() }); }
  }, []);
  useEffect(() => { if (s.ready) try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {} }, [s]);

  const value = useMemo<Ctx>(() => {
    const biz = [...businesses, ...s.extra];
    const nameOf = (id: string) => (id === CONSUMER.id ? CONSUMER.name : biz.find((b) => b.id === id)?.name ?? id);
    const isVerified = (id: string) => id === CONSUMER.id || (s.verified[id] ?? biz.find((b) => b.id === id)?.verified ?? false);
    const actor = s.actingAs === CONSUMER.id ? CONSUMER : biz.find((b) => b.id === s.actingAs) ?? businesses[0];
    const clock = () => Date.now() + ref.current.offset;
    return {
      s, now: Date.now() + s.offset, actor, isVerified, biz, nameOf, account: s.account,
      signIn: (a) => d({ t: "signin", a }), signOut: () => d({ t: "signout" }),
      register: (b, a) => { d({ t: "addbiz", b }); d({ t: "signin", a: { ...a, businessId: b.id } }); },
      act: (id) => d({ t: "act", id }),
      advance: (days) => d({ t: "advance", days }),
      reset: () => d({ t: "reset" }),
      placeOrder: (b, svc) => {
        const me = ref.current.actingAs;
        if (me === b.id) return "You can't order from yourself.";
        if (me === CONSUMER.id && svc.mode === "B2B") return "This service is for business accounts. Switch to a business to order it.";
        if (svc.price > TIER_LIMIT && (!isVerified(me) || !isVerified(b.id)))
          return `Orders above KSh ${TIER_LIMIT.toLocaleString("en-KE")} need both sides verified. ${!isVerified(me) ? "Verify your business in Wallet." : b.name + " is still being verified."}`;
        const id = "FT-" + (1002 + ref.current.orders.length);
        d({ t: "order", o: { id, buyerId: me, supplierId: b.id, serviceId: svc.id, title: svc.title, amount: svc.price, deliveryDays: svc.days, mode: svc.mode, createdAt: clock(), delivered: false } });
        return null;
      },
      deliver: (id) => d({ t: "deliver", id }),
      dispute: (id, reason) => d({ t: "dispute", id, reason }),
      rule: (id, ruling) => d({ t: "rule", id, ruling }),
      verify: (id) => d({ t: "verify", id }),
      withdraw: (id, amount) => d({ t: "withdraw", id, amount }),
      send: (to, text) => {
        const me = ref.current.actingAs;
        d({ t: "msg", m: { id: uid(), from: me, to, text, at: clock(), warn: OFF_PLATFORM.test(text) } });
        setTimeout(() => d({ t: "msg", m: { id: uid(), from: to, to: me, text: REPLIES[Math.floor(Math.random() * REPLIES.length)], at: clock() } }), 1100);
      },
    };
  }, [s]);

  return <C.Provider value={value}>{children}</C.Provider>;
}
