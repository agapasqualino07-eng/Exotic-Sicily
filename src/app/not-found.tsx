import "@fontsource-variable/fraunces/wght.css";
import "@fontsource-variable/inter/wght.css";
import "./globals.css";
import { SiteShell } from "@/components/SiteShell";
import NotFoundContent from "./(site)/not-found";

export default function NotFound() {
  return <SiteShell><NotFoundContent /></SiteShell>;
}
