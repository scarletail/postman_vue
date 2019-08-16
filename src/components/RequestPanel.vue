<template>
    <div>

        <a-row>
            <a-col :span="2">
                <a-select showSearch size="large"
                          optionFilterProp="methods"
                          style="width: 120px" v-model="request.method">
                    <a-select-option v-for="method in requestMethods" :key="method">{{method}}
                    </a-select-option>
                </a-select>
            </a-col>
            <a-col :span="22">
                <a-input-search placeholder="input url" @search="onSend" enterButton="SEND" v-model="request.url"
                                size="large"></a-input-search>
            </a-col>
        </a-row>

        <br/>

        <a-tabs>
            <a-tab-pane tab="Params" key="1">
                <data-table :title="'Params'" :editable="true"
                            :data-source="request.params" @dataChanged="updateParams"></data-table>
            </a-tab-pane>
            <a-tab-pane tab="Headers" key="2">
                <data-table :title="'Headers'" :editable="true"
                            :data-source="request.headers" @dataChanged="updateHeaders"></data-table>
            </a-tab-pane>
            <a-tab-pane tab="Body" key="3">
                <request-body-panel :body="request.body" @changed="updateBody"></request-body-panel>
            </a-tab-pane>
            <a-tab-pane tab="Pre-request Script" key="4">
                <script-panel :text="request.pre_request_script" :tips="pre_script_tips"
                              @changed="updatePreScript"></script-panel>
            </a-tab-pane>
            <a-tab-pane tab="Tests" key="5">
                <script-panel :text="request.tests" :tips="tests_tips"
                              @changed="updateTests"></script-panel>
            </a-tab-pane>
            <div slot="tabBarExtraContent">
                <div style="display: inline;">
                    <a-switch defaultUnChecked v-model="request.save_response"/>
                    <strong>&nbsp;&nbsp;SAVE RESPONSE&nbsp;&nbsp;&nbsp;&nbsp;</strong>
                </div>
                <a-button type="primary" @click="showDrawer">Cookies</a-button>
            </div>


        </a-tabs>

        <a-drawer title="Cookie Store"
                  placement="bottom" :closable="true"
                  @close="onClose" :visible="visible" :height="400" :destroyOnClose="true">
            <a-tabs defaultActiveKey="0" :animated="true" :tabPosition="'top'">
                <!--                <a-tab-pane tab="Tab 1" key="1">Content of Tab Pane 1</a-tab-pane>-->
                <!--                <a-tab-pane tab="Tab 2" key="2" forceRender>Content of Tab Pane 2</a-tab-pane>-->
                <!--                <a-tab-pane tab="Tab 3" key="3">Content of Tab Pane 3</a-tab-pane>-->

                <a-tab-pane v-for="(cookie,index) in cookies" :tab="cookie.name" :key="index">HELLO</a-tab-pane>
            </a-tabs>
        </a-drawer>

        <div v-if="displayResponse">
            <hr/>
            <h4>Response</h4>
            <a-tabs>
                <a-tab-pane tab="Body" key="Body">
                    <a-textarea :autosize="{ minRows: 10}" :value="response.body"></a-textarea>
                </a-tab-pane>
                <a-tab-pane tab="Headers" key="Headers">
                    <data-table :title="'Headers'" :editable="false" :data-source="response.headers"></data-table>
                </a-tab-pane>
                <a-tab-pane tab="Test Results" key="Test Results">
                    <test-results :result="response.testsResult"></test-results>
                </a-tab-pane>
                <div style="float: right" slot="tabBarExtraContent">
                    <div><strong>Status:&nbsp;&nbsp;</strong> <span style="color: #2fb784;">
                        {{response.code +' '+response.status}}
                    </span>&nbsp;&nbsp;&nbsp;
                        <strong>Time:&nbsp;&nbsp;</strong> <span style="color: #2fb784;">{{response.time}}</span>
                    </div>
                </div>
            </a-tabs>


        </div>
    </div>
</template>

<script>
    import DataTable from "./DataTable";
    import RequestBodyPanel from "./RequestBodyPanel";
    import ScriptPanel from "./ScriptPanel";
    import TestResults from "./testResults";

    export default {
        name: "RequestPanel",
        components: {TestResults, ScriptPanel, RequestBodyPanel, DataTable},
        props: ['rec'],
        methods: {
            onSend: function () {
                let requestJson = JSON.stringify(this.request);
                // eslint-disable-next-line no-console
                console.log(requestJson);
                this.$axios.post('/request', requestJson, {
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                }).then(res => {
                    this.$message.success('request success!');
                    this.displayResponse = true;
                    this.response = res.data;
                }).catch(err => {
                    this.$message.error('request failed, see console for detail');
                    // eslint-disable-next-line no-console
                    console.log(err);
                });
            },
            updateHeaders: function (data) {
                this.request.headers = data;
            },
            updateParams: function (data) {
                this.request.params = data;
            },
            updatePreScript: function (value) {
                this.request.pre_request_script = value;
            },
            updateTests: function (value) {
                this.request.tests = value;
            },
            updateBody: function (body) {
                this.request.body = body;
            },
            showDrawer: function () {
                this.$axios.get('/cookies').then(res => {
                    this.cookies = res.data;
                    // eslint-disable-next-line no-console
                    console.log(this.cookies);
                }).catch(err => {
                    this.$message.error('cannot request cookies, see console');
                    // eslint-disable-next-line no-console
                    console.log(err);
                });
                this.visible = true;
            },
            onClose: function () {
                this.visible = false;
            }
        },
        data: function () {
            return {
                msg: '',
                requestMethods: [
                    'GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS', 'PATCH', 'TRACE'
                ],
                method: 'GET',
                pre_script_tips: ['pre_script_tips1', 'pre_script_tips2', 'pre_script_tips3'],
                tests_tips: ['tests_tips1', 'tests_tips2', 'tests_tips3'],
                displayResponse: false,
                request_body: {
                    type: 'none',
                    content: ''
                },
                request: {
                    headers: {},
                    tests: '',
                    method: 'GET',
                    save_response: false,
                    body: {
                        type: 'none',
                        content: ''
                    },
                    params: {},
                    pre_request_script: '',
                    url: '',
                },
                response: {
                    headers: {},
                    code: '',
                    time: '',
                    body: '',
                    testsResult: {},
                    status: '',
                },

                visible: false,
                cookies: [],
            };
        },

        created() {
            if (this.rec != null) {
                this.request = this.rec.request;
                if (this.rec.response != null) {
                    this.displayResponse = true;
                    this.response = this.rec.response;
                }
            }
        }
    }
</script>

<style scoped>

</style>
