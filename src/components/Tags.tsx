export function Tags({ items, label, className = "mt-4" }: { items: string[]; label: string; className?: string }) {
  return (
    <ul aria-label={label} className={`flex flex-wrap gap-2 ${className}`}>
      {items.map((item) => (
        <li key={item} className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted">
          {item}
        </li>
      ))}
    </ul>
  );
}
