/** Compact display name; product headings retain the full accessible name. */
export function recipeName(name: string): string {
  return name.replace(/ Bowl™$/, "");
}
