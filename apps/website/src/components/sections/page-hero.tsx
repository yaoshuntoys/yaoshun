import type {ReactNode} from "react";
import Image from "@/components/media/smart-image";

type PageHeroProps = {
  afterContent?: ReactNode;
  backgroundClassName: string;
  backgroundImageClassName: string;
  backgroundSrc: string;
  children: ReactNode;
  copyClassName: string;
  gridClassName: string;
  innerClassName: string;
  priority?: boolean;
  quality?: number;
  sectionClassName: string;
  unoptimized?: boolean;
};

export function PageHero({
  afterContent,
  backgroundClassName,
  backgroundImageClassName,
  backgroundSrc,
  children,
  copyClassName,
  gridClassName,
  innerClassName,
  priority = true,
  quality = 100,
  sectionClassName,
  unoptimized = false,
}: PageHeroProps) {
  const fallbackBackgroundStyle = {
    backgroundColor: "var(--hero-fallback-background, #edf4ff)",
  } as const;

  return (
    <section className={sectionClassName} style={fallbackBackgroundStyle}>
      <div className={backgroundClassName} aria-hidden="true" style={fallbackBackgroundStyle}>
        <Image
          alt=""
          className={backgroundImageClassName}
          fetchPriority={priority ? "high" : undefined}
          fill
          priority={priority}
          quality={quality}
          sizes="100vw"
          src={backgroundSrc}
          unoptimized={unoptimized}
        />
      </div>
      <div className={innerClassName}>
        <div className={gridClassName}>
          <div className={copyClassName}>{children}</div>
        </div>
      </div>
      {afterContent}
    </section>
  );
}
