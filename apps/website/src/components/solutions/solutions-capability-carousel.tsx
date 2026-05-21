"use client";

import {ArrowLeft, ArrowRight} from "lucide-react";
import Link from "next/link";
import {useState, type CSSProperties, type KeyboardEvent} from "react";

import Image, {type ImageProps} from "@/components/media/smart-image";

type CapabilityCard = {
  bullets: string[];
  image: ImageProps["src"];
  meta: string;
  text: string;
  title: string;
  tiles?: Array<{
    image: ImageProps["src"];
    title: string;
  }>;
};

type SolutionsCapabilityCarouselProps = {
  cards: CapabilityCard[];
  contactHref: string;
  learnMoreLabel: string;
  nextLabel: string;
  previousLabel: string;
};

function getCircularOffset(index: number, activeIndex: number, total: number) {
  let offset = (index - activeIndex + total) % total;

  if (offset > total / 2) {
    offset -= total;
  }

  return offset;
}

function getCardTransform(offset: number) {
  if (offset === 0) {
    return "translate3d(0, 0, 120px) rotateY(0deg) scale(1)";
  }

  if (offset === -1) {
    return "translate3d(-66%, 24px, -95px) rotateY(34deg) scale(0.82)";
  }

  if (offset === 1) {
    return "translate3d(66%, 24px, -95px) rotateY(-34deg) scale(0.82)";
  }

  if (offset === -2) {
    return "translate3d(-112%, 52px, -260px) rotateY(48deg) scale(0.64)";
  }

  if (offset === 2) {
    return "translate3d(112%, 52px, -260px) rotateY(-48deg) scale(0.64)";
  }

  return `translate3d(${offset < 0 ? "-132%" : "132%"}, 68px, -360px) rotateY(${offset < 0 ? 56 : -56}deg) scale(0.52)`;
}

export function SolutionsCapabilityCarousel({
  cards,
  contactHref,
  learnMoreLabel,
  nextLabel,
  previousLabel,
}: SolutionsCapabilityCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  function move(direction: -1 | 1) {
    setActiveIndex((current) => (current + direction + cards.length) % cards.length);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      move(-1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      move(1);
    }
  }

  return (
    <div className="solutions-capability-carousel" onKeyDown={handleKeyDown} tabIndex={0}>
      <div className="solutions-flow-rail" aria-label={nextLabel}>
        {cards.map((card, index) => (
          <button
            aria-current={index === activeIndex ? "true" : undefined}
            aria-label={card.title}
            className={index === activeIndex ? "active" : ""}
            key={card.title}
            type="button"
            onClick={() => setActiveIndex(index)}
          >
            <strong>{String(index + 1).padStart(2, "0")}</strong>
            <span>{card.title}</span>
            <em>{card.meta}</em>
          </button>
        ))}
      </div>

      <button
        aria-label={previousLabel}
        className="solutions-carousel-button previous"
        type="button"
        onClick={() => move(-1)}
      >
        <ArrowLeft size={18} strokeWidth={2.2} />
      </button>

      <div className="solutions-capability-stage" aria-live="polite">
        <div className="solutions-capability-track">
          {cards.map((card, index) => {
            const offset = getCircularOffset(index, activeIndex, cards.length);
            const absOffset = Math.abs(offset);
            const isActive = index === activeIndex;
            const style: CSSProperties = {
              opacity: absOffset > 2 ? 0 : 1,
              transform: getCardTransform(offset),
              zIndex: 12 - absOffset,
            };

            return (
              <article
                aria-hidden={!isActive}
                className={`solutions-capability-card ${isActive ? "active" : ""} ${
                  card.tiles?.length ? "has-tiles" : ""
                }`}
                data-offset={offset}
                key={card.title}
                style={style}
              >
                {card.tiles?.length ? null : (
                  <div className="solutions-capability-image-wrap">
                    <Image
                      alt={card.title}
                      className="solutions-capability-image"
                      fill
                      preview
                      sizes="(min-width: 1180px) 500px, (min-width: 768px) 56vw, 88vw"
                      src={card.image}
                    />
                  </div>
                )}
                <div className="solutions-capability-body">
                  <div className="solutions-capability-title-row">
                    <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                    <h3>{card.title}</h3>
                  </div>
                  <p>{card.text}</p>
                  {card.tiles?.length ? (
                    <div className="solutions-capability-tile-grid">
                      {card.tiles.map((tile) => (
                        <article className="solutions-capability-tile" key={tile.title}>
                          <div className="solutions-capability-tile-image">
                            <Image
                              alt={tile.title}
                              className="solutions-capability-tile-media"
                              fill
                              preview
                              sizes="(min-width: 1180px) 240px, (min-width: 768px) 24vw, 44vw"
                              src={tile.image}
                            />
                          </div>
                          <h4>{tile.title}</h4>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <ul>
                      {card.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                  <Link className="solutions-card-link" href={contactHref} tabIndex={isActive ? undefined : -1}>
                    <span>{learnMoreLabel}</span>
                    <ArrowRight size={14} strokeWidth={2.2} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className="solutions-capability-dots">
        {cards.map((card, index) => (
          <button
            aria-current={index === activeIndex ? "true" : undefined}
            aria-label={card.title}
            className={index === activeIndex ? "active" : ""}
            key={card.title}
            type="button"
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>

      <button
        aria-label={nextLabel}
        className="solutions-carousel-button next"
        type="button"
        onClick={() => move(1)}
      >
        <ArrowRight size={18} strokeWidth={2.2} />
      </button>
    </div>
  );
}
