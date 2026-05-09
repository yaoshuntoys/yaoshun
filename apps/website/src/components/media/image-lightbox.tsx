"use client";

import {useEffect, useRef, useState} from "react";
import {X} from "lucide-react";

type PreviewImage = {
  alt: string;
  src: string;
};

type PreviewOpenEvent = CustomEvent<PreviewImage>;

const previewOpenEventName = "image-preview:open";

function getOptimizedImageSource(src: string) {
  try {
    const url = new URL(src, window.location.href);

    if (url.pathname !== "/_next/image") {
      return src;
    }

    return url.searchParams.get("url") || src;
  } catch {
    return src;
  }
}

function openImagePreview(detail: PreviewImage) {
  window.dispatchEvent(new CustomEvent(previewOpenEventName, {detail}));
}

export function ImageLightbox() {
  const [preview, setPreview] = useState<PreviewImage | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    function handlePreviewOpen(event: Event) {
      const previewEvent = event as PreviewOpenEvent;

      if (!previewEvent.detail?.src) {
        return;
      }

      previousFocusRef.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      setPreview({
        alt: previewEvent.detail.alt || "",
        src: previewEvent.detail.src,
      });
    }

    function handleDocumentClick(event: MouseEvent) {
      if (event.button !== 0 || event.defaultPrevented) {
        return;
      }

      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      if (target.closest("[data-image-lightbox-root]")) {
        return;
      }

      const trigger = target.closest<HTMLElement>("[data-image-preview-trigger]");

      if (trigger) {
        const src = trigger.dataset.imagePreviewSrc;

        if (!src) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();
        openImagePreview({
          alt: trigger.dataset.imagePreviewAlt || "",
          src,
        });
        return;
      }

      const image = target.closest("img");
      const previewSource = image?.dataset.imagePreviewSrc;

      if (!image || !previewSource) {
        return;
      }

      const src = getOptimizedImageSource(previewSource);

      if (!src) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      openImagePreview({
        alt: image.alt || "",
        src,
      });
    }

    window.addEventListener(previewOpenEventName, handlePreviewOpen);
    document.addEventListener("click", handleDocumentClick, true);

    return () => {
      window.removeEventListener(previewOpenEventName, handlePreviewOpen);
      document.removeEventListener("click", handleDocumentClick, true);
    };
  }, []);

  useEffect(() => {
    if (!preview) {
      return;
    }

    const originalOverflow = document.body.style.overflow;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setPreview(null);
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [preview]);

  if (!preview) {
    return null;
  }

  return (
    <div
      aria-label="图片预览"
      aria-modal="true"
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/82 px-4 py-5 backdrop-blur-sm sm:px-8"
      data-image-lightbox-root
      role="dialog"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          setPreview(null);
        }
      }}
    >
      <button
        ref={closeButtonRef}
        aria-label="关闭图片预览"
        className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/16 bg-black/48 text-white shadow-[0_18px_42px_-22px_rgba(0,0,0,0.6)] backdrop-blur transition duration-200 hover:bg-white hover:text-[#132968] focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-6 sm:top-6"
        type="button"
        onClick={() => setPreview(null)}
      >
        <X aria-hidden="true" size={22} strokeWidth={2.2} />
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt={preview.alt}
        className="max-h-[88vh] max-w-[94vw] rounded-md object-contain shadow-[0_26px_80px_-28px_rgba(0,0,0,0.78)]"
        decoding="async"
        src={preview.src}
      />
    </div>
  );
}
