class NotificationView {
  async render () {
    return String.raw`
      <h1>Notification</h1>
    `
  }

  async afterRender () {

  }
}

export default new NotificationView();
