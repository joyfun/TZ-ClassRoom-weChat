import types from './types';

const clearStorage = commit => {
	commit(types.setAuthKey, { authKey: '' });
	commit(types.login, { data: { token: '', authToken: '' } });
	commit(types.setExpire, { expire: 0 });
};
export const action_clearStorage = ({ commit }) => {
	clearStorage(commit);
};
