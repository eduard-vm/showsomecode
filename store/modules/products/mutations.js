import Vue from 'vue';
import * as types from './mutation-types';

const updateStateObjField = (state, fieldKey, updates = {}) => Object
  .keys(updates)
  .forEach((propKey) => {
    Vue.set(state[fieldKey], propKey, updates[propKey]);
  });

export default {
  [types.SET_SEARCH_QUERY](state, searchQuery) {
    state.searchQuery = searchQuery;
  },

  [types.SET_PRODUCTS](state, products) {
    state.products = products;
  },

  [types.SET_WIDGET_PRODUCTS](state, products) {
    state.widgetProducts = products;
  },

  [types.SET_FILTERED](state, products) {
    state.filtered = products;
  },

  [types.SET_FILTERED_PAGINATION](state, pagination) {
    state.filteredPagination = pagination;
  },

  [types.SET_NEW_PRODUCTS](state, products) {
    state.newProducts = products;
  },

  [types.SET_PRODUCT](state, product) {
    state.product = product;
  },

  [types.SET_PRODUCT_REVIEWS](state, reviews) {
    state.reviews = reviews;
  },

  [types.SET_PAGINATION](state, pagination) {
    state.pagination = pagination;
  },

  [types.SET_PRODUCT_REVIEWS](state, reviews) {
    state.reviews = Object.freeze(reviews);
  },

  [types.SET_FOUND_PRODUCTS](state, productsFound) {
    state.productsFound = Object.freeze(productsFound);
  },

  [types.SET_ATTRIBUTES](state, attributes) {
    state.attributes = attributes;
  },

  [types.SET_RECENTLY_WATCHED](state, recently) {
    state.recently = recently || [];
  },

  [types.SET_LOADING](state, updates) {
    updateStateObjField(state, 'loading', updates);
  },

  [types.SET_ERROR](state, updates) {
    updateStateObjField(state, 'error', updates);
  },
};
