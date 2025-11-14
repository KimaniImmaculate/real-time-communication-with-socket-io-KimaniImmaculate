let audio;

export const initSound = () => {
  audio = new Audio("/notification.mp3");
};

export const playNotification = () => {
  if (!audio) return;
  audio.play().catch(() => console.log("User interaction required to play sound."));
};
