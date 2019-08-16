<template>
    <div>
        <h2>This is a publish panel</h2>
        <p>{{msg}}</p>
    </div>
</template>

<script>
    export default {
        name: "PublishPanel",
        data: function () {
            return {
                msg: ''
            };
        },
        props: ['params'],
        methods: {},
        created() {
            if (this.params == null) {
                this.msg = 'Publish is empty';
            } else {
                this.msg = 'published id is ' + this.params.published_id;
            }
        }
    }
</script>

<style scoped>

</style>
