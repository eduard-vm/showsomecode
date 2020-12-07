/* eslint-disable no-param-reassign */
import productsService from '../../../services/ProductsService';
import * as types from './mutation-types';
import { setActionProccess } from '../utils';

const RECENTLY_WATCHED_KEY = 'recently_watched';

const serviceFilterProductsRequest = (serviceMethod) => async ({ commit, state }, params) => {
  const { products, pagination } = await productsService[serviceMethod](params);
  const { page } = params.params;
  commit(types.SET_FILTERED, (page > 1 ? [...state.filtered, ...products] : products).map(Object.freeze));
  commit(types.SET_FILTERED_PAGINATION, pagination);
  return products;
};

const serviceGetProductsRequest = (serviceMethod) => async ({ commit, state }, params) => {
  const { products, pagination } = await productsService[serviceMethod](params);
  const { page } = params.params;
  commit(types.SET_PRODUCTS, (page > 1 ? [...state.products, ...products] : products));
  commit(types.SET_PAGINATION, pagination);
  return products;
};

const getRecentlyWatched = () => JSON.parse(localStorage.getItem(RECENTLY_WATCHED_KEY)) || [];

export default {
  // Сортировка
  getProducts: setActionProccess('products', serviceGetProductsRequest('getAllByCode')),
  getSales: setActionProccess('products', serviceGetProductsRequest('getSalesProducts')),
  getPopular: setActionProccess('products', serviceGetProductsRequest('getPopular')),
  getLatestSort: setActionProccess('products', serviceGetProductsRequest('getLatestSort')),
  getCheapest: setActionProccess('products', serviceGetProductsRequest('getCheapest')),
  getProductsMostExpensive: setActionProccess('products', serviceGetProductsRequest('getMostExpensive')),
  // Фильтры
  getFilterByLatest: setActionProccess('filtered', serviceFilterProductsRequest('getFilterByLatest')),
  getFilterByNew: setActionProccess('filtered', serviceFilterProductsRequest('getFilterByNew')),
  getFilterByAttribute: setActionProccess('filtered', serviceFilterProductsRequest('getFilterByAttribute')),
  getFilterBySales: setActionProccess('filtered', serviceFilterProductsRequest('getFilterBySales')),

  async getManyProductsLessState(_, codes) {
    const result = await productsService.getManyByCode(codes.join(','));
    return result;
  },

  async getCategoryProductsLessState(_, params) {
    const { products } = await productsService.getAllByCode(params);
    return products;
  },

  getProduct: setActionProccess('product', async ({ commit }, code) => {
    const product = await productsService.getByCode(code);
    commit(types.SET_PRODUCT, product);
  }),

  fetchRecommended: setActionProccess('recommended', async (_, code) => {
    const products = await productsService.fetchRecommended(code);
    return products;
  }),

  getManyProducts: setActionProccess('widget', async ({ commit }, codes) => {
    const promises = [];
    codes.forEach((code) => promises.push(productsService.getByCode(code)));
    const result = await Promise.all(promises);
    commit(types.SET_WIDGET_PRODUCTS, result);
  }),

  getProductReviews: setActionProccess('reviews', async ({ commit }, code) => {
    const { reviews } = await productsService.getReviewsByCode(code);
    commit(types.SET_PRODUCT_REVIEWS, reviews);
    return reviews;
  }),

  addProductReviewByCode: setActionProccess('review', async (_, data) => {
    await productsService.addReviewByCode(data);
    return true;
  }),

  getProductsFilterAttributes: setActionProccess('attributes', async ({ commit }) => {
    const result = await productsService.getFilterAttributes();
    commit(types.SET_ATTRIBUTES, result);
    return result;
  }),

  // Исользуется только для выода на /product-tag/hit
  getHitProducts: setActionProccess('products', async ({ commit, state }, params) => {
    const { products, pagination } = await productsService.getFilterByAttribute({
      params,
      filter: {
        attribute: 'filter-hits',
        value: 1,
      },
    });
    const productsData = params.page > 1
      ? [...state.products, ...products]
      : products;

    commit(types.SET_PRODUCTS, productsData);
    commit(types.SET_PAGINATION, pagination);
    return products;
  }),

  searchLessState: setActionProccess('search', (_, q) => productsService.search(q)),

  searchProducts: setActionProccess('search', async ({ commit, dispatch }, searchQuery) => {
    dispatch('setSearchQuery', searchQuery);
    if (!searchQuery) {
      commit(types.SET_FOUND_PRODUCTS, []);
    } else {
      const result = await productsService.search(searchQuery);
      commit(types.SET_FOUND_PRODUCTS, result.products || result);
    }
  }),

  setSearchQuery({ commit }, query) {
    commit(types.SET_SEARCH_QUERY, query);
  },

  resetSearchResult({ commit }) {
    commit(types.SET_FOUND_PRODUCTS, []);
  },

  resetProducts({ commit }) {
    commit(types.SET_PRODUCTS, []);
    commit(types.SET_PAGINATION, {
      limit: 12,
      page: 0,
      pages: 0,
      total: 0,
    });
  },

  resetFiltered({ commit }) {
    commit(types.SET_FILTERED, []);
    commit(types.SET_FILTERED_PAGINATION, {
      limit: 12,
      page: 0,
      pages: 0,
      total: 0,
    });
  },

  // Ранее просмотренные
  getRecentlyWatched({ commit }) {
    const products = getRecentlyWatched();
    commit(types.SET_RECENTLY_WATCHED, products);
  },

  addToRecently({ commit }, product) {
    let products = getRecentlyWatched();
    if (product.code) {
      if (!products.find(({ code }) => code === product.code)) {
        if (products.length === 4) {
          products.pop();
        }
        products = [product, ...products];
        commit(types.SET_RECENTLY_WATCHED, products);
        localStorage.setItem(RECENTLY_WATCHED_KEY, JSON.stringify(products));
      }
    }
  },

  unsetProduct({ commit }) {
    commit(types.SET_PRODUCT, null);
    commit(types.SET_PRODUCT_REVIEWS, []);
  },
};
