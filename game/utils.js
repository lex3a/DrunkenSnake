function playSound(frequency, type) {
  const context = new AudioContext();
  const o = context.createOscillator();
  const g = context.createGain();
  o.type = type;
  o.connect(g);
  o.frequency.value = frequency;
  g.connect(context.destination);
  o.start(0);
  g.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 1);
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export { playSound, random };
