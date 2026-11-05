import { LOGO_VIEWBOX, PATHS } from "@/lib/logo";

export function BrandMark() {
  return (
    <svg viewBox={LOGO_VIEWBOX} className="brand-svg" aria-hidden="true">
      {PATHS.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
