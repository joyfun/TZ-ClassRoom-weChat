import Vue from 'vue';
import Vuex from 'vuex';
import * as actions from './actions';
import getters from './getters';
import auth from './modules/auth';
import nim from './modules/nim';
import room from './modules/chatroom';
import platform from './modules/platform';

Vue.use(Vuex);

const store = new Vuex.Store({
	modules: {
		auth,
		nim,
		room,
		platform,
	},
	actions,
	getters,
});

export default store;
