<template>
    <a-layout id="components-layout-demo-side" style="min-height: 100vh">
        <sidebar @clickRecord="openRecord"
                 @clickPublished="openPublished"
        ></sidebar>

        <a-layout :style="{ marginLeft: '300px' }">
            <layoutbody :opened-pane="opened" @panesChanged="panesChanged"></layoutbody>
            <a-layout-footer :style="{ textAlign: 'center' }">
                Ant Design ©2018 Created by Ant UED
            </a-layout-footer>
        </a-layout>
    </a-layout>

</template>
<script>
    import sidebar from './SideBar';
    import layoutbody from './LayoutBody';

    export default {
        components: {
            sidebar,
            layoutbody
        },
        data() {
            let currentWindow = [];
            return {
                collapsed: false,
                collapsible: true,
                opened: currentWindow,
                key: 0
            }
        },
        methods: {
            openRecord: function (index) {
                this.$axios.get('/records/' + index).then(res => {
                    let record = res.data;
                    this.opened.push({
                        title: (record.name).substring(0, 30) + '...',
                        type: 'record',
                        record: record,
                        key: 'record' + this.key++
                    });
                }).catch(err => {
                    // eslint-disable-next-line no-console
                    console.log(err);
                })
            },
            openPublished: function (index) {
                this.$message.info('published\'s id is ' + index);
            },
            panesChanged: function (panes) {
                this.opened = panes;
            }
        }
    }
</script>

<style>
    #components-layout-demo-side .logo {
        height: 32px;
        background: rgba(255, 255, 255, .2);
        margin: 16px;
    }

</style>
