import { RATE } from "./data";
export const ksh = (n: number) => "KSh " + Math.round(n).toLocaleString("en-KE");
export const usd = (n: number) => "$" + Math.round(n).toLocaleString("en-US");
export const kshToUsd = (n: number) => n / RATE;
export const dateOf = (ms: number) => new Date(ms).toLocaleDateString("en-KE", { day: "numeric", month: "short" });
export const timeOf = (ms: number) => new Date(ms).toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" });
export const daysUntil = (target: number, now: number) => Math.max(0, Math.ceil((target - now) / 86_400_000));
