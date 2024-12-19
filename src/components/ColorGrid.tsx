import { Schema } from "@/schema";
import { useQuery, useZero } from "@rocicorp/zero/react";
import { useState, useCallback, useEffect } from "react";

const GRID_SIZE = 64;
const COLORS = [
  "#FF0000", // Red
  "#FFFF00", // Yellow
  "#008000", // Green
  "#0000FF", // Blue
  "#FFFFFF", // White
  "#000000", // Black
];

const grid = Array(GRID_SIZE)
  .fill(null)
  .map(() => Array(GRID_SIZE).fill(""));

export default function ColorGrid() {
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  const [cellSize, setCellSize] = useState(0);

  const z = useZero<Schema>();

  const [cells] = useQuery(z.query.cells);

  const getCell = (x: number, y: number) => {
    return cells.find((cell) => cell.x_position === x && cell.y_position === y);
  };

  const updateCell = ({
    x_position,
    y_position,
    color,
  }: {
    x_position: number;
    y_position: number;
    color: string;
  }) => {
    const cell = getCell(x_position, y_position);
    const now = new Date().toISOString();
    z.mutate.cells.upsert({
      id: `default-${x_position}-${y_position}`,
      canvas_id: "default",
      x_position,
      y_position,
      color,
      inserted_at: cell?.inserted_at || now,
      updated_at: now,
    });
  };

  useEffect(() => {
    const updateCellSize = () => {
      const smallerDimension = Math.min(
        window.innerWidth,
        window.innerHeight - 80,
      ); // Subtracting 80px for the color picker
      setCellSize(Math.floor(smallerDimension / GRID_SIZE));
    };

    updateCellSize();
    window.addEventListener("resize", updateCellSize);
    return () => window.removeEventListener("resize", updateCellSize);
  }, []);

  const handleColorClick = useCallback((color: string) => {
    setSelectedColor(color);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#101010] text-white">
      <div className="p-4 bg-[#1B1B1B] border-b border-[#2E2E2E] z-10">
        <h1 className="text-2xl font-bold mb-2">Zero Place</h1>
        <p className="text-sm text-gray-400 mb-4">
          Data will be cleared every 30 minutes.
        </p>
        <div className="flex justify-between">
          <div className="flex gap-2">
            {COLORS.map((color) => (
              <button
                key={color}
                className={`w-8 h-8 rounded-md ${selectedColor === color ? "ring-2 ring-white" : ""}`}
                style={{ backgroundColor: color }}
                onClick={() => handleColorClick(color)}
                aria-label={`Select ${color}`}
              />
            ))}
          </div>
          <label className="flex items-center gap-2">
            <span className="text-sm">Custom Color</span>
            <div
              className="w-8 h-8 rounded-md"
              style={{ backgroundColor: selectedColor }}
            >
              <input
                type="color"
                value={selectedColor}
                onChange={(e) => handleColorClick(e.target.value)}
                className="opacity-0 w-full h-full cursor-pointer"
              />
            </div>
          </label>
        </div>
      </div>

      <div className="flex-grow overflow-auto">
        <div
          className="grid mx-auto"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, ${cellSize}px)`,
            width: `${GRID_SIZE * cellSize}px`,
            height: `${GRID_SIZE * cellSize}px`,
          }}
        >
          {grid.map((row, rowIndex) =>
            row.map((_cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="hover:opacity-75 transition-opacity"
                style={{
                  backgroundColor:
                    getCell(rowIndex, colIndex)?.color || "#2E2E2E",
                  width: `${cellSize}px`,
                  height: `${cellSize}px`,
                }}
                onClick={() => {
                  updateCell({
                    x_position: rowIndex,
                    y_position: colIndex,
                    color: selectedColor,
                  });
                }}
              />
            )),
          )}
        </div>
      </div>
    </div>
  );
}
