export type Mode = "B2B" | "B2C";
export type Service = { id: string; title: string; blurb: string; price: number; days: number; mode: Mode };
export type Business = {
  id: string; name: string; category: string; city: string; verified: boolean;
  about: string; rating: number; jobs: number; services: Service[]; ownerName?: string; ownerEmail?: string;
};

export const RATE = 129; // KSh per USD (planning rate used in the proposal decks)
export const TIER_LIMIT = 50000; // per-order cap (KSh) until a business is fully verified
export const CONSUMER = { id: "consumer", name: "Guest consumer" };

export const businesses: Business[] = [
  {
    id: "tembo", name: "Tembo Retail Ltd", category: "Retail", city: "Nairobi", verified: true, rating: 4.7, jobs: 38,
    about: "Multi-outlet retailer sourcing packaging, logistics and fresh produce for six stores across Nairobi.",
    services: [{ id: "tembo-1", title: "Shelf-ready merchandising audit", blurb: "On-site audit of your product display with a written report.", price: 9000, days: 3, mode: "B2B" }],
  },
  {
    id: "faru-logistics", name: "Faru Logistics", category: "Logistics", city: "Nairobi", verified: true, rating: 4.8, jobs: 212,
    about: "Road freight and last-mile delivery between Nairobi, Mombasa, Kisumu and Eldoret. GPS-tracked fleet.",
    services: [
      { id: "fl-1", title: "Nairobi to Mombasa freight, 7-tonne truck", blurb: "Door-to-door with proof of delivery.", price: 45000, days: 3, mode: "B2B" },
      { id: "fl-2", title: "Last-mile delivery batch (up to 80 parcels)", blurb: "Same-day riders inside Nairobi county.", price: 12000, days: 1, mode: "B2B" },
    ],
  },
  {
    id: "mara-insurance", name: "Mara Insurance Brokers", category: "Insurance", city: "Nairobi", verified: true, rating: 4.6, jobs: 154,
    about: "IRA-licensed brokers placing motor, medical and business cover with major Kenyan underwriters.",
    services: [
      { id: "mi-1", title: "Comprehensive motor insurance (private car)", blurb: "Policy certificate emailed within one day.", price: 38000, days: 1, mode: "B2C" },
      { id: "mi-2", title: "SME business cover (stock, fire, theft)", blurb: "Tailored cover for shops and workshops.", price: 60000, days: 2, mode: "B2B" },
    ],
  },
  {
    id: "kijani-print", name: "Kijani Print Studio", category: "Print & Branding", city: "Kisumu", verified: true, rating: 4.9, jobs: 97,
    about: "Packaging, labels and flyers printed on recycled stock. Design and print under one roof.",
    services: [
      { id: "kp-1", title: "Branded packaging, 500 units", blurb: "Custom box, two-colour print.", price: 28000, days: 5, mode: "B2B" },
      { id: "kp-2", title: "Flyer design pack (3 concepts)", blurb: "Print-ready files in 48 hours.", price: 6500, days: 2, mode: "B2C" },
    ],
  },
  {
    id: "savanna-accounting", name: "Savanna Accounting Partners", category: "Accounting", city: "Nakuru", verified: true, rating: 4.5, jobs: 76,
    about: "Bookkeeping, payroll and KRA compliance for small businesses and sole traders.",
    services: [
      { id: "sa-1", title: "Monthly bookkeeping", blurb: "Reconciled books and a one-page summary.", price: 15000, days: 30, mode: "B2B" },
      { id: "sa-2", title: "KRA annual returns filing", blurb: "Filed and acknowledged, with receipts.", price: 8000, days: 3, mode: "B2C" },
    ],
  },
  {
    id: "pwani-fresh", name: "Pwani Fresh Produce", category: "Agribusiness", city: "Mombasa", verified: true, rating: 4.4, jobs: 64,
    about: "Direct-from-farm tomatoes, onions and tropical fruit for hotels, caterers and supermarkets.",
    services: [{ id: "pf-1", title: "Bulk tomatoes, 1 tonne", blurb: "Graded and crated, delivered to your dock.", price: 70000, days: 2, mode: "B2B" }],
  },
  {
    id: "nairobi-code", name: "Nairobi Code Collective", category: "Software", city: "Nairobi", verified: false, rating: 4.3, jobs: 12,
    about: "Small team building websites and internal tools. Verification in progress.",
    services: [
      { id: "nc-1", title: "Business website (5 pages)", blurb: "Responsive, with a contact form.", price: 120000, days: 14, mode: "B2B" },
      { id: "nc-2", title: "Logo and social media kit", blurb: "Logo, palette and 6 post templates.", price: 25000, days: 4, mode: "B2C" },
    ],
  },
];

export const categories = Array.from(new Set(businesses.map((b) => b.category)));
export const nameOf = (id: string) => (id === CONSUMER.id ? CONSUMER.name : businesses.find((b) => b.id === id)?.name ?? id);
