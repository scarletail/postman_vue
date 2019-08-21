<template>
    <div>
        <a-row :gutter="3">
            <a-col :span="2">
                <a-select showSearch size="large"
                          optionFilterProp="methods"
                          v-model="request.method" style="width: 100%">
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
            <a-tabs :animated="true" :tabPosition="'top'">
                <a-tab-pane v-for="(cookie,index) in cookies" :tab="cookie.name" :key="index">
                    <a-row>
                        <a-col :span="20">
                            <!--對象和數組在v-for中以兩種不同的形式遍歷-->
                            <a-row v-for="(value,key,index) in cookie" :key="index">
                                <a-col :span="6"><span class="cookie"><strong>{{key}}</strong></span></a-col>
                                <a-col :span="18"><span class="cookie">{{value}}</span></a-col>
                            </a-row>
                        </a-col>
                        <a-col :span="4">
                            <a-button icon="delete" type="danger" @click="delCookie(index)"></a-button>
                        </a-col>
                    </a-row>
                </a-tab-pane>
            </a-tabs>
        </a-drawer>

        <div v-if="displayResponse">
            <hr/>
            <h4>Response</h4>
            <a-tabs>
                <a-tab-pane tab="Body" key="Body">
                    <InCoder :value="response.body"></InCoder>

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
    import InCoder from "./InCoder";

    export default {
        name: "RequestPanel",
        components: {InCoder, TestResults, ScriptPanel, RequestBodyPanel, DataTable},
        props: ['rec'],
        methods: {
            onSend: function () {
                let requestJson = JSON.stringify(this.request);
                this.$axios.post('/request', requestJson, {
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                }).then(res => {
                    this.$message.success('request success!');
                    this.displayResponse = true;
                    this.response = res.data;
                    this.$store.dispatch('load_record');
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
                }).catch(err => {
                    this.$message.error('cannot request cookies, see console');
                    // eslint-disable-next-line no-console
                    console.log(err);
                });
                this.visible = true;
            },
            onClose: function () {
                this.visible = false;
            },
            delCookie: function (index) {
                let cookie = this.cookies[index];
                this.$axios.delete('/cookies/del', {
                    params: {
                        domain: cookie.domain,
                        name: cookie.name
                    }
                }).then(res => {
                    if (res.data.msg === 'success') {
                        this.$message.info('success');
                        this.cookies.splice(index, 1);
                    } else {
                        this.$message.error('fail');
                    }
                }).catch(err => {
                    this.$message.info('an error occurred while delete cookie see console');
                    // eslint-disable-next-line no-console
                    console.log(err);
                });

            }
        },
        data: function () {
            return {
                msg: '',
                requestMethods: [
                    'GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS', 'PATCH', 'TRACE'
                ],
                method: 'GET',
                pre_script_tips: [
                    {title: '获取一个变量', script: 'tools.getParam("paramName");'},
                    {title: '设置一个变量', script: 'tools.setParam("paramName","value");'},
                    {title: '计算MD5', script: 'tools.MD5("arg");'},
                    {title: '计算SHA1', script: 'tools.SHA1("arg");'},
                    {title: '计算SHA256', script: 'tools.SHA256("arg");'},
                    {title: '获取时间戳', script: 'tools.getTimeStamp();'},
                ],
                tests_tips: [
                    {title: '执行测试', script: 'tools.tests(expression);'},
                    {title: '获取状态码', script: 'tools.getCode();'},
                    {title: '获取状态消息', script: 'tools.getMsg();'},
                    {title: '判断响应体是否包含字符串', script: 'tools.bodyContains("str");'},
                    {title: '判断是否存在响应头', script: 'tools.hasHeader("headerName");'},
                    {title: '获取响应头', script: 'tools.getHeader("headerName");'},
                ],
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

    .cookie {
        font-size: 16px;
        margin: 2px 2px 2px 2px;
    }
</style>
