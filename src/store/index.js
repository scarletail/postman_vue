import Vue from 'vue'
import vuex from 'vuex'
import axios from 'axios'

Vue.use(vuex);

export default new vuex.Store({
    state: {
        tabs: {
            focus: '',
            contents: []
        },
        tabKey: 1,
        record: [],
        published: [],
    },
    mutations: {

        setRecord: function (state, {data}) {
            state.record = data;
        },

        setPublished: function (state, {data}) {
            state.published = data;
        },

        deleteRecord: function (state, record_id) {
            if (record_id == null) {
                state.record = [];
            } else {
                state.record = state.record.filter(o => o.record_id !== record_id);
            }
        },

        deletePublished: function (state, published_id) {
            if (published_id == null) {
                state.published = [];
            } else {
                state.published = state.published.filter(o => o.published_id !== published_id);
            }
        },

        addTab: function (state, tab) {
            let index = -1;
            if (tab.content !== null) {
                index = state.tabs.contents.findIndex(o => {
                    if (o.content === null) return false;
                    if (tab.type === 'record') {
                        return tab.content.record_id === o.content.record_id;
                    }
                    if (tab.type === 'published') {
                        return tab.content.published_id === o.content.published_id;
                    }
                });
            }
            if (index === -1) {
                tab.key = `${state.tabKey++}`;
                state.tabs.contents.push(tab);
                state.tabs.focus = tab.key;
            } else {
                state.tabs.focus = state.tabs.contents[index].key;
            }
        },

        delTab: function (state, tabKey) {
            let contents = state.tabs.contents;
            let index = contents.findIndex(o => o.key === tabKey);
            if (index === -1) return;
            contents.splice(index, 1);
            if (index >= contents.length - 1) --index;
            state.tabs.focus = index >= 0 ? contents[index].key : '';
        },

        delete_all: function (state) {
            state.tabs = {
                focus: '',
                contents: []
            };
        },

        update_published: function (state, payload) {
            let published_id = payload.published_id;
            for (let index in state.tabs.contents) {
                let tab = state.tabs.contents[index];
                if (tab.type === 'published' && tab.content.published_id === published_id) {
                    tab.title = payload.name + '...';
                    state.tabs.contents[index] = tab;
                    // eslint-disable-next-line no-console
                    console.log(state.tabs);
                    break;
                }
            }
        }

    },
    getters: {
        record: state => {
            return keywords => state.record.filter(o => o.name.includes(keywords)).reverse();
        },

        published: state => {
            return keywords => state.published.filter(o => o.name.includes(keywords)).reverse();
        },

        tabs: state => state.tabs,
    },
    actions: {
        load_record: function ({commit}) {
            axios.get('/records').then(res => {
                commit('setRecord', {data: res.data});
            }).catch(err => {
                this.$message.error('an error occurred while load records, see console');
                // eslint-disable-next-line no-console
                console.log(err);
            });
        },

        load_published: function ({commit}) {
            axios.get('/publish').then(res => {
                commit('setPublished', {data: res.data});
            }).catch(err => {
                this.$message.error('an error occurred while load published, see console');
                // eslint-disable-next-line no-console
                console.log(err);
            });
        },

        new_tab: function ({commit}) {
            commit('addTab', {
                title: 'New Request Tab',
                type: 'record',
                content: null,
            });
        },

        new_record: function ({commit}, record_id) {
            axios.get('/records/' + record_id).then(res => {
                let record = res.data;
                commit('addTab', {
                    title: (record.name).substring(0, 30) + '...',
                    type: 'record',
                    content: record,
                });
            }).catch(err => {
                // eslint-disable-next-line no-console
                console.log(err);
            });
        },

        new_published: function ({commit}, published_id) {
            axios.get('/publish/' + published_id).then(res => {
                let published = res.data;
                commit('addTab', {
                    title: (published.name).substring(0, 30) + '...',
                    type: 'published',
                    content: published,
                });
            }).catch(err => {
                // eslint-disable-next-line no-console
                console.log(err);
            });
        },

        remove_tab: function ({commit}, tabKey) {
            commit('delTab', tabKey);
        },

        clear_tabs: function ({commit}) {
            commit('delete_all');
        },

        delete_record: function ({commit}, record_id) {
            axios.delete('/records/' + record_id).then(res => {
                if (res.data.msg === 'success') {
                    commit('deleteRecord', record_id);
                } else
                // eslint-disable-next-line no-console
                    console.log('server error');
            }).catch(err => {
                // eslint-disable-next-line no-console
                console.log(err);
            });
        },

        delete_published: function ({commit}, published_id) {
            axios.delete('/publish/' + published_id).then(res => {
                if (res.data.msg === 'success') {
                    commit('deletePublished', published_id);
                } else
                // eslint-disable-next-line no-console
                    console.log('server error');
            }).catch(err => {
                // eslint-disable-next-line no-console
                console.log(err);
            });
        },

        clear_record: function ({commit}) {
            axios.delete('/records/all').then(res => {
                if (res.data.msg === 'success') {
                    commit('deleteRecord', null);
                } else
                // eslint-disable-next-line no-console
                    console.log('server error');
            }).catch(err => {
                // eslint-disable-next-line no-console
                console.log(err);
            });
        },

        clear_published: function ({commit}) {
            axios.delete('/publish/all').then(res => {
                if (res.data.msg === 'success') {
                    commit('deletePublished', null);
                } else
                // eslint-disable-next-line no-console
                    console.log('server error');
            }).catch(err => {
                // eslint-disable-next-line no-console
                console.log(err);
            });
        }

        //    Action 提交的是 mutation，而不是直接变更状态。
        //    Action 可以包含任意异步操作，action的产生就是因为mutation不能进行异步操作，
        //    如果有异步操作那么就用action来提交mutation
    },
});
