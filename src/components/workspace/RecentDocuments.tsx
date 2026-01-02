"use client";

import { Label } from "@/components/ui/label";
import type { Document } from "@/types/document";

interface RecentDocumentsProps {
  documents: Document[];
  onSelectDocument: (doc: Document) => void;
}

export function RecentDocuments({
  documents,
  onSelectDocument,
}: RecentDocumentsProps) {
  const recentDocs = documents
    .filter((doc) => doc.last_checked_at !== null)
    .sort((a, b) => {
      const dateA = a.last_checked_at
        ? new Date(a.last_checked_at).getTime()
        : 0;
      const dateB = b.last_checked_at
        ? new Date(b.last_checked_at).getTime()
        : 0;
      return dateB - dateA;
    })
    .slice(0, 5);

  if (recentDocs.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        Recent Documents
      </Label>
      <div className="space-y-2">
        {recentDocs.map((doc) => (
          <div
            key={doc.id}
            className="p-2 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer text-sm"
            onClick={() => onSelectDocument(doc)}
          >
            <div className="font-medium text-slate-900 truncate">
              {doc.title || doc.google_doc_id}
            </div>
            <div className="text-xs text-slate-500">
              Last checked:{" "}
              {doc.last_checked_at
                ? new Date(doc.last_checked_at).toLocaleDateString()
                : "Never"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
