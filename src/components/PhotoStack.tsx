import { useCallback, useEffect, useRef, useState } from "react";
import PixelSprite from "./PixelSprite";
import { MONTHS, HEART, HEART_PAL, isVideo, type MonthEntry } from "../data";

type StackItem = MonthEntry & { kind?: "note" };

const MUSIC_SRC =
  "/Chik%C3%A9%20%26%20Simi%20%20Running%20(To%20You)%20%5BOfficial%20Audio%5D.mp3";

function CardMedia({ m, noteText }: { m: StackItem; noteText: string }) {
  if (m.kind === "note") {
    return (
      <textarea
        className="notepad"
        value={noteText}
        readOnly
        aria-label="Anniversary note"
      />
    );
  }

  const mediaClass =
    m.src === "/June1.JPG"
      ? "photo-june-start"
      : m.src === "June.jpg"
        ? "photo-june-final"
        : m.date.startsWith("October")
          ? "photo-october"
          : m.date.startsWith("April")
            ? "photo-april"
            : "";
  const className = `photo ${mediaClass}`.trim();

  if (!m.src) {
    return (
      <div className="placeholder">
        <PixelSprite grid={HEART} palette={HEART_PAL} px={10} />
      </div>
    );
  }
  if (isVideo(m.src)) {
    return (
      <video
        className={className}
        src={m.src}
        controls
        loop
        muted
        playsInline
      />
    );
  }
  return <img className={className} src={m.src} alt={m.desc || m.date} />;
}

function Card({
  item,
  position,
  noteText,
}: {
  item: StackItem;
  position: string;
  noteText: string;
}) {
  return (
    <div className={`card ${position}`}>
      <CardMedia m={item} noteText={noteText} />
      {item.desc && <div className="cap">{item.desc}</div>}
    </div>
  );
}

export default function PhotoStack() {
  const [current, setCurrent] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const noteText =
    "Happy Anniversary my solomon 4:7 princess. I am so happy to reach this milestone with you especially after all that we have overcome together. I thank God for bringing us this far and I thank you for all that you've been in my life. Your presence has uplifted me and pushed me to become better. I pray we continue to reach many milestones together. I love you";
  const items: StackItem[] = [
    ...MONTHS,
    { kind: "note", date: "A note for you", src: "", desc: "" },
  ];
  const n = items.length;

  const go = useCallback(
    (dir: number) => setCurrent((c) => Math.max(0, Math.min(n - 1, c + dir))),
    [n],
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.55;

    const playMusic = () => {
      void audio.play().catch(() => {
        // Browser autoplay rules can require a click or key press first.
      });
    };

    playMusic();
    window.addEventListener("pointerdown", playMusic, { once: true });
    window.addEventListener("keydown", playMusic, { once: true });

    return () => {
      window.removeEventListener("pointerdown", playMusic);
      window.removeEventListener("keydown", playMusic);
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const m = items[current];

  return (
    <section className="page">
      <audio ref={audioRef} src={MUSIC_SRC} loop preload="auto" />
      <div className="stack-wrap">
        <button
          className={`arrow ${current === 0 ? "hidden" : ""}`}
          onClick={() => go(-1)}
          disabled={current === 0}
          aria-label="Previous month"
        >
          ◄
        </button>
        <div className="stack">
          <Card
            item={items[(current + 2) % n]}
            position="pos-behind2"
            noteText={noteText}
          />
          <Card
            item={items[(current + 1) % n]}
            position="pos-behind1"
            noteText={noteText}
          />
          <Card
            item={items[current]}
            position="pos-front"
            noteText={noteText}
          />
        </div>
        <button
          className={`arrow ${current === n - 1 ? "hidden" : ""}`}
          onClick={() => go(1)}
          disabled={current === n - 1}
          aria-label="Next month"
        >
          ►
        </button>
      </div>

      <div className="label">
        <span className="month">{m.date}</span>
      </div>
    </section>
  );
}
