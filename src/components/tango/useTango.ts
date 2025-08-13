import { useMemo, useState } from 'react';
import { EMPTY, SUN, MOON, NONE, EQ, NE, type CellVal, type Connect, type Violation } from './types';
import { cycleCell, cycleConn } from './utils';

export function useTango(initialSize = 6) {
  const [size, setSize] = useState(initialSize);
  const half = useMemo(() => Math.floor(size / 2), [size]);

  // Grid cells
  const [cells, setCells] = useState<CellVal[][]>(() => Array.from({ length: size }, () => Array(size).fill(EMPTY)));

  // Horizontal connectors: h[r][c] is between (r,c) and (r,c+1)
  const [h, setH] = useState<Connect[][]>(() => Array.from({ length: size }, () => Array(size - 1).fill(NONE)));
  // Vertical connectors: v[r][c] is between (r,c) and (r+1,c)
  const [v, setV] = useState<Connect[][]>(() => Array.from({ length: size - 1 }, () => Array(size).fill(NONE)));

  // Prefilled mask – true means locked prefill
  const [prefill, setPrefill] = useState<boolean[][]>(() =>
    Array.from({ length: size }, () => Array(size).fill(false))
  );

  const [locked, setLocked] = useState(false); // map locked (constraints + prefills)
  const [started, setStarted] = useState(false); // in play mode

  // Resize grid safely
  function resetTo(n: number) {
    const N = Math.max(2, Math.min(12, Math.floor(n)));
    setSize(N);
    setCells(Array.from({ length: N }, () => Array(N).fill(EMPTY)));
    setH(Array.from({ length: N }, () => Array(Math.max(0, N - 1)).fill(NONE)));
    setV(Array.from({ length: Math.max(0, N - 1) }, () => Array(N).fill(NONE)));
    setPrefill(Array.from({ length: N }, () => Array(N).fill(false)));
    setLocked(false);
    setStarted(false);
  }

  // Toggle a cell value (respect prefill + mode)
  function onCellClick(r: number, c: number) {
    if (!started) {
      if (locked && prefill[r][c]) return; // cannot change locked prefills
      const next = cells.map((row) => row.slice());
      next[r][c] = cycleCell(next[r][c]);
      setCells(next);
      // In setup mode, flipping a cell toggles its prefill mask whenever value != EMPTY
      if (!locked) {
        const pm = prefill.map((row) => row.slice());
        pm[r][c] = next[r][c] !== EMPTY;
        setPrefill(pm);
      }
      return;
    }
    // Play mode – only change if not prefilled
    if (prefill[r][c]) return;
    const next = cells.map((row) => row.slice());
    next[r][c] = cycleCell(next[r][c]);
    setCells(next);
  }

  function onConnHClick(r: number, c: number) {
    if (locked) return;
    const next = h.map((row) => row.slice());
    next[r][c] = cycleConn(next[r][c]);
    setH(next);
  }
  function onConnVClick(r: number, c: number) {
    if (locked) return;
    const next = v.map((row) => row.slice());
    next[r][c] = cycleConn(next[r][c]);
    setV(next);
  }

  function lockMap() {
    setLocked(true);
  }
  function unlockMap() {
    setLocked(false);
    setStarted(false);
  }
  function startGame() {
    setStarted(true);
  }
  function resetGameKeepMap() {
    // Clear non-prefill cells
    const next = cells.map((row, r) => row.map((val, c) => (prefill[r][c] ? val : EMPTY)));
    setCells(next);
    setStarted(false);
  }

  // --- Validation ---
  const { violations, complete } = useMemo(() => {
    const viols: Violation[] = [];
    const N = size;

    // helper counts
    const rowCounts = Array.from({ length: N }, () => ({ S: 0, M: 0 }));
    const colCounts = Array.from({ length: N }, () => ({ S: 0, M: 0 }));

    // count + adjacency checks
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        const val = cells[r]?.[c] || EMPTY;
        if (val === SUN) {
          rowCounts[r].S++;
          colCounts[c].S++;
        } else if (val === MOON) {
          rowCounts[r].M++;
          colCounts[c].M++;
        }
        // horizontal runs
        if (c + 2 < N) {
          const a = val,
            b = cells[r][c + 1],
            d = cells[r][c + 2];
          if (a && b && d && a === b && b === d) {
            viols.push({ kind: '>2-in-row', where: `R${r + 1} C${c + 1}-${c + 3}` });
          }
        }
        // vertical runs
        if (r + 2 < N) {
          const a = val,
            b = cells[r + 1][c],
            d = cells[r + 2][c];
          if (a && b && d && a === b && b === d) {
            viols.push({ kind: '>2-in-col', where: `C${c + 1} R${r + 1}-${r + 3}` });
          }
        }
      }
    }

    // balance rule (only flag when over limit or row/col is full)
    for (let r = 0; r < N; r++) {
      const filled = rowCounts[r].S + rowCounts[r].M;
      if (rowCounts[r].S > half || rowCounts[r].M > half) {
        viols.push({ kind: 'row-balance', where: `Row ${r + 1}` });
      }
      if (filled === N && (rowCounts[r].S !== half || rowCounts[r].M !== half)) {
        viols.push({ kind: 'row-balance', where: `Row ${r + 1}` });
      }
    }
    for (let c = 0; c < N; c++) {
      const filled = colCounts[c].S + colCounts[c].M;
      if (colCounts[c].S > half || colCounts[c].M > half) {
        viols.push({ kind: 'col-balance', where: `Col ${c + 1}` });
      }
      if (filled === N && (colCounts[c].S !== half || colCounts[c].M !== half)) {
        viols.push({ kind: 'col-balance', where: `Col ${c + 1}` });
      }
    }

    // connector constraints
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N - 1; c++) {
        const con = h[r]?.[c];
        if (!con) continue;
        const a = cells[r][c];
        const b = cells[r][c + 1];
        if (a && b) {
          if (con === EQ && a !== b) viols.push({ kind: '= mismatch', where: `R${r + 1} C${c + 1}-${c + 2}` });
          if (con === NE && a === b) viols.push({ kind: '× mismatch', where: `R${r + 1} C${c + 1}-${c + 2}` });
        }
      }
    }
    for (let r = 0; r < N - 1; r++) {
      for (let c = 0; c < N; c++) {
        const con = v[r]?.[c];
        if (!con) continue;
        const a = cells[r][c];
        const b = cells[r + 1][c];
        if (a && b) {
          if (con === EQ && a !== b) viols.push({ kind: '= mismatch', where: `C${c + 1} R${r + 1}-${r + 2}` });
          if (con === NE && a === b) viols.push({ kind: '× mismatch', where: `C${c + 1} R${r + 1}-${r + 2}` });
        }
      }
    }

    // complete: all filled & no violations
    const filledAll = cells.every((row) => row.every((v) => v !== EMPTY));
    const complete = filledAll && viols.length === 0;

    return { violations: viols, complete };
  }, [cells, h, v, size, half]);

  function exportSetup() {
    const data = {
      size,
      prefills: cells.map((row, r) => row.map((v, c) => (prefill[r][c] ? v : EMPTY))),
      h,
      v,
    };
    navigator.clipboard?.writeText(JSON.stringify(data, null, 2));
    alert('Setup JSON copied to clipboard.');
  }

  function importSetup(json: string) {
    try {
      const obj = JSON.parse(json);
      const N = Math.max(2, Math.min(12, Number(obj.size) || 6));
      resetTo(N);
      setTimeout(() => {
        // Apply after state reset flushes
        setH(
          obj.h?.map((row: any[]) => row.map((x: any) => (x === EQ || x === NE ? x : NONE))) ||
            Array.from({ length: N }, () => Array(Math.max(0, N - 1)).fill(NONE))
        );
        setV(
          obj.v?.map((row: any[]) => row.map((x: any) => (x === EQ || x === NE ? x : NONE))) ||
            Array.from({ length: Math.max(0, N - 1) }, () => Array(N).fill(NONE))
        );
        const cellVals: CellVal[][] = Array.from({ length: N }, () => Array(N).fill(EMPTY));
        const pre: boolean[][] = Array.from({ length: N }, () => Array(N).fill(false));
        (obj.prefills || []).forEach((row: any[], r: number) =>
          row?.forEach((v: any, c: number) => {
            if (v === SUN || v === MOON) {
              cellVals[r][c] = v;
              pre[r][c] = true;
            }
          })
        );
        setCells(cellVals);
        setPrefill(pre);
      }, 0);
    } catch {
      alert('Invalid JSON');
    }
  }

  return {
    size,
    half,
    cells,
    h,
    v,
    prefill,
    locked,
    started,
    violations,
    complete,
    resetTo,
    onCellClick,
    onConnHClick,
    onConnVClick,
    lockMap,
    unlockMap,
    startGame,
    resetGameKeepMap,
    exportSetup,
    importSetup,
  };
}
