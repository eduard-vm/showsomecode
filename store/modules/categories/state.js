// Имена процессов
const processes = [
  'categories',
  'category',
  'list',
  'tags',
  'info',
  'tagInfo',
];

const state = {
  root: {
    tea: null,
    stuff: null,
    mate: null,
    coffee: null,
    herbs: null,
    'other-stuff': null,
  },

  list: [],

  tags: [],
  category: null,
  info: null,
  tag: null,
  tagInfo: null,

  menu: {
    tea: null,
    stuff: null,
  },

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
