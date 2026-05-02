/**
 * Component to render log details in a formatted way
 */

interface LogDetailsProps {
  details: any;
  maxProps?: number;
}

export function LogDetails({ details, maxProps = 1 }: LogDetailsProps) {
  if (!details) {
    return <span className="text-slate-400">—</span>;
  }

  if (typeof details === "string") {
    return <span className="text-slate-700 text-sm">{details}</span>;
  }

  // If it's an object, render key/value pairs (first maxProps keys) prettily
  try {
    const entries = Object.entries(details);
    if (entries.length === 0) {
      return <span className="text-slate-400">—</span>;
    }

    return (
      <div className="text-sm text-slate-700 space-y-1">
        {entries.slice(0, maxProps).map(([k, v]) => (
          <div key={k} className="flex items-start gap-2">
            <span className="font-mono text-xs text-slate-500 min-w-[100px]">
              {k}:
            </span>
            <span className="break-words truncate max-w-[200px]">
              {typeof v === "object" ? JSON.stringify(v) : String(v)}
            </span>
          </div>
        ))}
        {entries.length > maxProps && (
          <div className="text-xs text-slate-500">
            +{entries.length - maxProps} more
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
