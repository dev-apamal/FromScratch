import { footerLinks } from "@/data/footerLinks";
import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-4 py-6 fade-up"
      style={{ animationDelay: "340ms" }}
    >
      <Link href="/">
        <p className="text-xs" style={{ color: "var(--muted)" }}>
          © 2026 the workbench studio · bengaluru
        </p>
      </Link>

      <div className="flex gap-5">
        {footerLinks.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith("mailto") ? undefined : "_blank"}
            rel="noopener noreferrer"
            className="text-xs transition-colors duration-150 hover:text-ink"
            style={{ color: "var(--muted)" }}
          >
            {label}
          </a>
        ))}
      </div>
    </footer>
  );
}
