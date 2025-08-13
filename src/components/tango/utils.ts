import { EMPTY, EQ, MOON, NE, NONE, SUN, type CellVal, type Connect } from './types';

export function cycleCell(v: CellVal): CellVal {
  if (v === EMPTY) return SUN;
  if (v === SUN) return MOON;
  return EMPTY;
}

export function cycleConn(v: Connect): Connect {
  if (v === NONE) return EQ;
  if (v === EQ) return NE;
  return NONE;
}

export function classNames(...xs: (string | false | undefined)[]) {
  return xs.filter(Boolean).join(' ');
}
