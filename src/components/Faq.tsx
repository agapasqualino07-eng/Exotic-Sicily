import type { FaqData } from "@/lib/types";
import { Icon } from "./Icon";

export function FaqList({ items }: { items: FaqData[] }) {
  return (
    <div className="faq-list">
      {items.map((f) => (
        <details key={f._id} className="faq-item">
          <summary>{f.question}<Icon name="chevron" size={20} /></summary>
          <p>{f.answer}</p>
        </details>
      ))}
    </div>
  );
}
