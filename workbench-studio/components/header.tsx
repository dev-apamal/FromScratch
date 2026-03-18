export default function Header() {
  return (
    <>
      <header
        className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between py-6 fade-up"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <span className="text-sm font-medium tracking-wide">
          the workbench<span style={{ color: "var(--accent)" }}>.studio</span>
        </span>
        <span
          className="text-xs tracking-widest"
          style={{ color: "var(--muted)" }}
        >
          bengaluru · est 2026
        </span>
      </header>
    </>
  );
}
