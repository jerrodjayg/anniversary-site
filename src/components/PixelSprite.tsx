import type { CSSProperties } from "react";
import type { Grid, Palette } from "../data";

interface Props {
  grid: Grid;
  palette: Palette;
  px: number;
  className?: string;
  style?: CSSProperties;
}

export default function PixelSprite({ grid, palette, px, className, style }: Props) {
  const cols = grid[0].length;
  const rows = grid.length;

  const wrapStyle: CSSProperties = {
    display: "grid",
    lineHeight: 0,
    gridTemplateColumns: `repeat(${cols}, ${px}px)`,
    gridTemplateRows: `repeat(${rows}, ${px}px)`,
    width: cols * px,
    height: rows * px,
    ...style,
  };

  return (
    <div className={className} style={wrapStyle}>
      {grid.flatMap((row, r) =>
        row.map((key, c) => (
          <i
            key={`${r}-${c}`}
            style={{
              display: "block",
              width: px,
              height: px,
              background: palette[key] || "transparent",
            }}
          />
        ))
      )}
    </div>
  );
}
