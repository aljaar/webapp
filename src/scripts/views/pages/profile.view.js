class ProfileView {
  async render () {
    return String.raw`
      <h1>Profile</h1>
    `
  }

  async afterRender () {

  }
}

export default new ProfileView();
