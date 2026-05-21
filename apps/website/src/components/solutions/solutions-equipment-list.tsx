"use client";

import {ArrowRight, ChevronUp} from "lucide-react";
import {useState} from "react";

import Image, {type ImageProps} from "@/components/media/smart-image";

type EquipmentCard = {
  category: string;
  image: ImageProps["src"];
  text: string;
  title: string;
};

type EquipmentCategory = {
  id: string;
  label: string;
};

type SolutionsEquipmentListProps = {
  cards: EquipmentCard[];
  categories: EquipmentCategory[];
  collapseLabel: string;
  expandLabel: string;
  filterLabel: string;
};

export function SolutionsEquipmentList({
  cards,
  categories,
  collapseLabel,
  expandLabel,
  filterLabel,
}: SolutionsEquipmentListProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const filteredCards =
    activeCategory === "all" ? [...cards].reverse() : cards.filter((card) => card.category === activeCategory);
  const canToggle = filteredCards.length > 3;

  function selectCategory(category: string) {
    setActiveCategory(category);
    setIsExpanded(false);
  }

  return (
    <div
      className={isExpanded ? "solutions-equipment-list expanded" : "solutions-equipment-list collapsed"}
      data-count={filteredCards.length}
    >
      <div className="solutions-tab-strip compact" aria-label={filterLabel}>
        {categories.map((category) => (
          <button
            aria-current={category.id === activeCategory ? "true" : undefined}
            className={category.id === activeCategory ? "active" : ""}
            key={category.id}
            type="button"
            onClick={() => selectCategory(category.id)}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div className="solutions-equipment-grid">
        {filteredCards.map((card) => (
          <article className="solutions-equipment-card" key={card.title}>
            <div className="solutions-equipment-image-wrap">
              <Image
                alt={card.title}
                className="solutions-equipment-image"
                fill
                preview
                sizes="(min-width: 1024px) 260px, (min-width: 640px) 45vw, 100vw"
                src={card.image}
              />
            </div>
            <div className="solutions-equipment-body">
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </div>
          </article>
        ))}
      </div>

      {canToggle ? (
        <button className="solutions-outline-cta" type="button" onClick={() => setIsExpanded((current) => !current)}>
          <span>{isExpanded ? collapseLabel : expandLabel}</span>
          {isExpanded ? <ChevronUp size={15} strokeWidth={2.1} /> : <ArrowRight size={15} strokeWidth={2.1} />}
        </button>
      ) : null}
    </div>
  );
}
