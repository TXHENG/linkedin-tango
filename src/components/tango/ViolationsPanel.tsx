import { type Violation } from './types';

export function ViolationsPanel({ violations, complete }: { violations: Violation[]; complete: boolean }) {
  return (
    <div className="p-4 bg-white rounded-2xl shadow grid gap-2">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Status</h2>
        {complete ? (
          <span className="px-2 py-1 rounded-lg bg-emerald-100 text-emerald-700">🎉 Solved!</span>
        ) : (
          <span className="px-2 py-1 rounded-lg bg-slate-100 text-slate-600">Keep going…</span>
        )}
      </div>
      {violations.length === 0 ? (
        <p className="text-sm text-slate-600">No rule violations detected.</p>
      ) : (
        <ul className="text-sm list-disc pl-5 text-slate-700">
          {violations.map((v, i) => (
            <li key={i}>
              <b>{v.kind}</b> at <i>{v.where}</i>
            </li>
          ))}
        </ul>
      )}
      <p className="text-xs text-slate-500">
        Tip: the validator only flags clear rule breaks (e.g., three-in-a-row, over half filled, or connector
        mismatches). Partial rows/cols are okay until they’re full.
      </p>
    </div>
  );
}
