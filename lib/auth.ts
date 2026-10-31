export type Mock = { name: string; email: string; role: string; businessId?: string };

// Demo identities. Signing in as one of these acts as that business.
export const MOCK_ACCOUNTS: Mock[] = [
  { name: "Wanjiru Kamau", email: "wanjiru@temboretail.co.ke", role: "Tembo Retail Ltd", businessId: "tembo" },
  { name: "Brian Otieno", email: "brian@farulogistics.co.ke", role: "Faru Logistics", businessId: "faru-logistics" },
  { name: "Amina Hassan", email: "amina@kijaniprint.co.ke", role: "Kijani Print Studio", businessId: "kijani-print" },
];

// Fresh identities for the sign-up demo.
export const NEW_ACCOUNTS: Mock[] = [
  { name: "Peter Mwangi", email: "peter.mwangi@gmail.com", role: "New to Faru Trades" },
  { name: "Grace Achieng", email: "grace.achieng@gmail.com", role: "New to Faru Trades" },
];
