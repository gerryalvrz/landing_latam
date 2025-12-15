"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/cn";

type CanvasFillStyle = string | CanvasGradient | CanvasPattern;

type Direction = "diagonal" | "up" | "right" | "down" | "left";

interface GridOffset {
  x: number;
  y: number;
}

const resolveCssVar = (value: CanvasFillStyle, element?: HTMLElement | null): CanvasFillStyle => {
  if (typeof value !== "string") return value;
  const match = value.match(/var\((--[^)]+)\)/);
  if (!match) return value;
  const target = element ?? document.documentElement;
  const resolved = getComputedStyle(target).getPropertyValue(match[1]).trim();
  return resolved || value;
};

const DIRECTION_VECTOR: Record<Direction, GridOffset> = {
  diagonal: { x: 1, y: 1 },
  up: { x: 0, y: -1 },
  right: { x: 1, y: 0 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
};

interface SquaresProps {
  direction?: Direction;
  speed?: number;
  borderColor?: CanvasFillStyle;
  squareSize?: number;
  hoverFillColor?: CanvasFillStyle;
  className?: string;
}

const normalizeOffset = (value: number, size: number) => {
  const mod = value % size;
  return mod < 0 ? mod + size : mod;
};

function Squares({
  direction = "right",
  speed = 1,
  borderColor = "var(--grid-border-color)",
  squareSize = 40,
  hoverFillColor = "var(--grid-hover-color)",
  className,
}: SquaresProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);
  const numSquaresX = useRef<number>(0);
  const numSquaresY = useRef<number>(0);
  const gridOffset = useRef<GridOffset>({ x: 0, y: 0 });
  const hoveredSquareRef = useRef<GridOffset | null>(null);
  const sizeRef = useRef<{ width: number; height: number; dpr: number }>({
    width: 0,
    height: 0,
    dpr: 1,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateSize = () => {
      const parent = canvas.parentElement;
      const { width, height } = parent?.getBoundingClientRect() || {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      const dpr = window.devicePixelRatio || 1;
      sizeRef.current = { width, height, dpr };

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      numSquaresX.current = Math.ceil(width / squareSize) + 2;
      numSquaresY.current = Math.ceil(height / squareSize) + 2;
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      if (mouseX < 0 || mouseY < 0 || mouseX > rect.width || mouseY > rect.height) {
        hoveredSquareRef.current = null;
        return;
      }

      const offsetX = normalizeOffset(gridOffset.current.x, squareSize);
      const offsetY = normalizeOffset(gridOffset.current.y, squareSize);
      hoveredSquareRef.current = {
        x: Math.floor((mouseX + offsetX) / squareSize),
        y: Math.floor((mouseY + offsetY) / squareSize),
      };
    };

    const handleMouseLeave = () => {
      hoveredSquareRef.current = null;
    };

    const render = () => {
      const { width, height } = sizeRef.current;
      if (width === 0 || height === 0) {
        requestRef.current = requestAnimationFrame(render);
        return;
      }

      const offsetX = normalizeOffset(gridOffset.current.x, squareSize);
      const offsetY = normalizeOffset(gridOffset.current.y, squareSize);

      ctx.clearRect(0, 0, width, height);

      const hovered = hoveredSquareRef.current;
      const resolvedBorder = resolveCssVar(borderColor, canvas.parentElement);
      const resolvedHover = resolveCssVar(hoverFillColor, canvas.parentElement);

      if (hovered) {
        const hx = hovered.x * squareSize - offsetX;
        const hy = hovered.y * squareSize - offsetY;
        ctx.fillStyle = resolvedHover;
        ctx.fillRect(hx + 1, hy + 1, squareSize - 2, squareSize - 2);
      }

      ctx.beginPath();
      for (let i = -1; i <= numSquaresX.current; i++) {
        const x = i * squareSize - offsetX;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let j = -1; j <= numSquaresY.current; j++) {
        const y = j * squareSize - offsetY;
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.strokeStyle = resolvedBorder;
      ctx.lineWidth = 1.1;
      ctx.stroke();

      const velocity = DIRECTION_VECTOR[direction];
      gridOffset.current = {
        x: gridOffset.current.x + velocity.x * speed,
        y: gridOffset.current.y + velocity.y * speed,
      };

      requestRef.current = requestAnimationFrame(render);
    };

    updateSize();
    requestRef.current = requestAnimationFrame(render);

    window.addEventListener("resize", updateSize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("resize", updateSize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      if (requestRef.current !== null) cancelAnimationFrame(requestRef.current);
    };
  }, [borderColor, direction, hoverFillColor, speed, squareSize]);

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 z-0 opacity-70",
        className,
      )}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}

export default Squares;


