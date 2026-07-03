import PixelSprite from "./PixelSprite";
import { CLOUD, CLOUD_PAL } from "../data";

const CLOUDS = [
  { top: "8%", px: 9, dur: 60, delay: 0 },
  { top: "22%", px: 6, dur: 85, delay: -20 },
  { top: "40%", px: 12, dur: 48, delay: -35 },
  { top: "60%", px: 7, dur: 72, delay: -10 },
  { top: "74%", px: 10, dur: 55, delay: -45 },
];

export default function Sky() {
  return (
    <div id="sky">
      {CLOUDS.map((c, i) => (
        <PixelSprite
          key={i}
          grid={CLOUD}
          palette={CLOUD_PAL}
          px={c.px}
          className="cloud drift"
          style={{
            top: c.top,
            animationDuration: `${c.dur}s`,
            animationDelay: `${c.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
