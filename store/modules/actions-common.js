import * as types from './mutation-types-common';

export default {
  setLoading({ commit }, loading) {
    commit(types.SET_LOADING, loading);
  },
};
