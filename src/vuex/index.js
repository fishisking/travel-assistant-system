import Vue from 'vue'
import Vuex from 'vuex';
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    city:'杭州',
    user_id:null,
    user_name:null,
    permission:null,
    scene_id:'1001',
    selectedDate:'',
  },
  getters: {

  },
  mutations: {
    dropOut(state) {
      state.user_id = ''
      state.user_name = ''
      state.permission = ''
    },
    logOn(state,data){
      state.user_id = data.user_id
      state.user_name = data.user_name
      state.permission = data.permission
    }
  }
})
export default store;
