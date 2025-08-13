// --- Types ---
export const SUN = 'S' as const;
export const MOON = 'M' as const;
export const EMPTY = '' as const;

// Connector values for edges between cells
export const NONE = '' as const;
export const EQ = '=' as const;
export const NE = '×' as const; // different

export type CellVal = typeof SUN | typeof MOON | typeof EMPTY;

export type Connect = typeof NONE | typeof EQ | typeof NE; // connectors between cells

export type Violation = { kind: string; where: string };
