<template>
    <a-layout id="components-layout-demo-side" style="min-height: 100vh">
        <sidebar></sidebar>
        <a-layout :style="{ marginLeft: '300px' }">
            <layoutbody></layoutbody>
            <a-layout-footer :style="{ textAlign: 'center' }">
                <p><strong>Created by Scarletail</strong></p>
                <p><strong>Guided by LiuFei</strong></p>
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
            return {}
        },
        methods: {}
    }
</script>

<style>
    #components-layout-demo-side .logo {
        height: 32px;
        background: rgba(255, 255, 255, .2);
        margin: 16px;
    }

</style>
