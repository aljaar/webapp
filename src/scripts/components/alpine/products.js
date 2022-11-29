import { service } from '../../sdk';
import { delay } from '../../utils/helpers';

export default () => ({
  items: [],
  itemsAll: [],
  isLoading: true,
  filter: {
    open: false,
    filters: new Map(),
    category: null,
  },
  async init() {
    const { data: products } = await service.lists.near(200);
    // console.log(products)

    await delay(500);

    this.items = products;
    this.itemsAll = Object.freeze(products);
    this.isLoading = false;
    console.log(this.items);
  },
  image(item) {
    const { data: { publicUrl } } = service.helpers.usePublicUrl(item);
    return publicUrl;
  },
  toggleFilter(column, type) {
    this.filter.filters.set('active', column);
    this.filter.filters.set('sort', type);
  },
  toggleCategory(type) {
    if (this.filter.category !== type) {
      this.filter.category = type;
    } else {
      this.filter.category = null;
    }

    console.log(this.filter.category);
  },
  isFilterActive(column, type) {
    if (!this.filter.filters.has('active')) return false;

    return (this.filter.filters.get('active') === column && this.filter.filters.get('sort') === type);
  },
  useFilterClass(column, type) {
    return {
      'text-white bg-emerald-500': this.isFilterActive(column, type),
      'text-emerald-700 bg-emerald-50 ring-1 ring-emerald-500': !this.isFilterActive(column, type),
    };
  },
  useFilterCategoryClass(type) {
    return {
      'text-white bg-emerald-600': (this.filter.category === type),
      'text-emerald-700 bg-emerald-50 ring-1 ring-emerald-500': (this.filter.category !== type),
    };
  },
});
