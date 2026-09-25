import { useEffect, useMemo, useRef, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";

export type Slide = {
  src: string;
  width: number;
  height: number;
  alt: string;
  category: string;
  label: string;
};

export type ServiceItem = {
  id: string;
  title: string;
  paragraphs: string[];
};

const DESKTOP_PAGE = 6;
const MOBILE_QUERY = "(max-width: 719px)";

function Chevron({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        d={dir === "prev" ? "M15 5 8 12l7 7" : "m9 5 7 7-7 7"}
      />
    </svg>
  );
}

export default function Services({
  items,
  slides,
}: {
  items: ServiceItem[];
  slides: Slide[];
}) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  const [page, setPage] = useState(0);
  const [index, setIndex] = useState(-1);
  const [slide, setSlide] = useState(0);
  const [mobile, setMobile] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(MOBILE_QUERY).matches : true,
  );
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = window.matchMedia(MOBILE_QUERY);
    const sync = () => {
      const next = media.matches;
      setMobile((prev) => {
        if (prev !== next) {
          setPage(0);
          setSlide(0);
        }
        return next;
      });
    };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const current = useMemo(
    () => items.find((item) => item.id === active) ?? items[0],
    [active, items],
  );

  const visible = useMemo(
    () => slides.filter((item) => item.category === current?.id),
    [slides, current],
  );

  useEffect(() => {
    setSlide(0);
    const track = trackRef.current;
    if (track) track.scrollTo({ left: 0 });
  }, [active]);

  const pageCount = Math.max(1, Math.ceil(visible.length / DESKTOP_PAGE));
  const safePage = Math.min(page, pageCount - 1);
  const pageSlides = visible.slice(safePage * DESKTOP_PAGE, safePage * DESKTOP_PAGE + DESKTOP_PAGE);
  const canPrev = safePage > 0;
  const canNext = safePage < pageCount - 1;

  const onTrackScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const width = track.clientWidth;
    if (!width) return;
    const next = Math.round(track.scrollLeft / width);
    setSlide(Math.min(visible.length - 1, Math.max(0, next)));
  };

  const goToSlide = (next: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.min(visible.length - 1, Math.max(0, next));
    track.scrollTo({ left: clamped * track.clientWidth, behavior: "smooth" });
    setSlide(clamped);
  };

  if (!current) return null;

  return (
    <div className={mobile ? "service-panel is-mobile" : "service-panel"}>
      <div className="filters" role="tablist" aria-label="Project types">
        {items.map((item) => {
          const selected = item.id === current.id;
          const count = slides.filter((entry) => entry.category === item.id).length;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={selected}
              className={selected ? "filter is-on" : "filter"}
              onClick={() => {
                setActive(item.id);
                setPage(0);
                setSlide(0);
                setIndex(-1);
              }}
            >
              {item.title}
              <span>{count}</span>
            </button>
          );
        })}
      </div>

      <div className="service-panel__copy" key={current.id}>
        {current.paragraphs.map((para) => (
          <p key={para.slice(0, 40)}>{para}</p>
        ))}
      </div>

      {mobile ? (
        <div className="service-slider">
          <div
            className="service-slider__track"
            ref={trackRef}
            onScroll={onTrackScroll}
            aria-label={`${current.title} photos`}
          >
            {visible.map((item, slideIndex) => (
              <button
                key={item.src}
                type="button"
                className="service-slider__slide shot"
                onClick={() => setIndex(slideIndex)}
                aria-label={`Open ${item.alt} in the viewer`}
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  loading={slideIndex === 0 ? "eager" : "lazy"}
                  draggable={false}
                />
              </button>
            ))}
          </div>

          {visible.length > 1 && (
            <div className="service-slider__bar">
              <button
                type="button"
                className="service-slider__chip"
                aria-label="Previous photo"
                disabled={slide <= 0}
                onClick={() => goToSlide(slide - 1)}
              >
                <Chevron dir="prev" />
              </button>
              <p className="service-slider__count" aria-live="polite">
                <strong>{slide + 1}</strong>/{visible.length}
              </p>
              <button
                type="button"
                className="service-slider__chip"
                aria-label="Next photo"
                disabled={slide >= visible.length - 1}
                onClick={() => goToSlide(slide + 1)}
              >
                <Chevron dir="next" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="service-panel__gallery">
            {pageCount > 1 && (
              <button
                type="button"
                className="service-panel__nav service-panel__nav--prev"
                aria-label="Previous photos"
                disabled={!canPrev}
                onClick={() => setPage((p) => Math.max(0, Math.min(p, pageCount - 1) - 1))}
              >
                <Chevron dir="prev" />
              </button>
            )}

            <ul className="mosaic mosaic--services" aria-live="polite">
              {pageSlides.map((item, slideIndex) => {
                const absoluteIndex = safePage * DESKTOP_PAGE + slideIndex;
                return (
                  <li key={item.src}>
                    <button
                      type="button"
                      className="shot"
                      onClick={() => setIndex(absoluteIndex)}
                      aria-label={`Open ${item.alt} in the viewer`}
                    >
                      <img
                        src={item.src}
                        alt={item.alt}
                        width={item.width}
                        height={item.height}
                        loading={slideIndex < 2 ? "eager" : "lazy"}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>

            {pageCount > 1 && (
              <button
                type="button"
                className="service-panel__nav service-panel__nav--next"
                aria-label="Next photos"
                disabled={!canNext}
                onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              >
                <Chevron dir="next" />
              </button>
            )}
          </div>

          {pageCount > 1 && (
            <p className="service-panel__page">
              {safePage + 1} / {pageCount}
            </p>
          )}
        </>
      )}

      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        index={index}
        slides={visible.map((item) => ({
          src: item.src,
          alt: item.alt,
          width: item.width,
          height: item.height,
          title: item.label,
          description: item.alt,
        }))}
        plugins={[Captions, Zoom]}
        captions={{ descriptionTextAlign: "center" }}
        zoom={{ maxZoomPixelRatio: 2 }}
        controller={{ closeOnBackdropClick: true }}
        styles={{ container: { backgroundColor: "rgba(18, 20, 17, 0.94)" } }}
      />
    </div>
  );
}
