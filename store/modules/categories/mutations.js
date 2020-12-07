import Vue from 'vue';

import * as types from './mutation-types';

const updateStateObjField = (state, fieldKey, updates = {}) => Object
  .keys(updates)
  .forEach((propKey) => {
    Vue.set(state[fieldKey], propKey, updates[propKey]);
  });

export default {
  [types.SET_LIST](state, list) {
    state.list = list;
  },

  [types.SET_CATEGORIES](state, categories) {
    categories.forEach((category) => {
      Vue.set(state.root, category.code, category);
    });
  },

  [types.SET_MENU_CATEGORIES](state, { tea, stuff }) {
    state.menu = {
      tea,
      stuff,
    };
  },

  [types.SET_CATEGORY](state, category) {
    // Vue.set(state.root, category.code, category);
    state.category = category;
  },

  [types.TAG_INFO](state, tagInfo) {
    state.tagInfo = tagInfo;
  },

  [types.SET_TAGS](state, tags) {
    state.tags = tags || [];
  },

  [types.SET_TAG](state, tag) {
    state.tag = tag;
  },

  [types.SET_LOADING](state, updates) {
    updateStateObjField(state, 'loading', updates);
  },

  [types.SET_ERROR](state, updates) {
    updateStateObjField(state, 'error', updates);
  },
};
