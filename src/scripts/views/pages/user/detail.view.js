class UserDetailView {
  async render () {
    return String.raw`
      <h1>User Detail</h1>
    `
  }

  async afterRender () {

  }
}

export default new UserDetailView();
