import '../css/main.scss';
import * as smoothScroll from './srolling';

document.addEventListener(
  'DOMContentLoaded',
  () => {
    const links = [...document.getElementsByClassName('sub-nav__link')];
    const active = [...document.getElementsByClassName('active')];
    [...document.getElementsByClassName('animation-target')][0].classList.remove(
      'animation-target',
    );
    if (active[0]) {
      active[0].addEventListener('click', () => smoothScroll.toY(0, 1000));
    }
    links.forEach(link => {
      link.addEventListener('click', () => smoothScroll.toElement(link.hash, 1000));
    });
  },
  false,
);
