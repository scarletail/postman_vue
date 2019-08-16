<template>
    <a-layout-content :style="{ margin: '24px 16px 0', overflow: 'initial' }">
        <div class="card-container">
            <a-tabs type="editable-card" @edit="onEdit" v-model="activeKey" :animated="{inkBar:true, tabPane:true}"
                    :size="'large'">

                <a-tab-pane v-for="pane in panes" :tab="pane.title" :key="pane.key" :closable="true">
                    <PublishPanel v-if="pane.type==='publish'"></PublishPanel>
                    <RequestPanel v-else :rec="pane.record"></RequestPanel>
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
            return {
                panes: this.openedPane,
                activeKey: 0,
                key: 0
            };
        },
        methods: {
            onEdit(targetKey, action) {
                this[action](targetKey);
            },
            add() {
                const panes = this.panes;
                const activeKey = `newTab${this.key++}`;
                panes.push({
                    title: `New Request Tab${this.key}`,
                    type: 'record',
                    record: null,
                    key: activeKey,
                });
                this.panes = panes;
                this.activeKey = activeKey;
            },
            remove(targetKey) {
                let activeKey = this.activeKey;
                let lastIndex;
                this.panes.forEach((pane, i) => {
                    if (pane.key === targetKey) {
                        lastIndex = i - 1;
                    }
                });
                const panes = this.panes.filter(pane => pane.key !== targetKey);
                if (lastIndex >= 0 && activeKey === targetKey) {
                    activeKey = panes[lastIndex].key;
                }
                this.panes = panes;
                this.activeKey = activeKey;
            },
        },
        components: {
            // eslint-disable-next-line vue/no-unused-components
            RequestPanel,
            // eslint-disable-next-line vue/no-unused-components
            PublishPanel,
        },
        watch: {
            panes: function () {
                this.$emit('panesChanged', this.panes);
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
