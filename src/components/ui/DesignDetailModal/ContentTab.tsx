"use client";

interface ContentTabProps {
  content: string;
}

export function ContentTab({ content }: ContentTabProps) {
  return (
    <div className="rounded border border-primary/20 bg-primary/5">
      <div className="border-b border-primary/20 bg-primary/10 px-4 py-2">
        <span className="font-mono text-xs text-muted-foreground">DESIGN.md</span>
      </div>
      <div className="max-h-[60vh] overflow-y-auto p-4">
        <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-white">
          {content}
        </pre>
      </div>
    </div>
  );
}