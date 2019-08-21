<template>
    <a-layout-content :style="{ margin: '24px 16px 0', overflow: 'initial' }">
        <div class="card-container">
            <a-tabs type="editable-card" @edit="onEdit" v-model="tabs.focus" :animated="{inkBar:true, tabPane:true}"
                    :hide-add="true" :size="'large'">

                <div slot="tabBarExtraContent">
                    <a-button-group>
                        <a-button icon="plus" type="primary" @click="add">Add</a-button>
                        <a-button icon="close" type="danger" @click="clear">Clear</a-button>
                    </a-button-group>
                </div>
                <a-tab-pane v-for="pane in tabs.contents" :tab="pane.title" :key="pane.key" :closable="true">
                    <PublishPanel v-if="pane.type==='published'" :rec="pane.content"></PublishPanel>
                    <RequestPanel v-else :rec="pane.content"></RequestPanel>
                </a-tab-pane>
            </a-tabs>
        </div>
    </a-layout-content>
</template>

<script>

    import PublishPanel from "./PublishPanel";
    import RequestPanel from "./RequestPanel";

    export default {
        name: "LayoutBody",
        props: ['openedPane'],
        data() {
            return {};
        },
        methods: {
            onEdit(targetKey, action) {
                this[action](targetKey);
            },
            add() {
                this.$store.dispatch('new_tab');
            },
            remove(targetKey) {
                this.$store.dispatch('remove_tab', targetKey);
            },

            clear() {
                this.$store.dispatch('clear_tabs');
            }
        },
        components: {
            RequestPanel,
            PublishPanel,
        },
        watch: {},
        computed: {
            tabs: function () {
                return this.$store.getters.tabs;
            }
        }
    }
</script>

<style scoped>
    .card-container {
        background: #F5F5F5;
        overflow: hidden;
        padding: 24px;
    }

    .card-container > .ant-tabs-card > .ant-tabs-content {
        height: 120px;
        margin-top: -16px;
    }

    .card-container > .ant-tabs-card > .ant-tabs-content > .ant-tabs-tabpane {
        background: #fff;
        padding: 16px;
    }

    .card-container > .ant-tabs-card > .ant-tabs-bar {
        border-color: #fff;
    }

    .card-container > .ant-tabs-card > .ant-tabs-bar .ant-tabs-tab {
        border-color: transparent;
        background: transparent;
    }

    .card-container > .ant-tabs-card > .ant-tabs-bar .ant-tabs-tab-active {
        border-color: #fff;
        background: #fff;
    }
</style>
