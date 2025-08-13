import { useTango } from './useTango';
import { Board } from './Board';
import { ViolationsPanel } from './ViolationsPanel';
import { Sidebar } from './Sidebar';
import { classNames } from './utils';

export default function TangoPlayground() {
  const {
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
  } = useTango(6);

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-800 p-4 md:p-8">
      <div className="max-w-5xl mx-auto grid gap-4">
        <header className="flex items-center justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-semibold">Tango (LinkedIn) – Puzzle Playground</h1>
          <div className="flex items-center gap-2">
            <button onClick={() => resetTo(size)} className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300">
              New Empty
            </button>
            <button onClick={exportSetup} className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300">
              Export Setup
            </button>
          </div>
        </header>

        <section className="grid md:grid-cols-[1fr_auto] gap-4">
          <div className="grid gap-3">
            <div className="flex flex-wrap items-center gap-3 p-3 bg-white rounded-2xl shadow">
              <label className="flex items-center gap-2">
                Size
                <input
                  type="number"
                  min={2}
                  max={12}
                  value={size}
                  onChange={(e) => resetTo(Number(e.target.value))}
                  className="w-20 px-2 py-1 rounded border"
                />
              </label>
              <div className="h-6 w-px bg-slate-200" />
              <span className="text-sm">
                Half per row/column: <b>{half}</b>
              </span>
              <div className="h-6 w-px bg-slate-200" />
              <button
                onClick={locked ? unlockMap : lockMap}
                className={classNames(
                  'px-3 py-2 rounded-xl',
                  locked ? 'bg-amber-100 hover:bg-amber-200' : 'bg-amber-300 hover:bg-amber-400'
                )}
              >
                {locked ? 'Unlock Map' : 'Lock Map'}
              </button>
              <button
                onClick={startGame}
                disabled={!locked}
                className={classNames(
                  'px-3 py-2 rounded-xl',
                  locked
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                    : 'bg-emerald-200 text-emerald-800 cursor-not-allowed'
                )}
              >
                Start Game
              </button>
              <button onClick={resetGameKeepMap} className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300">
                Clear (keep map)
              </button>
            </div>

            <Board
              size={size}
              cells={cells}
              prefill={prefill}
              h={h}
              v={v}
              locked={locked}
              started={started}
              onCellClick={onCellClick}
              onConnHClick={onConnHClick}
              onConnVClick={onConnVClick}
            />

            <ViolationsPanel violations={violations} complete={complete} />
          </div>

          <Sidebar importSetup={importSetup} />
        </section>

        <footer className="text-xs text-slate-500">
          Built for personal use; not affiliated with LinkedIn. ☀️ = Sun, 🌙 = Moon. Use connectors (= or ×) to encode
          the daily map’s constraints.
        </footer>
      </div>
    </div>
  );
}
