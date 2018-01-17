function smoothScroll(element, duration) {
  const getElementY = query =>
    window.pageYOffset + document.querySelector(query).getBoundingClientRect().top;
  smoothScrollTo(getElementY(element), duration);
}

function smoothScrollTo(y, duration) {
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

function fadeOut(arg) {
  const el = document.getElementById(arg);
  el.style.opacity = 1;

  (function fade() {
    const val = parseFloat(el.style.opacity) - 0.1;
    el.style.opacity = val;
    if (val < 0) {
      el.style.display = 'none';
    } else {
      requestAnimationFrame(fade);
    }
  })();
}

function fadeIn(arg, display) {
  const el = document.getElementById(arg);
  el.style.opacity = 0;
  el.style.display = display || 'inline-block';

  (function fade() {
    const val = parseFloat(el.style.opacity) + 0.1;
    if (!(val > 1)) {
      el.style.opacity = val;
      requestAnimationFrame(fade);
    }
  })();
}

document.addEventListener(
  'DOMContentLoaded',
  () => {
    const links = [...document.getElementsByClassName('sub-nav__link')];
    links.forEach(link => {
      link.addEventListener('click', smoothScroll.bind(null, link.hash, 1000));
    });
    const toTop =
      document.getElementsByClassName('sidebar')[0].style.height - window.screen.height + 60;
    window.addEventListener('scroll', () => {
      if (document.width >= 800) {
        const scrollTop =
          window.pageYOffset !== undefined
            ? window.pageYOffset
            : (document.documentElement || document.body.parentNode || document.body).scrollTop;
        if (scrollTop > toTop && scrollTop > 0) {
          fadeIn('toTop');
        } else {
          fadeOut('toTop');
        }
      } else {
        fadeIn('toTop');
      }
      fadeIn('toTop');
    });
    document.getElementById('toTop').addEventListener('click', () => {
      smoothScrollTo(0, 600);
    });
  },
  false,
);
