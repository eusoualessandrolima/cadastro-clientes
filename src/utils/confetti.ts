import confetti from 'canvas-confetti';

const CC_GREEN = '#00FF94';
const WHITE = '#FFFFFF';
const GOLD = '#FFD700';

// Standard confetti burst
export function fireConfetti() {
  confetti({
    particleCount: 50,
    spread: 70,
    origin: { y: 0.6 },
    colors: [CC_GREEN, WHITE],
  });
}

// Milestone celebration (25%, 50%, 75%)
export function celebrateMilestone() {
  confetti({
    particleCount: 30,
    spread: 50,
    origin: { y: 0.5 },
    colors: [CC_GREEN],
  });
}

// Intense milestone (50%)
export function celebrateMidway() {
  const duration = 1500;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: [CC_GREEN, WHITE],
    });
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: [CC_GREEN, WHITE],
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  frame();
}

// Success screen celebration (cascading)
export function celebrateSuccess() {
  const duration = 3000;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: [CC_GREEN, WHITE],
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: [CC_GREEN, WHITE],
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  frame();
}

// Excellent quality celebration (gold + green)
export function celebrateExcellent() {
  confetti({
    particleCount: 50,
    spread: 60,
    origin: { y: 0.6 },
    colors: [CC_GREEN, GOLD],
  });
}

// Micro confetti for small celebrations
export function microConfetti(origin?: { x: number; y: number }) {
  confetti({
    particleCount: 15,
    spread: 40,
    origin: origin || { y: 0.6 },
    colors: [CC_GREEN],
    scalar: 0.8,
  });
}
