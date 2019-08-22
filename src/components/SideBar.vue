<template>
    <div>
        <a-layout-sider :width="300" :collapsible="collapsed" v-model="collapsed"
                        :style="{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }">
            <div class="logo">
                <a-input-search placeholder="input search text" v-model="keywords" @search="fresh">
                    <a-button slot="enterButton" type="primary" icon="sync"></a-button>
                </a-input-search>
            </div>
            <a-menu theme="dark" :defaultSelectedKeys="['1']" mode="inline">

                <a-sub-menu key="sub1">
                    <span slot="title"><a-icon type="fund"/><span>Published</span></span>
                    <a-menu-item v-for="publish in publishes" :key="publish.published_id"
                                 @click="clickPublished(publish.published_id)">
                        <a-dropdown :trigger="['contextmenu']">
                            <a-tooltip placement="right">
                                <template slot="title">{{publish.description}}</template>
                                <a-icon v-if="publish.available" type="check"/>
                                <a-icon v-else type="close"/>
                                <strong>{{publish.name}}</strong>
                            </a-tooltip>
                            <a-menu slot="overlay">
                                <a-menu-item key="1" @click="deletePublished(publish.published_id)">Delete
                                </a-menu-item>
                                <a-menu-item key="2" @click="clearPublished">Clear</a-menu-item>
                            </a-menu>
                        </a-dropdown>
                    </a-menu-item>

                </a-sub-menu>

                <a-sub-menu key="sub2">
                    <span slot="title"><a-icon type="file-sync"/><span>History</span></span>
                    <a-menu-item v-for="record in records" :key="record.record_id"
                                 @click="clickRecord(record.record_id)">

                        <a-dropdown :trigger="['contextmenu']" :overlayStyle="{width:'70px'}">
                            <a-tooltip placement="right">
                                <template slot="title"> Created at {{record.send_time}}</template>
                                <strong>{{record.name}}</strong>
                            </a-tooltip>
                            <a-menu slot="overlay">
                                <a-menu-item key="1" @click="showDrawer(record)">Publish</a-menu-item>
                                <a-menu-item key="2" @click="deleteRecord(record.record_id)">Delete
                                </a-menu-item>
                                <a-menu-item key="3" @click="clearRecord">Clear</a-menu-item>
                            </a-menu>
                        </a-dropdown>

                    </a-menu-item>
                </a-sub-menu>

            </a-menu>
        </a-layout-sider>

        <a-drawer :title="title" placement="top" :closable="true" @close="onClose" :visible="visible">
            <div style="text-align: center">
                <a-input v-model="name" :size="'large'" class="scaled" placeholder="please input API name">
                    <div class="title" slot="addonBefore"><strong>NAME</strong></div>
                </a-input>

                <div style="height: 10px"></div>
                <a-input v-model="description" :size="'large'" class="scaled" placeholder="please input description">
                    <div class="title" slot="addonBefore"><strong>DESCRIPTION</strong></div>
                </a-input>

                <div style="height: 10px"></div>
                <a-button-group style="display: inline-block">
                    <a-button type="primary" icon="check" @click="publishNew">Confirm</a-button>
                    <a-button type="danger" icon="close" @click="onClose">Cancel</a-button>
                </a-button-group>
            </div>
        </a-drawer>
    </div>
</template>

<script>
    export default {
        name: "SideBar",
        data: function () {
            return {
                title: 'Publish new API',
                collapsed: false,
                keywords: '',
                contextMenuVisible: false,
                visible: false,
                name: '',
                description: '',
                toBePublished: ''
            };
        },
        methods: {
            showDrawer(record) {
                this.title = `Publish 「${record.name}」 send at 「${record.send_time}」`;
                this.toBePublished = record.record_id;
                this.visible = true;
            },

            onClose() {
                this.visible = false
            },

            fresh: function () {
                this.$store.dispatch('load_record');
                this.$store.dispatch('load_published');
            },

            clickRecord: function (index) {
                // this.$message.info('record_id is ' + index);
                // this.$emit('clickRecord', index);
                this.$store.dispatch('new_record', index);
            },

            clickPublished: function (index) {
                // this.$message.info('published_id is ' + index);
                // this.$emit('clickPublished', index);
                this.$store.dispatch('new_published', index);
            },

            deleteRecord: function (record_id) {
                this.$store.dispatch('delete_record', record_id);
            },

            clearRecord: function () {
                this.$store.dispatch('clear_record');
            },

            deletePublished: function (published_id) {
                this.$store.dispatch('delete_published', published_id);
            },

            clearPublished: function () {
                this.$store.dispatch('clear_published');
            },

            publishNew: function () {
                this.onClose();
                this.$axios.get('/publish/add', {
                    params: {
                        record_id: this.toBePublished,
                        name: this.name,
                        description: this.description
                    }
                }).then(res => {
                    if (res.data.msg === 'success') {
                        this.$message.success('publish success');
                        this.$store.dispatch('load_published');
                        this.name = '';
                        this.description = '';
                    } else {
                        this.$message.error('publish falied');
                    }
                }).catch(err => {
                    // eslint-disable-next-line no-console
                    console.log(err);
                });
            }
        },
        created() {
            this.fresh();
        },
        computed: {
            records: function () {
                return this.$store.getters.record(this.keywords);
            },
            publishes: function () {
                return this.$store.getters.published(this.keywords);
            }
        }
    }
</script>

<style scoped>
    .logo {
        height: 48px;
        background: rgba(255, 255, 255, .2);
        margin: 16px;
    }

    .title {
        text-align: center;
        width: 100px;
    }

    .scaled {
        width: 80%;
    }

    .syncButton {
        position: absolute;
        bottom: 30px;
        right: 30px;
    }

    /* 滚动条宽度 */
    ::-webkit-scrollbar {
        /* 垂直滚动条宽度 */
        width: 8px;
        /* 水平滚动条高度 */
        height: 8px;
    }

    /* 滑动滑块 */
    ::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, .3);
        border-radius: 6px;
    }

    /* 滚动条轨道 */
    ::-webkit-scrollbar-track {
        background-color: #ddd;
    }

</style>
