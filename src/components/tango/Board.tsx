import { EMPTY, NONE, type CellVal, type Connect } from './types';
import { classNames } from './utils';

export function Board({
  size,
  cells,
  prefill,
  h,
  v,
  locked,
  started,
  onCellClick,
  onConnHClick,
  onConnVClick,
}: {
  size: number;
  cells: CellVal[][];
  prefill: boolean[][];
  h: Connect[][];
  v: Connect[][];
  locked: boolean;
  started: boolean;
  onCellClick: (r: number, c: number) => void;
  onConnHClick: (r: number, c: number) => void;
  onConnVClick: (r: number, c: number) => void;
}) {
  // Render a matrix with connector cells in between
  // Layout grid dims: for N cells, there are (N-1) horizontal connector columns and (N-1) vertical connector rows.
  const N = size;
  const cols = N * 2 - 1;
  const rows = N * 2 - 1;

  return (
    <div className="overflow-auto">
      <div
        className="inline-grid bg-white rounded-2xl shadow p-4"
        style={{ gridTemplateColumns: `repeat(${cols}, 2.5rem)`, gridTemplateRows: `repeat(${rows}, 2.5rem)` }}
      >
        {Array.from({ length: rows }).map((_, R) =>
          Array.from({ length: cols }).map((_, C) => {
            const isCell = R % 2 === 0 && C % 2 === 0;
            const isH = R % 2 === 0 && C % 2 === 1; // horizontal connector slot
            const isV = R % 2 === 1 && C % 2 === 0; // vertical connector slot
            const r = Math.floor(R / 2);
            const c = Math.floor(C / 2);

            if (isCell) {
              const val = cells[r]?.[c] || EMPTY;
              const lockedHere = prefill[r]?.[c] && (locked || started);
              return (
                <button
                  key={`${R}-${C}`}
                  onClick={() => onCellClick(r, c)}
                  className={classNames(
                    'w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-xl md:text-2xl rounded-xl border',
                    lockedHere ? 'bg-amber-50 border-amber-300' : 'bg-slate-50 hover:bg-slate-100 border-slate-300'
                  )}
                  title={
                    lockedHere
                      ? 'Prefilled (locked)'
                      : started
                        ? 'Cycle ☀️ / 🌙 / blank'
                        : 'Set prefill (click to cycle)'
                  }
                >
                  <span>{val === 'S' ? '☀️' : val === 'M' ? '🌙' : ''}</span>
                </button>
              );
            }
            if (isH) {
              const cc = h[r]?.[c] || NONE;
              return (
                <button
                  key={`${R}-${C}`}
                  onClick={() => onConnHClick(r, c)}
                  className={classNames(
                    'w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-lg rounded-xl',
                    locked ? 'text-slate-400' : 'hover:bg-slate-100'
                  )}
                  title={locked ? 'Map locked' : 'Toggle connector: blank → = → ×'}
                >
                  <span>{cc}</span>
                </button>
              );
            }
            if (isV) {
              const cc = v[r]?.[c] || NONE;
              return (
                <button
                  key={`${R}-${C}`}
                  onClick={() => onConnVClick(r, c)}
                  className={classNames(
                    'w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-lg rounded-xl',
                    locked ? 'text-slate-400' : 'hover:bg-slate-100'
                  )}
                  title={locked ? 'Map locked' : 'Toggle connector: blank → = → ×'}
                >
                  <span>{cc}</span>
                </button>
              );
            }
            // Connector intersections – just spacers
            return <div key={`${R}-${C}`} />;
          })
        )}
      </div>
    </div>
  );
}
