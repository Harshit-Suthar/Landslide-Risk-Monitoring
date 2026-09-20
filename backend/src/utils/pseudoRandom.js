/**
 * Simple deterministic pseudo-random number generator seeded by string.
 * Generates a float between 0 (inclusive) and 1 (exclusive).
 */
function seededRandom(seedStr) {
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    const char = seedStr.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  const x = Math.sin(hash++) * 10000;
  return x - Math.floor(x);
}

module.exports = {
  seededRandom
};
