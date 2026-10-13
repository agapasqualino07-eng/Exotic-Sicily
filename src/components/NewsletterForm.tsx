"use client";

import { useState } from "react";

export function NewsletterForm({ buttonLabel = "Iscrivimi", successText = "Grazie! Ti terremo aggiornato.", source = "home" }: { buttonLabel?: string; successText?: string; source?: string }) {
  const [state, setState] = useState<"idle" | "busy" | "ok" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setState("busy");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.get("email"), website: data.get("website"), source }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok) { setState("ok"); form.reset(); return; }
      setMsg(json.error || "Qualcosa è andato storto. Riprova.");
      setState("error");
    } catch {
      setMsg("Connessione assente. Riprova.");
      setState("error");
    }
  }

  if (state === "ok") return <p className="newsletter-success" role="status">{successText}</p>;

  return (
    <form className="newsletter-form" onSubmit={onSubmit} noValidate={false}>
      <label htmlFor={`nl-${source}`} className="sr-only">La tua email</label>
      <input id={`nl-${source}`} name="email" type="email" required autoComplete="email" placeholder="La tua email" />
      {/* campo trappola per i bot: le persone non lo vedono né lo compilano */}
      <input name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />
      <button type="submit" className="btn btn-primary" disabled={state === "busy"}>{state === "busy" ? "Un attimo…" : buttonLabel}</button>
      {state === "error" ? <p className="form-error" role="alert">{msg}</p> : null}
    </form>
  );
}
