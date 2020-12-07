// import createLogger from 'vuex/dist/logger';
import Vue from 'vue';
import Vuex from 'vuex';

import modules from './modules';

Vue.use(Vuex);

const strict = process.env.NODE_ENV !== 'production';

const plugins = [
];

if (strict) {
  // plugins.push(createLogger());
}
const hasKeys = (obj) => Boolean(Object.keys(obj).length);

const store = new Vuex.Store({
  modules,
  plugins,
  strict,

  state: {
    errors: {
      cart: {},
      checkout: {},
    },
  },

  actions: {
    resetErrors({ commit }, entity) {
      commit('setError', { entity, errors: {} });
    },

    setCartErrors({ commit, state }, errors) {
      commit('setError', {
        entity: 'cart',
        errors,
      });
      console.warn('@setCartErrors $cart/$state', errors, state.errors);
    },

    setCheckoutErrors({ commit }, errors) {
      commit('setError', {
        entity: 'checkout',
        errors,
      });
    },
  },

  mutations: {
    setError(state, { entity, errors }) {
      if (entity in state.errors) {
        Vue.set(state.errors, entity, errors);
      } else {
        console.error('значение не установлено ', entity);
      }
    },
  },

  getters: {
    cartNotExists(state) {
      if (state.errors.cart) {
        return state.errors.cart.token;
      }
      return false;
    },

    hasCartErrors(state) {
      return hasKeys(state.cart);
    },

    hasCheckoutErrors(state) {
      return hasKeys(state.checkout);
    },
  },
});

export default store;
