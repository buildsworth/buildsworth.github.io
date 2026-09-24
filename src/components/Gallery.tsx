import { useMemo, useState } from "react";
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

const order = ["Architecture", "Structure", "Interiors", "Landscaping"];

export default function Gallery({ slides }: { slides: Slide[] }) {
  const [filter, setFilter] = useState(order[0]);
  const [index, setIndex] = useState(-1);

  const filters = useMemo(() => {
    const present = new Set(slides.map((slide) => slide.label));
    return order.filter((label) => present.has(label));
  }, [slides]);

  const visible = slides.filter((slide) => slide.label === filter);

  return (
    <div className="gallery">
      <div className="filters" role="tablist" aria-label="Project types">
        {filters.map((label) => {
          const count = slides.filter((slide) => slide.label === label).length;
          const selected = filter === label;
          return (
            <button
              key={label}
              type="button"
              role="tab"
              aria-selected={selected}
              className={selected ? "filter is-on" : "filter"}
              onClick={() => setFilter(label)}
            >
              {label}
              <span>{count}</span>
            </button>
          );
        })}
      </div>

      <ul className="mosaic">
        {visible.map((slide, slideIndex) => (
          <li key={slide.src}>
            <button
              type="button"
              className="shot"
              onClick={() => setIndex(slideIndex)}
              aria-label={`Open ${slide.alt} in the viewer`}
            >
              <img
                src={slide.src}
                alt={slide.alt}
                width={slide.width}
                height={slide.height}
                loading={slideIndex < 2 ? "eager" : "lazy"}
              />
              <span className="shot__label">{slide.label}</span>
            </button>
          </li>
        ))}
      </ul>

      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        index={index}
        slides={visible.map((slide) => ({
          src: slide.src,
          alt: slide.alt,
          width: slide.width,
          height: slide.height,
          title: slide.label,
          description: slide.alt,
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
