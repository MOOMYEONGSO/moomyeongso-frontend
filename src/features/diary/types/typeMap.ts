export const UI_TO_API = {
  public: "MOOMYEONGSO",
  mind: "DIARY",
  today: "TODAY",
} as const;

export const API_TO_UI = {
  MOOMYEONGSO: "public",
  DIARY: "mind",
  TODAY: "today",
} as const;

export type UiType = keyof typeof UI_TO_API;
export type ApiType = (typeof UI_TO_API)[UiType];
