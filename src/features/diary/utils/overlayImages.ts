const overlayModules = import.meta.glob<{ default: string }>(
  "../../../assets/overlays/*.{png,jpg,jpeg,svg,webp}",
  { eager: true },
);

export const overlayUrls = Object.values(overlayModules).map(
  (mod) => mod.default,
);

export const getRandomOverlayUrl = () => {
  if (overlayUrls.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * overlayUrls.length);
  return overlayUrls[randomIndex];
};
