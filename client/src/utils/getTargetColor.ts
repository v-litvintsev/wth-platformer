export let targetAnimationAngle = Math.random() * 360;
const TARGET_ANIMATION_ANGLE_DELTA = 60;
export const TARGET_ANIMATION_STEP = 1.5;

export const getTargetColor = (ctx: CanvasRenderingContext2D) => {
  const gradient = ctx.createLinearGradient(0, 0, 500, 0);
  gradient.addColorStop(
    0,
    "hsl(" + (targetAnimationAngle % 360) + ",100%, 50%)"
  );
  gradient.addColorStop(
    0.5,
    "hsl(" +
      ((targetAnimationAngle + TARGET_ANIMATION_ANGLE_DELTA / 2) % 360) +
      ",100%, 50%)"
  );
  gradient.addColorStop(
    1,
    "hsl(" +
      ((targetAnimationAngle + TARGET_ANIMATION_ANGLE_DELTA) % 360) +
      ",100%, 50%)"
  );
  return gradient;
};

export const targetAngleLoop = () =>
  setInterval(() => {
    targetAnimationAngle += TARGET_ANIMATION_STEP;
  }, 1000 / 30);
