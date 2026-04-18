"use client";

interface ContentTabProps {
  content: string;
}

export function ContentTab({ content }: ContentTabProps) {
  return (
    <div className="border-primary/20 bg-primary/5 rounded border">
      <div className="border-primary/20 bg-primary/10 border-b px-4 py-2">
        <span className="text-muted-foreground font-mono text-xs">DESIGN.md</span>
      </div>
      <div className="max-h-[60vh] overflow-y-auto p-4">
        <pre className="font-mono text-xs leading-relaxed whitespace-pre-wrap text-white">
          {content}
        </pre>
      </div>
    </div>
  );
}