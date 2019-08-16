<template>
    <textarea ref="mycode" class="codeStyle" v-model="code"></textarea>
</template>

<script>
    import "codemirror/theme/ambiance.css";
    import "codemirror/theme/xq-light.css"
    import "codemirror/lib/codemirror.css";
    import "codemirror/addon/hint/show-hint.css";

    let CodeMirror = require("codemirror/lib/codemirror");
    require("codemirror/addon/edit/matchbrackets");
    require("codemirror/addon/selection/active-line");
    require("codemirror/mode/sql/sql");
    require("codemirror/addon/hint/show-hint");
    require("codemirror/addon/hint/sql-hint");
    export default {
        props: ['code'],
        name: "codeMirror",
        data() {
            return {}
        },
        mounted() {
            let mime = 'text/x-java';
            let theme = 'xq-light';//设置主题，不设置的会使用默认主题
            // eslint-disable-next-line no-unused-vars
            let editor = CodeMirror.fromTextArea(this.$refs.mycode, {
                mode: mime,//选择对应代码编辑器的语言，我这边选的是数据库，根据个人情况自行设置即可
                indentWithTabs: true,
                smartIndent: true,
                lineNumbers: true,
                matchBrackets: true,
                theme: theme,
                autofocus: true,
            });
        },
        watch: {
            code: function () {
                this.$emit('codeChanged', this.code);
            }
        }
    }
</script>

<style>
    .codeStyle {
        font-size: 14pt;
        font-family: "Microsoft YaHei Mono", "PT Mono", "Consolas", monospace
    }
</style>
