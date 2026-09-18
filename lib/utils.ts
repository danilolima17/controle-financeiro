import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "UTC",
});

export function formatDate(value: string) {
  return dateFormatter.format(new Date(value));
}

// Sem o dia da semana: "quarta-feira, 16 de setembro" não cabe ao lado do
// total do dia em telas estreitas.
const dayFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "long",
  timeZone: "UTC",
});

export function formatDayHeading(value: string) {
  const today = todayKey();
  if (value === today) return "Hoje";

  const yesterday = new Date(`${today}T00:00:00Z`);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  if (value === yesterday.toISOString().slice(0, 10)) return "Ontem";

  return dayFormatter.format(new Date(`${value}T00:00:00Z`));
}

export function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

/** Mês no formato `AAAA-MM`. */
export function currentMonthKey() {
  return new Date().toISOString().slice(0, 7);
}

export function isValidMonthKey(value: string | undefined): value is string {
  return typeof value === "string" && /^\d{4}-(0[1-9]|1[0-2])$/.test(value);
}

export function shiftMonth(monthKey: string, delta: number) {
  const [year, month] = monthKey.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1 + delta, 1));
  return date.toISOString().slice(0, 7);
}

export function monthRange(monthKey: string) {
  const [year, month] = monthKey.split("-").map(Number);
  const from = new Date(Date.UTC(year, month - 1, 1));
  const to = new Date(Date.UTC(year, month, 0));
  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  };
}

const monthFormatter = new Intl.DateTimeFormat("pt-BR", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export function formatMonthLabel(monthKey: string) {
  // "setembro de 2026" -> "Setembro de 2026" (o "de" continua minúsculo).
  const label = monthFormatter.format(new Date(`${monthKey}-01T00:00:00Z`));
  return label.charAt(0).toUpperCase() + label.slice(1);
}

const shortDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  timeZone: "UTC",
});

export function formatShortDate(value: string) {
  return shortDateFormatter.format(new Date(value));
}

const shortMonthFormatter = new Intl.DateTimeFormat("pt-BR", {
  month: "short",
  timeZone: "UTC",
});

export function formatShortMonth(monthKey: string) {
  return shortMonthFormatter
    .format(new Date(`${monthKey}-01T00:00:00Z`))
    .replace(".", "");
}

/** Aceita "1.234,56" e "1234.56". */
export function parseAmount(raw: string) {
  const normalized = raw
    .trim()
    .replace(/\s/g, "")
    .replace(/\.(?=\d{3}(\D|$))/g, "")
    .replace(",", ".");
  return Number(normalized);
}
