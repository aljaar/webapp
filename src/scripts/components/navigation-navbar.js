import UrlParser from '../utils/url.parser';

class NavigationNavbar extends HTMLElement {
  constructor() {
    super();

    this.states = [
      { id: 'home', route: '/' },
      { id: 'maps', route: '/maps' },
      { id: 'transaksi', route: '/transactions' },
      { id: 'share', route: '/product' },
      { id: 'profile', route: '/profile' },
    ];

    this.render();
    this.afterRender();
  }

  get activeState() {
    const activeRoute = UrlParser.parseActiveUrlWithCombiner();

    return this.states.find((item) => item.route === activeRoute) ?? {
      id: 'home', route: '/',
    };
  }

  onMenuItemClicked(element) {
    const route = this.states.find((item) => item.id === element.id.replace('navbar-', ''));
    console.log(route);
    if (!route) {
      window.location.href = '/#/';
    } else {
      window.location.href = `/#${route.route}`;
    }

    this.initializeActiveClassState();
  }

  render() {
    this.innerHTML = String.raw`
      <div id="navbar-home" class="menu-item">
        <div class="menu-item--icon">
          <iconify-icon icon="ic:baseline-home"></iconify-icon>
        </div>
        <span class="menu-item--text inline-block">Home</span>
      </div>
      <div id="navbar-maps" class="menu-item">
        <div class="menu-item--icon">
          <iconify-icon icon="mdi:map-search"></iconify-icon>
        </div>
        <span class="menu-item--text inline-block">Maps</span>
      </div>
      <div id="navbar-share" class="menu-item">
        <div class="menu-item--icon">
          <iconify-icon icon="ri:add-circle-fill"></iconify-icon>
        </div>
        <span class="menu-item--text inline-block">Share</span>
      </div>
      <div id="navbar-transaksi" class="menu-item">
        <div class="menu-item--icon">
          <iconify-icon icon="ri:hand-heart-line"></iconify-icon>
        </div>
        <span class="menu-item--text inline-block">Transaksi</span>
      </div>
      <div id="navbar-profile" class="menu-item">
        <div class="menu-item--icon">
          <iconify-icon icon="mdi:account"></iconify-icon>
        </div>
        <span class="menu-item--text inline-block">Profile</span>
      </div>
    `;
  }

  afterRender() {
    const items = document.querySelectorAll('.menu-item');

    items.forEach((item) => {
      item.addEventListener('click', () => {
        this.onMenuItemClicked(item);
      });
    });

    this.initializeActiveClassState();
  }

  initializeActiveClassState() {
    const items = document.querySelectorAll('.menu-item');

    items.forEach((item) => {
      item.classList.remove('active');

      if (item.id.includes(this.activeState.id)) {
        item.classList.add('active');
      }
    });
  }
}

export default NavigationNavbar;
