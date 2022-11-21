import { when } from './helpers';

export const setActiveNavbar = (page) => {
  const navbarLinks = document.querySelectorAll('.nav_list__item');

  navbarLinks.forEach((link) => link.classList.remove('active'));
  navbarLinks.forEach((link) => when(link.dataset.router === page, () => link.classList.add('active')));
};
