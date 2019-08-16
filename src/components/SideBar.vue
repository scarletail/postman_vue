<template>
    <a-layout-sider :width="300" :collapsible="collapsed" v-model="collapsed"
                    :style="{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }">
        <div class="logo">
            <a-input-search placeholder="input search text" @search="onSearch" v-model="keywords"></a-input-search>
        </div>
        <a-menu theme="dark" :defaultSelectedKeys="['1']" mode="inline">

            <a-sub-menu key="sub1">
                <span slot="title"><a-icon type="fund"/><span>Published</span></span>

                <a-menu-item v-for="publish in searchPublish()"
                             :key="publish.published_id"
                             @click="clickPublished(publish.published_id)">
                    <a-tooltip placement="right">
                        <template slot="title">
                            {{publish.description}}
                        </template>
                        <a-icon v-if="publish.available" type="check"/>
                        <a-icon v-else type="close"/>
                        <strong>{{publish.name}}</strong>
                    </a-tooltip>
                </a-menu-item>
            </a-sub-menu>

            <a-sub-menu key="sub2">
                <span slot="title"><a-icon type="file-sync"/><span>History</span></span>
                <a-menu-item v-for="record in searchRecord()"
                             :key="record.record_id"
                             @click="clickRecord(record.record_id)">
                    <a-tooltip placement="right">
                        <template slot="title">
                            Created at {{record.send_time}}
                        </template>
                        <strong>{{record.name}}</strong>
                    </a-tooltip>
                </a-menu-item>
            </a-sub-menu>

        </a-menu>

    </a-layout-sider>
</template>

<script>
    export default {
        name: "SideBar",
        data: function () {
            return {
                collapsed: false,
                records: {},
                publishes: {},
                keywords: ''
            };
        },
        methods: {

            loadHistory: function () {
                this.$axios.get('/records').then((res) => {
                    this.records = res.data.reverse();
                }).catch((err) => {
                    // eslint-disable-next-line no-console
                    console.log(err);
                })
            },

            loadPublished: function () {
                this.$axios.get('/publish').then((res) => {
                    this.publishes = res.data;
                }).catch((err) => {
                    // eslint-disable-next-line no-console
                    console.log(err);
                });
            },

            fresh: function () {
                this.loadPublished();
                this.loadHistory();
            },

            onSearch: function () {

            },

            searchPublish: function () {
                let publishList = [];
                for (let i = 0; i < this.publishes.length; ++i) {
                    if (this.publishes[i].name.includes(this.keywords)) publishList.push(this.publishes[i]);
                }
                return publishList;
            },
            searchRecord: function () {
                let recordList = [];
                for (let i = 0; i < this.records.length; ++i) {
                    if (this.records[i].name.includes(this.keywords)) recordList.push(this.records[i]);
                }
                return recordList;
            },

            clickRecord: function (index) {
                // this.$message.info('record_id is ' + index);
                this.$emit('clickRecord', index);
            },

            clickPublished: function (index) {
                // this.$message.info('published_id is ' + index);
                this.$emit('clickPublished', index);
            }

        },
        created() {
            this.fresh();
        }
    }
</script>

<style scoped>
    .logo {
        height: 48px;
        background: rgba(255, 255, 255, .2);
        margin: 16px;
    }
</style>
