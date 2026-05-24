const PREFIX: Record<string, string> = {
  sap: "SAP",
  utility: "Utility",
  travel: "Travel",
};

/** Client fallback when API has no display_ref yet. */
export function formatDisplayRef(
  sourceType: string,
  rowNumber?: number | null,
  uuid?: string
): string {
  const prefix = PREFIX[sourceType] ?? "Record";
  if (rowNumber != null && rowNumber > 0) {
    return `${prefix}-${String(rowNumber).padStart(4, "0")}`;
  }
  if (uuid) {
    const n = parseInt(uuid.replace(/-/g, "").slice(0, 8), 16) % 10000;
    return `${prefix}-${String(n).padStart(4, "0")}`;
  }
  return prefix;
}
