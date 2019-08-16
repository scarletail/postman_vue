<template>
    <div>
        <a-steps :current="currentStep" status="error" :direction="'horizontal'">
            <!--            <a-step title="Passed"></a-step>-->
            <!--            <a-step title="Failed"></a-step>-->
            <!--            <a-step title="Waiting"></a-step>-->
            <!--            <a-step title="Waiting"></a-step>-->
            <a-step v-for="(item,index) in infoArr" :key="index" :title="item"></a-step>
        </a-steps>
        <h2 v-if="result===null||result.length===0" style="text-align: center">There are no test results</h2>
    </div>
</template>

<script>

    export default {
        props: ['result'],
        name: "testResults",
        data: function () {
            return {
                infoArr: [],
                currentStep: 0,
                pass: false,
            };
        },
        methods: {
            show: function () {
                this.pass = false;
                this.infoArr = [];
                if (this.result != null && this.result !== []) {
                    for (let i = 0; i < this.result.length; ++i) {
                        if (this.result[i]) {
                            this.infoArr.push('Passed');
                        } else {
                            if (!this.pass) {
                                this.pass = true;
                                this.currentStep = i;
                            }
                            this.infoArr.push('Failed');
                        }
                    }
                    if (!this.pass) {
                        this.currentStep = this.infoArr.length;
                    }
                }
            },
        },
        watch: {
            result: function () {
                this.show();
            }
        },
        created() {
            this.show();
        },
    }
</script>

<style scoped>

</style>
