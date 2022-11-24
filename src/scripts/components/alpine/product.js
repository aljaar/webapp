import UrlParser from "../../utils/url.parser";

export default () => ({
  product: {},
  async init () {
    const { id } = UrlParser.parseActiveUrlWithoutCombiner();
    // const product = await service.product.detail(id);
    const product = {
      id: 15,
      user_id: '09a93ad3-1313-4198-a0dd-3082a68f9fd8',
      title: 'Tasty Concrete Chair',
      description:
        'New ABC 13 9370, 13.3, 5th Gen CoreA5-8250U, 8GB RAM, 256GB SSD, power UHD Graphics, OS 10 Home, OS Office A & J 2016',
      status: null,
      drop_point: '0101000020E6100000984C158C4A565C40840D4FAF940520C0',
      drop_time: ['11:00-14:00', '16:00-16:30'],
      category: 'food',
      used_since: null,
      listed_at: '2022-11-10T17:06:58.308436',
      expired_at: '2022-11-10',
      created_at: '2022-11-10T17:06:58.308436+00:00',
      updated_at: '2022-11-10T17:06:58.308436+00:00',
      qty: 8,
      likes: 0,
      transaction: 2,
      view: 3,
      images: [
        'https://iifjmhhbusjlypxbpniy.supabase.co/storage/v1/object/public/products/09a93ad3-1313-4198-a0dd-3082a68f9fd8/d3e3a76c-f179-44a5-aeb5-35ec68fd8cec.jpg',
      ],
      tags: [
        {
          id: 1,
          name: 'Halal',
        },
        {
          id: 2,
          name: 'Non Halal',
        },
      ],
    };

    this.product = product;
  }
})