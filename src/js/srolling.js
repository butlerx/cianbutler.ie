export function toElement(element, duration) {
  const getElementY = query =>
    window.pageYOffset + document.querySelector(query).getBoundingClientRect().top;
  toY(getElementY(element), duration);
}

export function toY(y, duration) {
  const startingY = window.pageYOffset;
  // If element is close to page's bottom then window will scroll only to some position above the element.
  const diff =
    (document.body.scrollHeight - y < window.innerHeight
      ? document.body.scrollHeight - window.innerHeight
      : y) - startingY;
  const easing = t => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1);
  let start;

  if (!diff) return;

  window.requestAnimationFrame(function step(timestamp) {
    if (!start) start = timestamp;
    const time = timestamp - start;
    let percent = Math.min(time / duration, 1);
    percent = easing(percent);
    window.scrollTo(0, startingY + diff * percent);
    if (time < duration) {
      window.requestAnimationFrame(step);
    }
  });
}
