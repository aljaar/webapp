import { service } from '../../sdk';

export default () => ({
  items: [],
  itemsAll: [],
  filter: {
    open: false
  },
  async init() {
    // const { data: products } = await service.lists.near(200);
    // console.log(products)
    let items = [
      {
        product_id: 14,
        title: 'Small Fresh Cheese',
        description:
          'The automobile layout consists of a front-engine design, with transaxle-type transmissions mounted at the rear of the engine and four wheel drive',
        qty: 3,
        profile: {
          full_name: 'Ryan Aunur Rassyid',
          avatar_url:
            'https://lh3.googleusercontent.com/a/ALm5wu3jNDyOO1klRc5hvaS1ol48tRiiumEFhW9zZBwrvjk=s96-c',
          rating: 0,
        },
        like: 2,
        tags: ['Halal', 'Non Halal'],
        image:
          '09a93ad3-1313-4198-a0dd-3082a68f9fd8/e2a27baa-9377-43e4-ab34-de29dc25c0ec.png',
        lat: -7.2496,
        lon: 112.7417,
        distance: 0.0012165525060606,
      },
      {
        product_id: 15,
        title: 'Tasty Concrete Chair',
        description:
          'New ABC 13 9370, 13.3, 5th Gen CoreA5-8250U, 8GB RAM, 256GB SSD, power UHD Graphics, OS 10 Home, OS Office A & J 2016',
        qty: 8,
        profile: {
          full_name: 'Ryan Aunur Rassyid',
          avatar_url:
            'https://lh3.googleusercontent.com/a/ALm5wu3jNDyOO1klRc5hvaS1ol48tRiiumEFhW9zZBwrvjk=s96-c',
          rating: 0,
        },
        like: 0,
        tags: ['Halal', 'Non Halal'],
        image:
          '09a93ad3-1313-4198-a0dd-3082a68f9fd8/d3e3a76c-f179-44a5-aeb5-35ec68fd8cec.jpg',
        lat: -8.0109,
        lon: 113.3483,
        distance: 0.974231599774915,
      },
    ];

    items = ([
      ...items,
      ...items,
      ...items,
      ...items,
      ...items
    ]).map(item => ({
      ...item,
      product_id: (Math.random() * 100).toFixed(0) * 1
    }));

    this.items = items;
    this.itemsAll = Object.freeze(items);

    console.log(this.items);
  },
  image (item) {
    const { data: { publicUrl } } = service.helpers.usePublicUrl(item);
    return publicUrl;
  }
});
