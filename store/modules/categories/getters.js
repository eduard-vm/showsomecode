export default {
  getRootCategoryByCode: (state) => (code) => state.root[code],

  categoriesList(state) {
    return Object.values(state.root).filter(Boolean);
  },
};
