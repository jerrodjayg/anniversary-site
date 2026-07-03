/**
 * MermaidSequinBoard
 * -------------------
 * A pixelated, canvas-based "flip sequin" board. Pick a mode (color / erase)
 * then drag across the board with a finger, stylus, or mouse — cells switch
 * between the pink and orange palettes as you go.
 */
import { useRef, useEffect, useState, useCallback } from "react";
import type { CSSProperties } from "react";

interface Cell {
  idx: number;
  flipped: boolean;
}

type Mode = "paint" | "erase";

export interface MermaidSequinBoardProps {
  width?: number;
  height?: number;
  cellSize?: number;
  pinkShades?: string[];
  orangeShades?: string[];
  className?: string;
  style?: CSSProperties;
}

const DEFAULT_PINK = ["#F4C0D1", "#ED93B1", "#D4537E", "#F7D3E0", "#E274A0"];
const DEFAULT_ORANGE = ["#FAC775", "#EF9F27", "#BA7517", "#FBDCA0", "#D68A1A"];

export default function MermaidSequinBoard({
  width = 720,
  height = 430,
  cellSize = 16,
  pinkShades = DEFAULT_PINK,
  orangeShades = DEFAULT_ORANGE,
  className = "",
  style = {},
}: MermaidSequinBoardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridRef = useRef<Cell[][] | null>(null);
  const scaleRef = useRef<{ x: number; y: number }>({ x: 1, y: 1 });
  const dragRef = useRef<{ dragging: boolean; lastX: number; lastY: number }>({
    dragging: false,
    lastX: 0,
    lastY: 0,
  });
  const modeRef = useRef<Mode>("paint");
  const [mode, setModeState] = useState<Mode>("paint");

  const rowH = cellSize * 0.82;
  const cols = Math.floor(width / cellSize) + 1;
  const rows = Math.ceil(height / rowH) + 1;

  // Lazily build the grid once, on first render.
  if (!gridRef.current) {
    const grid: Cell[][] = [];
    for (let r = 0; r < rows; r++) {
      const row: Cell[] = [];
      for (let c = 0; c < cols; c++) {
        row.push({
          idx: Math.floor(Math.random() * pinkShades.length),
          flipped: false,
        });
      }
      grid.push(row);
    }
    gridRef.current = grid;
  }

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const grid = gridRef.current;
      if (!grid) return;
      ctx.clearRect(0, 0, width, height);
      for (let r = 0; r < rows; r++) {
        const offset = r % 2 === 1 ? cellSize / 2 : 0;
        for (let c = 0; c < cols; c++) {
          const cell = grid[r][c];
          const x = c * cellSize + offset - cellSize / 2;
          const y = r * rowH;
          const palette = cell.flipped ? orangeShades : pinkShades;
          ctx.fillStyle = palette[cell.idx];
          ctx.fillRect(
            Math.round(x),
            Math.round(y),
            cellSize - 1,
            cellSize - 1,
          );
        }
      }
    },
    [cols, rows, cellSize, rowH, width, height, pinkShades, orangeShades],
  );

  const cellAt = useCallback(
    (px: number, py: number): { r: number; c: number } | null => {
      const r = Math.floor(py / rowH);
      if (r < 0 || r >= rows) return null;
      const offset = r % 2 === 1 ? cellSize / 2 : 0;
      const c = Math.floor((px - offset + cellSize / 2) / cellSize);
      if (c < 0 || c >= cols) return null;
      return { r, c };
    },
    [rowH, rows, cellSize, cols],
  );

  const brush = useCallback(
    (px: number, py: number) => {
      const grid = gridRef.current;
      if (!grid) return;
      for (let brx = -2; brx <= 2; brx++) {
        for (let bry = -2; bry <= 2; bry++) {
          const target = cellAt(
            px + brx * cellSize * 0.5,
            py + bry * cellSize * 0.5,
          );
          if (target)
            grid[target.r][target.c].flipped = modeRef.current === "paint";
        }
      }
    },
    [cellAt, cellSize],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas!.getBoundingClientRect();
      const w = rect.width || width;
      const h = rect.height || height;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      ctx!.setTransform((w * dpr) / width, 0, 0, (h * dpr) / height, 0, 0);
      scaleRef.current = { x: width / w, y: height / h };
      draw(ctx!);
    }

    function getPos(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      return {
        x: (e.clientX - rect.left) * scaleRef.current.x,
        y: (e.clientY - rect.top) * scaleRef.current.y,
      };
    }

    function onPointerDown(e: PointerEvent) {
      canvas!.setPointerCapture(e.pointerId);
      dragRef.current.dragging = true;
      const p = getPos(e);
      dragRef.current.lastX = p.x;
      dragRef.current.lastY = p.y;
      brush(p.x, p.y);
      draw(ctx!);
    }

    function onPointerMove(e: PointerEvent) {
      if (!dragRef.current.dragging) return;
      const p = getPos(e);
      const { lastX, lastY } = dragRef.current;
      const dx = p.x - lastX;
      const dy = p.y - lastY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const steps = Math.max(1, Math.ceil(dist / (cellSize / 2)));
      for (let s = 0; s <= steps; s++) {
        const sx = lastX + dx * (s / steps);
        const sy = lastY + dy * (s / steps);
        brush(sx, sy);
      }
      draw(ctx!);
      dragRef.current.lastX = p.x;
      dragRef.current.lastY = p.y;
    }

    function endDrag() {
      dragRef.current.dragging = false;
    }

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", endDrag);
    canvas.addEventListener("pointercancel", endDrag);
    window.addEventListener("resize", resize);

    resize();

    return () => {
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", endDrag);
      canvas.removeEventListener("pointercancel", endDrag);
      window.removeEventListener("resize", resize);
    };
  }, [draw, brush, width, height, cellSize]);

  function setMode(m: Mode) {
    modeRef.current = m;
    setModeState(m);
  }

  function reset() {
    const grid = gridRef.current;
    if (!grid) return;
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        grid[r][c].flipped = false;
      }
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    draw(ctx);
  }

  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        ...style,
      }}
    >
      <div style={{ display: "flex", gap: 8 }}>
        <button
          type="button"
          onClick={() => setMode("paint")}
          style={modeButtonStyle(mode === "paint")}
        >
          color
        </button>
        <button
          type="button"
          onClick={() => setMode("erase")}
          style={modeButtonStyle(mode === "erase")}
        >
          erase
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          width: "100%",
          maxWidth: width,
          aspectRatio: `${width} / ${height}`,
          cursor: "crosshair",
          borderRadius: 8,
          border: 0,
          outline: "1px solid #e5c9d3",
          display: "block",
          touchAction: "none",
        }}
      />
      <button type="button" onClick={reset} style={resetButtonStyle}>
        reset
      </button>
    </div>
  );
}

function modeButtonStyle(active: boolean): CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "10px 16px",
    minHeight: 44,
    borderRadius: 8,
    border: active ? "1px solid #d4537e" : "1px solid #ddd",
    background: active ? "#fbeaf0" : "#fff",
    color: active ? "#72243e" : "#333",
    fontSize: 14,
    cursor: "pointer",
  };
}

const resetButtonStyle: CSSProperties = {
  padding: "8px 14px",
  minHeight: 40,
  borderRadius: 8,
  border: "1px solid #ddd",
  background: "#fff",
  color: "#333",
  fontSize: 13,
  cursor: "pointer",
};
