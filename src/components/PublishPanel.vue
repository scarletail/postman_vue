<template>
    <div>
        <a-back-top/>
        <div>
            <a-input v-model="pub.name" :size="'large'">
                <div class="title" slot="addonBefore"><strong>NAME</strong></div>
            </a-input>

            <div style="height: 5px"></div>
            <a-input v-model="pub.description" :size="'large'">
                <div class="title" slot="addonBefore"><strong>DESCRIPTION</strong></div>
            </a-input>

            <div style="height: 5px"></div>
            <div id="msg">
                <strong>Last Check Time:</strong>&nbsp;
                <span style="font-style: italic">{{pub.lastCheckTime||'The API has not been tested yet'}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <strong>Is Available Now:</strong>&nbsp;
                <span style="font-style: italic">{{pub.available||'The API has not been tested yet'}}</span>

                <a-button-group style="float: right">
                    <a-button icon="bars" @click="showHistory=!showHistory">HISTORY</a-button>
                    <a-button icon="sync" @click="reName">UPDATE</a-button>
                </a-button-group>

            </div>

            <div style="height: 10px"></div>
            <request-panel :rec="{request:pub.request}"></request-panel>
            <transition name="fade">
                <div v-show="showHistory">
                    <div style="height: 10px"></div>
                    <hr>
                    <h2 style="text-align: center">Test History</h2>
                    <p v-if="tests===[]" style="text-align: center">There is no test history</p>
                    <a-timeline mode="alternate">
                        <a-timeline-item v-for="(test,index) in tests" :key="index"
                                         :color="test.available?'blue':'red'">
                            <h3>Test at {{test.test_time}}</h3>
                            <p v-for="(bool,index) in test.result" :key="index">
                                <strong>{{`${index+1}. ${bool?'pass':'fail'}`}}</strong>
                            </p>
                        </a-timeline-item>
                    </a-timeline>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
    import RequestPanel from "./RequestPanel";

    export default {
        name: "PublishPanel",
        components: {RequestPanel},
        data: function () {
            return {
                msg: '',
                pub: this.rec,
                tests: [],
                showHistory: false
            };
        },
        props: ['rec'],
        methods: {
            // eslint-disable-next-line no-unused-vars
            loadTestHistory: function (published_id) {
                this.$axios.get(`/publish/tests/${published_id}`).then(res => {
                    this.tests = res.data;
                }).catch(err => {
                    this.$message.error('an error occurred while load test history, see console');
                    // eslint-disable-next-line no-console
                    console.log(err);
                });
            },

            reName: function () {
                let published_id = this.pub.published_id;
                this.$axios.get('/publish/rename', {
                    params: {
                        published_id: published_id,
                        name: this.pub.name,
                        description: this.pub.description,
                    }
                }).then(res => {
                    if (res.data.msg === 'success') {
                        this.$message.success('success to sync');
                        this.$store.dispatch('load_published');
                        this.$store.commit('update_published', {
                            published_id: published_id,
                            name: this.pub.name,
                        });
                    } else {
                        this.$message.warn('fail to sync');
                    }
                }).catch(err => {
                    this.$message.error('an error occurred while load test history, see console');
                    // eslint-disable-next-line no-console
                    console.log(err);
                });
            }
        },
        created() {
            if (this.pub == null) {
                this.msg = 'Publish is empty';
            } else {
                this.msg = 'published title is ' + this.pub.name;
            }
            this.loadTestHistory(this.pub.published_id);
            // eslint-disable-next-line
        }
    }
</script>

<style scoped>
    .title {
        text-align: center;
        width: 100px;
    }

    #msg {
        font-size: 16px;
        margin: 5px;
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }

    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
    {
        opacity: 0;
    }
</style>
