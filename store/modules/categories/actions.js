/* eslint-disable no-param-reassign */
import categoriesService from '../../../services/CategoriesService';
import { setActionProccess } from '../utils';

import * as types from './mutation-types';

export default {
  async getCategoryTags({ commit, state }, code) {
    commit(types.SET_LOADING, {
      tags: true,
    });
    try {
      const codes = [];

      if (state.category && state.category.children) {
        state.category.children.forEach((c) => codes.push(c.code));
      }
      const data = await categoriesService.getCategoryTagsByCode(code);
      let tags = [];

      if (data && data.self) {
        tags = data.self.children;
        tags = tags.filter((tag) => !codes.includes(tag.code.replace('_tag', '')));
      }

      commit(types.SET_TAGS, tags);
      return tags;
    } catch (error) {
      commit(types.SET_TAGS, []);
      return [];
    } finally {
      commit(types.SET_LOADING, {
        tags: false,
      });
    }
  },

  getAllCategories: setActionProccess('categories', async ({ commit }, params) => {
    const lsKey = 'allCategories';
    const allCategories = JSON.parse(localStorage.getItem(lsKey));
    if (allCategories) {
      commit(types.SET_CATEGORIES, allCategories);
      commit(types.SET_LOADING, {
        categories: false,
      });
    }
    const { self } = await categoriesService.getAllCategories(params);
    localStorage.setItem(lsKey, JSON.stringify(self.children));
    commit(types.SET_CATEGORIES, self.children);
    return self.children;
  }),

  getCategory: setActionProccess('category', async ({ commit }, code) => {
    const lsKey = `category__${code}`;
    const cacheCategory = JSON.parse(localStorage.getItem(lsKey));
    if (cacheCategory) {
      commit(types.SET_CATEGORY, cacheCategory);
      commit(types.SET_LOADING, {
        category: false,
      });
    }
    const { self } = await categoriesService.getCategoryInfoByCode(code);
    localStorage.setItem(lsKey, JSON.stringify(self));
    commit(types.SET_CATEGORY, self);
    return self;
  }),

  getCategoryInfo: setActionProccess('info', async ({ commit }, code) => {
    const { self } = await categoriesService.getCategoryInfoByCode(code);
    commit(types.SET_CATEGORY, self);
    return self;
  }),

  getTagInfo: setActionProccess('tagInfo', async ({ commit }, code) => {
    const { self } = await categoriesService.getCategoryInfoByCode(code);
    commit(types.TAG_INFO, self);
    return self;
  }),

  getList: setActionProccess('list', async ({ commit }) => {
    const list = [];
    ['tea', 'stuff', 'herbs', 'mate', 'coffee', 'other-stuff'].forEach((code) => {
      list.push(categoriesService.getCategoryInfoByCode(code));
    });
    const result = await Promise.all(list);
    const resultList = result.map(({ self }) => self);
    console.warn('on set list ', resultList);
    commit(types.SET_LIST, resultList);
    return resultList;
  }),

  // getCategoryInfo: setActionProccess('menu', async ({ commit }) => {
  //   const { self: tea } = await categoriesService.getCategoryInfoByCode('tea');
  //   const { self: stuff } = await categoriesService.getCategoryInfoByCode('stuff');
  //   const menu = { tea, stuff };
  //   commit(types.SET_MENU_CATEGORIES, menu);
  //   return menu;
  // }),

  setTag({ commit }, tag = null) {
    commit(types.SET_TAG, tag);
  },

  setTags({ commit }, tags = []) {
    commit(types.SET_TAGS, tags);
  },

  resetTags({ commit }) {
    commit(types.SET_TAGS, []);
  },

  unsetTagInfo({ commit }) {
    commit(types.TAG_INFO, null);
  },

  unsetCategory({ commit }) {
    commit(types.SET_CATEGORY, null);
  },
};
