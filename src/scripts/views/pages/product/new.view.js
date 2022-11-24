class NewProductView {
  async render () {
    return String.raw`
      <h1>Produk Baru</h1>
    `
  }

  async afterRender () {

  }
}

export default new NewProductView();
