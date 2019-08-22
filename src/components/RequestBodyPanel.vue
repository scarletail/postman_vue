<template>
    <div>
        <a-radio-group name="radioGroup" v-model="b_type">

            <a-radio v-for="type in bodyTypes" :key="type" :value="type">{{type}}</a-radio>

            <a-select style="width: auto" v-show="b_type==='raw'" size="small"
                      v-model="r_option" :dropdownMatchSelectWidth="false">
                <a-select-option v-for="option in rawOptions" :key="option.key">{{option.value}}</a-select-option>
            </a-select>

        </a-radio-group>
        <hr/>
        <div v-show="b_type==='none'">
            <p class="strong"><strong>This request does not have body</strong></p>
        </div>
        <div v-show="b_type==='form-data'">
            <data-table :title="b_type" :data-source="form_data"
                        @dataChanged="updateFormData" :editable="true"></data-table>
        </div>
        <div v-show="b_type==='x-www-urlencoded'">
            <data-table :title="b_type" :data-source="x_www_urlencoded"
                        @dataChanged="updateUrlEncodedData" :editable="true"></data-table>
        </div>
        <div v-if="b_type==='raw'">
            <InCoder :value="text" @input="updateText" :language="'javascript'"></InCoder>
        </div>
    </div>
</template>

<script>
    import DataTable from "./DataTable";
    import InCoder from "./InCoder";

    export default {
        name: "RequestBodyPanel",
        components: {InCoder, DataTable},
        props: ['body'],
        data: function () {
            let request_body = this.body;
            return {
                rawOptions: [
                    {key: 'text', value: 'Text'},
                    {key: 'text/plain', value: 'Text(text/plain)'},
                    {key: 'application/json', value: 'JSON(application/json)'},
                    {key: 'application/javascript', value: 'Javascript(application/javascript)'},
                    {key: 'application/xml', value: 'XML(application/xml)'},
                    {key: 'text/xml', value: 'XML(text/xml)'},
                    {key: 'text/html', value: 'HTML(text/html)'},
                ],
                bodyTypes: ['none', 'form-data', 'x-www-urlencoded', 'raw'],
                r_option: 'text',
                b_type: 'raw',
                form_data: [],
                x_www_urlencoded: [],
                r_body: request_body,
                text: ''

            };
        },
        created() {
            if (this.r_body.type === 'none') {
                this.b_type = 'none';
                return;
            }
            if (this.r_body.type === 'form-data') {
                this.b_type = this.r_body.type;
                this.form_data = this.r_body.content;
                return;
            }
            if (this.r_body.type === 'x-www-urlencoded') {
                this.b_type = this.r_body.type;
                this.x_www_urlencoded = this.r_body.content;
                return;
            }
            this.b_type = 'raw';
            let item = this.rawOptions.find(o => {
                return o.key === this.r_body.type;
            });
            this.r_option = item.value;
            this.text = this.r_body.content;
        },
        methods: {
            commitBody: function () {
                let body = {};
                if (this.b_type !== 'raw') {
                    body.type = this.b_type;
                    if (this.b_type === 'x-www-urlencoded') {
                        body.content = this.x_www_urlencoded;
                    } else if (this.b_type === 'form-data') {
                        body.content = this.form_data;
                    }
                } else {
                    let temp = this.rawOptions.find(o => {
                        return o.key === this.r_option;
                    });
                    body.type = temp.key;
                    body.content = this.text;
                }
                this.$emit('changed', body);
            },
            updateFormData(data) {
                this.form_data = data;
            },
            updateUrlEncodedData(data) {
                this.x_www_urlencoded = data;
            },
            updateText(text) {
                this.text = text;
            }
        },
        watch: {
            b_type: function () {
                this.commitBody();
            },
            r_option: function () {
                this.commitBody();
            },
            form_data: function () {
                this.commitBody();
            },
            x_www_urlencoded: function () {
                this.commitBody();
            },
            text: function () {
                this.commitBody();
            }
        }
    }
</script>

<style scoped>
    .strong {
        text-align: center;
        font-size: 18px;
        font-style: italic;
    }
</style>
