import Vue from 'vue';
import * as types from './mutation-types-common';

export default {
  [types.SET_LOADING](state, loading) {
    if (typeof loading === 'object') {
      Object.keys(loading).forEach((key) => {
        Vue.set(state.loading, key, loading[key]);
      });
    } else {
      state.loading = loading;
    }
  },
};
