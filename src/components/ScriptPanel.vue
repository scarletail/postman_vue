<template>
    <a-row :gutter="16">
        <a-col :span="20">
            <a-textarea placeholder="Input pre-request scripts" :autosize="{ minRows: 10}"
                        v-model="local"></a-textarea>
        </a-col>
        <a-col :span="4">
            <div v-for="(tip,index) in tips" :key="index" style="margin: 5px">{{tip}}</div>
        </a-col>
    </a-row>
</template>

<script>

    export default {
        name: "ScriptPanel",
        props: ['text', 'tips'],
        data: function () {
            return {
                local: this.text
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
    a-textarea {
        font-family: "PT Mono", "Microsoft YaHei Mono", "Consolas", monospace;
        font-size: 18px;
    }
</style>
