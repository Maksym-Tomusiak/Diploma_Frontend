/**
 * Component to render log details in a formatted way
 */

interface LogDetailsProps {
  details: any;
}

export function LogDetails({ details }: LogDetailsProps) {
  if (!details) {
    return <span className="text-slate-400">—</span>;
  }

  if (typeof details === "string") {
    return <span className="text-slate-700 text-sm">{details}</span>;
  }

  // If it's an object, render key/value pairs (first 4 keys) prettily
  try {
    const entries = Object.entries(details);
    if (entries.length === 0) {
      return <span className="text-slate-400">—</span>;
    }

    return (
      <div className="text-sm text-slate-700 space-y-1">
        {entries.slice(0, 4).map(([k, v]) => (
          <div key={k} className="flex items-start gap-2">
            <span className="font-mono text-xs text-slate-500 w-[120px]">
              {k}:
            </span>
            <span className="break-words">
              {typeof v === "object" ? JSON.stringify(v) : String(v)}
            </span>
          </div>
        ))}
        {entries.length > 4 && (
          <div className="text-xs text-slate-500">
            and {entries.length - 4} more...
          </div>
        )}
      </div>
    );
  } catch (e) {
    return (
      <pre className="text-xs bg-slate-50 px-2 py-1 rounded">
        {String(details)}
      </pre>
    );
  }
}
