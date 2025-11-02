import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function HeroCarousel({ slides = [] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return undefined;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const active = slides[index];
  if (!active) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#F68B1E]/90 to-[#F68B1E]/70 text-white h-[320px]">
      <img
        src={active.image}
        alt={active.title}
        className="absolute inset-0 h-full w-full object-cover opacity-60"
      />
      <div className="relative h-full w-full px-10 py-12 flex flex-col justify-center gap-5">
        <div className="max-w-md space-y-3">
          <span className="inline-flex items-center rounded-full bg-white/15 px-4 py-1 text-xs uppercase tracking-widest">
            Hot Deals
          </span>
          <h2 className="text-4xl font-extrabold leading-tight drop-shadow-sm">{active.title}</h2>
          <p className="text-lg font-medium text-white/90">{active.subtitle}</p>
        </div>
        <Link
          to="/products"
          className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#F68B1E] shadow-md hover:shadow-lg transition"
        >
          {active.cta}
        </Link>
      </div>
      <div className="absolute bottom-6 right-8 flex items-center gap-2">
        {slides.map((slide, idx) => (
          <button
            key={slide.id}
            onClick={() => setIndex(idx)}
            className={`h-2.5 w-6 rounded-full transition ${
              idx === index ? 'bg-white' : 'bg-white/40'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}


