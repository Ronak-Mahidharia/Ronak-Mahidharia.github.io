export function Tags({ items, label }: { items: string[]; label: string }) {
  return (
    <ul aria-label={label} className="mt-4 flex flex-wrap gap-2">
      {items.map((item) => (
        <li key={item} className="rounded-full border border-border px-3 py-1 text-xs text-muted">
          {item}
        </li>
      ))}
    </ul>
  );
}
