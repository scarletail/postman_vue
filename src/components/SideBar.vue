<template>
    <a-layout-sider :width="300" :collapsible="collapsed" v-model="collapsed"
                    :style="{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }">
        <div class="logo">
            <a-input-search placeholder="input search text" @search="onSearch" v-model="keywords"></a-input-search>
        </div>
        <a-menu theme="dark" :defaultSelectedKeys="['1']" mode="inline">

            <a-sub-menu key="sub1">
                <span slot="title"><a-icon type="fund"/><span>Published</span></span>

                <a-menu-item v-for="publish in publishes"
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
                <a-menu-item v-for="record in records"
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
                keywords: ''
            };
        },
        methods: {
            fresh: function () {
                this.$store.dispatch('load_record');
                this.$store.dispatch('load_published');
            },

            onSearch: function () {

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
</style>
