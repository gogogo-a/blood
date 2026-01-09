import {createStore} from "vuex"
import createPersistedState from "vuex-persistedstate"

// 实例化一个vuex存储库
export default createStore({
    // 调用永久存储vuex数据的插件，localstorage里会多一个名叫vuex的Key，里面就是vuex的数据
    plugins: [createPersistedState()],
     state: {
    token: null,
    userData: null,
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
    },
    setUserData(state, userData) {
      state.userData = userData;
    },
  },
    getters: {

    },
})