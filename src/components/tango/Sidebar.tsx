import { useState } from 'react';

export function Sidebar({ importSetup }: { importSetup: (json: string) => void }) {
  const [text, setText] = useState('');
  return (
    <aside className="w-full md:w-[22rem] p-4 bg-white rounded-2xl shadow grid gap-3 h-fit">
      <h3 className="text-lg font-semibold">Quick Tools</h3>
      <div className="grid gap-2 text-sm">
        <p className="text-slate-600">
          Paste/Load a map setup (JSON). You can also export your setup after manually building it.
        </p>
        <textarea
          className="min-h-[8rem] w-full rounded-xl border p-2 font-mono text-xs"
          placeholder='{"size":6,"prefills":[["","","","","",""],…],"h":[…],"v":[…]}'
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="flex items-center gap-2">
          <button onClick={() => importSetup(text)} className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300">
            Import Setup
          </button>
          <button onClick={() => setText('')} className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200">
            Clear
          </button>
        </div>
      </div>

      <div className="grid gap-2 text-sm">
        <h4 className="font-medium">How to copy the LinkedIn map</h4>
        <ol className="list-decimal pl-5 space-y-1 text-slate-700">
          <li>
            Set <b>Size</b> to match (usually 6).
          </li>
          <li>
            Click the small squares <em>between</em> cells to set connectors: blank → <b>=</b> → <b>×</b>.
          </li>
          <li>(Optional) Click any cells to prefill 🌝 or 🌚 if the daily puzzle shows them.</li>
          <li>
            Press <b>Lock Map</b>.
          </li>
          <li>
            Press <b>Start Game</b> and solve by clicking cells to cycle 🌝 / 🌚 / blank.
          </li>
        </ol>
      </div>

      <div className="text-xs text-slate-500">This is a fan-made tool for practicing the Tango logic puzzle.</div>
    </aside>
  );
}
