import type { SVGProps } from "react";

const stroke = { fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round" } as const;

/* Icone interfaccia (viewBox 24) — tutte decorative: l'etichetta accessibile sta sul pulsante/link che le contiene */
const UI: Record<string, React.ReactNode> = {
  cart: (<><circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M2.5 3h2l2.6 12.4a1.8 1.8 0 0 0 1.8 1.6h8.6a1.8 1.8 0 0 0 1.76-1.44L21.5 8H6.4" /></>),
  menu: <path d="M3 6h18M3 12h18M3 18h18" />,
  close: <path d="M5 5l14 14M19 5 5 19" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  leaf: (<><path d="M4 20C4 10 10 4 20 4c0 10-6 16-16 16Z" /><path d="M4 20 14 10" /></>),
  noSugar: (<><path d="M12 3 4 8v8l8 5 8-5V8Z" /><path d="M5 6.5 19 17.5" /></>),
  handPicked: <path d="M12 2.5 14 9l6.5.6-5 4.4L17 20l-5-3.4L7 20l1.5-6-5-4.4L10 9Z" />,
  recycle: (<><path d="M7 19H5.5A2.5 2.5 0 0 1 3 16.5c0-.8.4-1.5 1-2l1.5-2" /><path d="m9 5 3-2.5L15 5M12 2.5v9" /><path d="M17 5h1.5A2.5 2.5 0 0 1 21 7.5c0 .8-.4 1.5-1 2l-1.5 2" /><path d="m15 17 3 2.5-3 2.5M18 19.5H9.5" /></>),
  truck: (<><path d="M2 6h11v10H2zM13 10h4l4 3.2V16h-8z" /><circle cx="6.5" cy="18.5" r="1.6" /><circle cx="17" cy="18.5" r="1.6" /></>),
  shield: (<><path d="M12 2.5 20 6v6c0 5-3.4 8.4-8 9.5-4.6-1.1-8-4.5-8-9.5V6Z" /><path d="m8.5 12 2.4 2.4L16 9.3" /></>),
  mapPin: (<><path d="M12 21s7-7.4 7-12.5A7 7 0 0 0 5 8.5C5 13.6 12 21 12 21Z" /><circle cx="12" cy="8.5" r="2.4" /></>),
  clock: (<><circle cx="12" cy="12" r="9.5" /><path d="M12 7v5.5l4 2.3" /></>),
  checkCircle: (<><circle cx="12" cy="12" r="9.5" /><path d="m8 12.5 2.6 2.6L16 9.6" /></>),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  info: (<><circle cx="12" cy="12" r="9.5" /><path d="M12 11v5.5M12 7.8v.1" /></>),
  bag: (<><path d="M6 8h12l-1 12.5H7z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></>),
  gift: (<><rect x="3" y="8" width="18" height="4" rx="1" /><path d="M5 12v8h14v-8M12 8v12" /><path d="M12 8c-1.5-4-6-4-6-1.5C6 8 9 8 12 8Zm0 0c1.5-4 6-4 6-1.5C18 8 15 8 12 8Z" /></>),
  sun: (<><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6" /></>),
  heart: <path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.6 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10Z" />,
  search: (<><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4.5 4.5" /></>),
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  chevron: <path d="m6 9 6 6 6-6" />,
  mail: (<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3.5 7 8.5 6 8.5-6" /></>),
  lock: (<><rect x="5" y="11" width="14" height="9.5" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>),
  star: <path d="M12 2.5 14 9l6.5.6-5 4.4L17 20l-5-3.4L7 20l1.5-6-5-4.4L10 9Z" />,
  instagram: (<><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="1" /></>),
  facebook: <path d="M15 8.5h2V5h-2c-2.2 0-4 1.8-4 4v2H9v3.5h2V21h3.5v-6.5H17l.5-3.5h-3V9c0-.3.2-.5.5-.5Z" />,
  tiktok: (<><path d="M14 3v10.5a3.5 3.5 0 1 1-3.2-3.48" /><path d="M14 3c.3 2.6 2 4.4 4.5 4.7" /></>),
  whatsapp: (<><path d="M3.5 20.5 5 16A8.5 8.5 0 1 1 8.2 19.2Z" /><path d="M9 9.5c.3 2.6 2.6 4.8 5.5 5.5l1.3-1.3-2-1-.9.6c-.9-.4-1.6-1.2-2-2l.6-.9-1-2Z" /></>),
};

export function Icon({ name, size = 24, ...rest }: { name: string; size?: number } & Omit<SVGProps<SVGSVGElement>, "name">) {
  const body = UI[name] ?? UI.leaf;
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} strokeWidth={1.7} {...stroke} aria-hidden="true" focusable="false" {...rest}>
      {body}
    </svg>
  );
}

/* Frutti (viewBox 100) per le illustrazioni dei prodotti senza foto */
export const FRUIT: Record<string, React.ReactNode> = {
  mango: (<><path d="M32 28c-10 8-16 22-12 38 3 12 15 20 27 18 14-2 24-16 22-32-2-14-13-19-15-30-1-6 2-11 6-14-9-2-19 3-22 10-3 7-2 8-6 10z" /><path d="M55 10c3 5 3 11 0 16" /></>),
  ananas: (<><path d="M35 14c4 6 6 10 6 16M50 10v18M65 14c-4 6-6 10-6 16" /><rect x="28" y="34" width="44" height="54" rx="18" /><path d="M28 50h44M28 66h44M42 34v54M58 34v54" strokeWidth="2" /></>),
  papaya: (<><path d="M50 12c16 0 26 16 26 36s-10 40-26 40-26-20-26-40 10-36 26-36z" /><path d="M50 40c6 0 10 4 10 9s-4 8-10 8-10-3-10-8 4-9 10-9z" strokeWidth="2.4" /><g fill="currentColor" stroke="none"><circle cx="44" cy="47" r="1.6" /><circle cx="50" cy="50" r="1.6" /><circle cx="56" cy="46" r="1.6" /><circle cx="47" cy="53" r="1.6" /><circle cx="54" cy="52" r="1.6" /></g></>),
  banana: (<><path d="M22 62c2 14 16 24 32 22 16-3 28-15 30-30" /><path d="M24 62c-2-16 6-32 20-40" /><path d="M84 54c2 3 2 7-1 10-4 4-10 3-13-1" /></>),
  cocco: (<><circle cx="50" cy="54" r="34" /><g fill="currentColor" stroke="none"><circle cx="42" cy="42" r="2" /><circle cx="50" cy="38" r="2" /><circle cx="58" cy="43" r="2" /></g><path d="M30 60c8 6 32 6 40 0" strokeWidth="2.2" opacity=".7" /><path d="M28 50c10 5 34 5 44 0" strokeWidth="2.2" opacity=".5" /></>),
  kiwi: (<><circle cx="50" cy="50" r="34" /><circle cx="50" cy="50" r="16" strokeWidth="2.2" /><circle cx="50" cy="50" r="3" fill="currentColor" stroke="none" /><path d="M50 34v6M50 60v6M34 50h6M60 50h6M39 39l4 4M57 57l4 4M61 39l-4 4M43 57l-4 4" strokeWidth="1.8" opacity=".85" /></>),
  maracuja: (<><circle cx="50" cy="50" r="34" /><circle cx="50" cy="50" r="14" strokeWidth="2.2" /><path d="M50 36v-6M50 64v6M36 50h-6M64 50h6M40 40l-5-5M60 60l5 5M60 40l5-5M40 60l-5 5" strokeWidth="1.6" opacity=".85" /><circle cx="50" cy="50" r="2.4" fill="currentColor" stroke="none" /></>),
  cofanetto: (<><rect x="18" y="40" width="64" height="42" rx="4" /><path d="M18 56h64M50 40v42" /><path d="M50 40c-8-14-26-14-26 0M50 40c8-14 26-14 26 0" strokeWidth="2.6" /></>),
};
