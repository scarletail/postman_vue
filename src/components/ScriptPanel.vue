<template>
    <a-row :gutter="20">
        <a-col :span="20">
            <InCoder :value="local" @input="updateLocal" ref="inCoder"></InCoder>
        </a-col>
        <a-col :span="4">
            <h3>SNIPPETS</h3>
            <a class="code" v-for="(tip,index) in tips" :key="index" @click.prevent="addText(index)">
                {{tip.title}}</a>
        </a-col>
    </a-row>
</template>

<script>

    import InCoder from "./InCoder";

    export default {
        name: "ScriptPanel",
        components: {InCoder},
        props: ['text', 'tips'],
        data: function () {

            return {
                local: this.text,
            }
        },
        methods: {
            updateLocal: function (msg) {
                this.local = msg;
            },
            addText: function (index) {
                this.$refs.inCoder.addScript(this.tips[index].script);
            }
        },
        watch: {
            local: function () {
                this.$emit('changed', this.local);
            }
        }
    }
</script>

<style scoped>
    .code {
        font-family: 'PT Mono', 'Microsoft Yahei Mono', 'Source Code Pro', 'Consolas', sans-serif;
        margin: 7px;
        display: block;
    }
</style>
