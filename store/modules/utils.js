import Vue from 'vue';

const SET_LOADING = 'SET_LOADING';
const SET_ERROR = 'SET_ERROR';

// export const localCache = (state) => { get(), set(), delete() };

export const setActionProccess = (stateKey, successHandler, errorHandler) => async (state, payload) => {
  const stateLoadin = {};
  const stateError = {};
  const keys = Array.isArray(stateKey) ? stateKey : [stateKey];

  keys.forEach((k) => {
    stateLoadin[k] = true;
    stateError[k] = null;
  });

  try {
    state.commit(SET_LOADING, stateLoadin);
    const result = await successHandler(state, payload, stateKey);
    return result;
  } catch (error) {
    console.error(stateKey, error);
    let e = error.response ? error.response : error;
    if (errorHandler) {
      e = errorHandler(e, state, payload);
    }
    keys.forEach((k) => {
      stateError[k] = e;
    });
    state.commit(SET_ERROR, stateError);
    throw e;
  } finally {
    keys.forEach((k) => {
      stateLoadin[k] = false;
    });
    state.commit(SET_LOADING, stateLoadin);
  }
};

export const updateStateObjField = (state, fieldKey, updates = {}) => {
  if (updates) {
    Object
      .keys(updates)
      .forEach((propKey) => {
        Vue.set(state[fieldKey], propKey, updates[propKey]);
      });
  }
};

export default {
  updateStateObjField,
  setActionProccess,
};
