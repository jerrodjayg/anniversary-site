// ============================================================
//  EDIT THESE THINGS
//
//  1) START_MONTH + START_YEAR = the month you got together.
//     (START_MONTH: 1 = Jan ... 12 = Dec)
//  2) COUNT = how many months to show.
//  3) PHOTOS = your photos OR videos, by month number (1 = first).
//     Videos (.mp4 .webm .mov .ogg) get a play button automatically.
//     Drop files in  public/assets/  and reference as "/assets/name.jpg".
//  4) DESCRIPTIONS = your own words under each picture, by month number.
// ============================================================

export const START_MONTH = 6; // 6 = June
export const START_YEAR = 2025;
export const COUNT = 13; // June 2025 -> June 2026

export const PHOTOS: Record<number, string> = {
  1: "/June1.JPG",
  2: "/July.MP4",
  3: "/August.JPG",
  4: "/September.jpg",
  5: "/October.MOV",
  6: "/November.jpg",
  7: "/December.MP4",
  8: "/January.MP4",
  9: "/Febuary.MP4",
  10: "/March.MP4",
  11: "/April.JPG",
  12: "/May.JPG",
  13: "June.jpg",
  // 2: "/assets/beach-trip.mp4",
};

export const DESCRIPTIONS: Record<number, string> = {
  1: "the day it all started \u2665",
  2: "our first trip - I was so happy",
  3: "lulu day - I was so happy to match with you, your booty looked so nice",
  4: "Birthday party - my beautiful princess. i was so happy riding back home together",
  5: "your birthday - great day",
  6: "first day meeting your mom - regardless of the outcome this day was still very special to me.you looked so beautiful",
  7: "fendimas - I really enjoyed this day",
  8: "vaca picture for you to enjoy",
  9: "valentines day - the best valentines day I've ever had",
  10: "video of me to enjoy",
  11: "random day - such a nice day we had together",
  12: "gym flick - couldn't find any may pictures but heres one of me at the gym:)",
  13: "painting date - amazing day I had such a great time. this was my first time doing a date like this and i am so blessed to have shared this moment with you",
};

// The spinning-free sparkly flower image (lives in public/).
export const FLOWER_SRC = "/flower.png";

export interface MonthEntry {
  date: string;
  src: string;
  desc: string;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const MONTHS: MonthEntry[] = Array.from({ length: COUNT }, (_, k) => {
  const m = (START_MONTH - 1 + k) % 12;
  const y = START_YEAR + Math.floor((START_MONTH - 1 + k) / 12);
  return {
    date: `${MONTH_NAMES[m]} ${y}`,
    src: PHOTOS[k + 1] || "",
    desc: DESCRIPTIONS[k + 1] || "",
  };
});

export function isVideo(src: string): boolean {
  return /\.(mp4|webm|mov|ogg|ogv|m4v)$/i.test(src);
}

// ---------- pixel sprite data (used by clouds + photo placeholder) ----------
export type Grid = number[][];
export type Palette = Record<number, string>;

export const CLOUD: Grid = [
  [0, 0, 0, 1, 1, 1, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
  [2, 2, 2, 2, 2, 2, 2, 2, 2],
];
export const CLOUD_PAL: Palette = {
  0: "transparent",
  1: "#ffffff",
  2: "#dbeeff",
};

export const HEART: Grid = [
  [0, 1, 1, 0, 0, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 1, 1, 0, 0, 0],
];
export const HEART_PAL: Palette = { 0: "transparent", 1: "#ff9ac0" };
