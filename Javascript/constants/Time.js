const date = new Date();

const day = ["일", "월", "화", "수", "목", "금", "토"];

export const Hours =
  date.getHours() < 10 ? "0" + date.getHours() : date.getHours();

export const Now =
  date.getFullYear().toString() +
  (date.getMonth() + 1 < 10
    ? "0" + (date.getMonth() + 1)
    : date.getMonth() + 1) +
  (date.getDate() < 10 ? "0" + date.getDate() : date.getDate());

export const BaseDate =
  date.getHours() <= 4? Now - 1 : Now;
  // date.getHours() <= 4 && date.getHours() == 23 ? Now - 1 : Now;

export const Day =
  date.getFullYear().toString() +
  "-" +
  (date.getMonth() + 1 < 10
    ? "0" + (date.getMonth() + 1)
    : date.getMonth() + 1) +
  "-" +
  (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) +
  "(" +
  day[date.getDay()] +
  ")";

export const Time = (date.getHours()<10?"0"+date.getHours():date.getHours())+" : "+(date.getMinutes()<10?"0"+date.getMinutes():date.getMinutes());