// Имена процессов
const processes = [
  'attributes',
  'filters',
  'products',
  'latest',
  'product',
  'review',
  'reviews',
  'search',
  'widget',
  'recommended',
];

const state = {
  // Ранее просмотренное
  recently: [],

  filtered: [],

  filteredPagination: {
    limit: 8,
    page: 1,
    pages: 0,
    total: 0,
  },

  attributes: [],

  products: [],
  pagination: {
    limit: 12,
    page: 0,
    pages: 0,
    total: 0,
  },

  product: {
    name: null,
  },

  reviews: [],
  newProducts: [],
  latestProducts: [],
  productsFound: [],
  widgetProducts: [],

  searchQuery: null,

  // состояния процессов
  error: {},
  loading: {},
};

// Дефолтные значения для состояния процессов
processes.forEach((k) => {
  state.loading[k] = false;
  state.error[k] = false;
});

export default state;
