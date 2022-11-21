class DrawerInitiator {
  static init({ button, drawer, content }) {
    button.addEventListener('click', (event) => {
      this._toggleDrawer(event, drawer);
    });

    content.addEventListener('click', (event) => {
      this._closeDrawer(event, drawer);
    });
  }

  static _toggleDrawer(event, drawer) {
    event.stopPropagation();
    drawer.classList.toggle('nav_list__open');
  }

  static _closeDrawer(event, drawer) {
    event.stopPropagation();
    drawer.classList.remove('nav_list__open');
  }
}

export default DrawerInitiator;
