import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateYearsOrMonthsHostingString(
  listingDate?: string
): string | undefined {
  if (!listingDate) return undefined;
  const startDate = new Date(listingDate);
  const currentDate = new Date();
  const years = currentDate.getFullYear() - startDate.getFullYear();
  const months = currentDate.getMonth() - startDate.getMonth();
  if (years > 0) return `${years} year${years > 1 ? "s" : ""} hosting`;
  if (months > 0) return `${months} month${months > 1 ? "s" : ""} hosting`;
  return undefined;
}
