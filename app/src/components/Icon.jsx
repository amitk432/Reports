import React from "react";
const paths = {
  grid: "M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z",
  diagram: "M12 2 3 7v10l9 5 9-5V7z M3 7l9 5 9-5 M12 12v10 M7 9l9-5",
  body: "M9 4a3 3 0 1 0 6 0a3 3 0 1 0-6 0 M8 9h8l3 7-3 1-2-4v8h-4v-8l-2 4-3-1z",
  file: "M14 2H5v20h14V7z M14 2v6h5 M8 12h8 M8 16h6",
  timeline: "M6 3v18 M6 6h3 M6 12h3 M6 18h3 M12 5h8 M12 11h8 M12 17h8",
  trend: "M3 3v18h18 M6 15l5-5 4 3 6-8",
  heart:
    "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z",
  arrow: "M5 12h14 M14 7l5 5-5 5",
  down: "M12 3v12 M7 10l5 5 5-5 M4 17v4h16v-4",
  search: "M10.5 3a7.5 7.5 0 1 0 0 15a7.5 7.5 0 1 0 0-15 M16 16l5 5",
  plus: "M12 5v14 M5 12h14",
  close: "M6 6l12 12 M18 6 6 18",
  check: "M5 12l4 4L19 6",
  rotate: "M20 7V3l-4 1 M20 4a9 9 0 1 0 1 11",
  expand: "M8 3H3v5 M16 3h5v5 M3 16v5h5 M21 16v5h-5",
  shield: "M12 2 3 6v6c0 5 9 10 9 10s9-5 9-10V6z M8 12l3 3 5-6",
  chevron: "M9 5l7 7-7 7",
  clock: "M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18 M12 7v5l3 2",
  info: "M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18 M12 11v6 M12 7v1",
  menu: "M3 6h18 M3 12h18 M3 18h18",
};
export default function Icon({ name, size = 20, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d={paths[name] || paths.file} />
    </svg>
  );
}
