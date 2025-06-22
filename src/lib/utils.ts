import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { type z } from "zod";

import { Schema_Breadcrumb, type Schema_Config_Site } from "~/types/schema";

import config from "config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFooterContent(
  text: { value: string }[],
  siteConfig?: z.infer<typeof Schema_Config_Site>,
): string {
  const data = siteConfig ?? config.siteConfig;
  const formatMap = {
    year: new Date().getFullYear().toString(),
    repository: "[Source Code](https://github.com/mbaharip/next-gdrive-index)",
    poweredBy: `Powered by [next-gdrive-index v${config.version}](https://github.com/mbaharip/next-gdrive-index)`,
    author: data.siteAuthor ?? "mbaharip",
    version: config.version ?? "0.0.0",
    siteName: data.siteName ?? "next-gdrive-index",
    handle: data.twitterHandle ?? "@__mbaharip__",
    creator: "mbaharip",
  };

  return text
    .map((item) => item.value.trim())
    .join("\n")
    .replace(/{{\s*(\w+)\s*}}/g, (_, key) => formatMap[key as keyof typeof formatMap] ?? "");
}

export function formatDate(
  date: string | number | Date,
  options?: Intl.DateTimeFormatOptions
): string {
  console.log(date);

  let parsedDate: Date;

  if (typeof date === "string" && /^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
    // If date is in DD/MM/YYYY format
    const [dayStr, monthStr, yearStr] = date.split("/");
    const day = parseInt(dayStr!, 10);
    const month = parseInt(monthStr!, 10);
    const year = parseInt(yearStr!, 10);

    parsedDate = new Date(year, month - 1, day); // JS months are 0-based
  } else if (typeof date === "string" || typeof date === "number" || date instanceof Date) {
    parsedDate = new Date(date);
  } else {
    throw new TypeError("Invalid date format");
  }

  const formatter = new Intl.DateTimeFormat(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...options,
  });

  return formatter.format(parsedDate);
}


export function bytesToReadable(bytes: number) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / Math.pow(1024, i);
  return (i >= 2 ? value.toFixed(2) : Math.round(value)) + " " + sizes[i];
}

export function durationToReadable(durationMillis: number): string {
  const duration = durationMillis / 1000;
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = Math.floor(duration % 60);

  const hStr = hours > 0 ? `${hours.toString().padStart(2, "0")}:` : "";
  const mStr = minutes > 0 ? `${minutes.toString().padStart(2, "0")}:` : "00:";
  const sStr = seconds > 0 ? `${seconds.toString().padStart(2, "0")}` : "00";

  return `${hStr}${mStr}${sStr}`;
}

export function toUrlPath(paths: { path: string; id: string }[]): string {
  const data = ["/"];
  for (const { path } of paths) {
    data.push(path);
  }
  return data.join("/").replace(/\/+/g, "/");
}

export function formatPathToBreadcrumb(
  paths: { id: string; path: string; mimeType: string }[],
): z.infer<typeof Schema_Breadcrumb>[] {
  const breadcrumb = paths.map((item, index) => {
    const isLast = index === paths.length - 1;
    return {
      label: decodeURIComponent(item.path),
      href: isLast ? undefined : item.path,
    };
  });
  const parsed = Schema_Breadcrumb.array().safeParse(breadcrumb);
  if (!parsed.success) throw new Error("Failed to parse breadcrumb");
  return parsed.data;
}
