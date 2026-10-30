# Faru Trades (bizz.it)

Clickable demo of a Kenya-first, escrow-secured B2B2C business platform: verified directory, in-app chat, escrow wallet, 2.5% commission, $25/month platform fee, and a "delivery period + 4 days" payout hold.

**This is a demo.** All data lives in your browser (localStorage). No real payments, KYC or auth.

## Run it

    npm install
    npm run dev     # http://localhost:3000

## What to try

1. Directory: open Faru Logistics, chat, place an order and read the commission breakdown.
2. Orders: follow the escrow timeline. Skip ahead with the demo clock (+1, +4, +7 days).
3. Switch "Acting as" to the supplier: mark delivered, wait out the 4-day hold, withdraw from Wallet.
4. Raise a dispute as the buyer, then rule on it as support (refund or release).
5. Type "pay me on WhatsApp" in a chat to trigger the off-platform liability warning.
6. Open Nairobi Code Collective (unverified) and order the KSh 120,000 website: blocked by the tiered limit.
7. Economics: load the Low and Mid cases from the proposal ($8,250 and $46,250 per month).

## Map to the proposal

- Directory and profiles: `app/page.tsx`, `app/business/[id]`
- Chat and off-platform warning: `components/Chat.tsx`, `lib/store.tsx`
- Escrow engine (delivery + 4 days): `lib/escrow.ts`
- Tiered limits until verified: `lib/store.tsx` (`placeOrder`)
- B2B / B2C per offering: `lib/data.ts` (`mode`)
- Revenue model: `app/economics`

## Next, for the real build

Clerk auth, Postgres (Supabase), Paystack/Pesapal for collections and payouts, Youverify/Didit for KYC, Cloudflare, and a server-side escrow ledger. Never trust the client with money. Get CBK payments-regulation advice before holding customer funds.
