"use client";

import {ChevronDown, ChevronUp} from "lucide-react";
import type {ReactNode} from "react";
import {useState} from "react";

type ProductMobileCollapsibleGridProps = {
  children: ReactNode;
  collapseLabel: string;
  expandLabel: string;
  id: string;
  itemCount: number;
  className?: string;
};

export function ProductMobileCollapsibleGrid({
  children,
  collapseLabel,
  expandLabel,
  id,
  itemCount,
  className = "",
}: ProductMobileCollapsibleGridProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasMoreItems = itemCount > 4;
  const gridClassName = [className, "product-mobile-collapsible-grid"]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <div
        className={gridClassName}
        data-expanded={isExpanded}
        data-mobile-collapsible="true"
        id={id}
      >
        {children}
      </div>
      {hasMoreItems ? (
        <button
          aria-controls={id}
          aria-expanded={isExpanded}
          className="product-mobile-toggle"
          onClick={() => setIsExpanded((current) => !current)}
          type="button"
        >
          <span>
            {isExpanded
              ? collapseLabel
              : `${expandLabel} (${itemCount - 4})`}
          </span>
          {isExpanded ? (
            <ChevronUp aria-hidden="true" size={17} strokeWidth={2.1} />
          ) : (
            <ChevronDown aria-hidden="true" size={17} strokeWidth={2.1} />
          )}
        </button>
      ) : null}
    </>
  );
}
