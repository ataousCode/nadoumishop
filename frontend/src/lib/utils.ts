import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function getImageUrl(path: string | null | undefined): string {
  if (!path) return "https://via.placeholder.com/300x300?text=No+Image";
  if (path.startsWith("http")) return path;
  return `http://localhost:5001${path}`;
}
