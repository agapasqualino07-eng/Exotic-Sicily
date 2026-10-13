export const BLOG_CATEGORY_LABELS: Record<string, string> = {
  ricette: "Ricette e idee",
  guide: "Guide",
  regali: "Regali",
  "dietro-le-quinte": "Dietro le quinte",
};

export const categoryLabel = (c?: string | null) => (c ? BLOG_CATEGORY_LABELS[c] ?? c : "Blog");

export const formatDate = (d?: string) =>
  d ? new Date(d).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" }) : "";
