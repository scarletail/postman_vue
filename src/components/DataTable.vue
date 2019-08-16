<template>
    <div>
        <a-table bordered :dataSource="localData" :columns="columns" :pagination="false">
            <template slot="title">
                <h3 v-text="title" style="display: inline"></h3>
                <a-button icon="plus" type="primary" @click="handleAdd" v-if="editable"
                          style="float: right"></a-button>
            </template>
            <template slot="key" slot-scope="text, record">
                <editable-cell v-if="editable" :text="text" @change="onCellChange(record.key, 'key', $event)"/>
                <div v-else>{{text}}</div>
            </template>
            <template slot="value" slot-scope="text, record">
                <editable-cell v-if="editable" :text="text" @change="onCellChange(record.key, 'value', $event)"/>
                <div v-else>{{text}}</div>
            </template>
            <template slot="operation" slot-scope="text, record" v-if="editable">
                <a-popconfirm
                        v-if="localData.length"
                        title="Sure to delete?"
                        @confirm="() => onDelete(record.key)">
                    <a href="javascript:">Delete</a>
                </a-popconfirm>
            </template>
        </a-table>
    </div>
</template>
<script>
    import EditableCell from './EditableCell'

    export default {
        props: ['title', 'dataSource', 'editable'],
        components: {
            EditableCell,
        },
        data() {
            let data = this.object2Array(this.dataSource);
            return {
                count: 0,
                columns: [{
                    title: 'key',
                    dataIndex: 'key',
                    scopedSlots: {customRender: 'key'},
                }, {
                    title: 'value',
                    dataIndex: 'value',
                    scopedSlots: {customRender: 'value'},
                }, {
                    title: 'operation',
                    dataIndex: 'operation',
                    scopedSlots: {customRender: 'operation'},
                }],
                localData: data,
            }
        },
        methods: {
            onCellChange(key, dataIndex, value) {
                const localData = [...this.localData];
                const target = localData.find(item => item.key === key);
                if (target) {
                    target[dataIndex] = value;
                    this.localData = localData;
                }
            },
            onDelete(key) {
                const localData = [...this.localData];
                this.localData = localData.filter(item => item.key !== key);
                this.count--;
            },
            handleAdd() {
                const {count, localData} = this;
                this.count++;
                const newData = {
                    key: `${this.title.toLowerCase()}${count + 1}`,
                    value: `value${count + 1}`,
                };
                this.localData = [...localData, newData];
            },
            object2Array: function (obj) {
                let array = [];
                for (let attr in obj) {
                    array.push({
                        key: attr,
                        value: obj[attr]
                    });
                }
                return array;
            },
            array2Object: function (arr) {
                let obj = {};

                for (let index in arr) {
                    let item = arr[index];
                    obj[item.key] = item.value;
                }
                return obj;
            },
            isNull: function (obj) {
                for (let key in obj) {
                    return true;
                }
                return false;
            }
        },
        watch: {
            localData: function () {
                this.$emit('dataChanged', this.array2Object(this.localData));
            }
        },
        created() {
            if (this.localData == null) {
                this.localData = [];
            } else {
                // eslint-disable-next-line no-unused-vars
                for (let item in this.localData) {
                    this.count++;
                }
            }
            if (!this.editable) {
                this.columns.pop();
            }
        },

    }
</script>
<style scoped>
    .editable-cell {
        position: relative;
    }

    .editable-cell-input-wrapper,
    .editable-cell-text-wrapper {
        padding-right: 24px;
    }

    .editable-cell-text-wrapper {
        padding: 5px 24px 5px 5px;
    }

    .editable-cell-icon,
    .editable-cell-icon-check {
        position: absolute;
        right: 0;
        width: 20px;
        cursor: pointer;
    }

    .editable-cell-icon {
        line-height: 18px;
        display: none;
    }

    .editable-cell-icon-check {
        line-height: 28px;
    }

    .editable-cell:hover .editable-cell-icon {
        display: inline-block;
    }

    .editable-cell-icon:hover,
    .editable-cell-icon-check:hover {
        color: #108ee9;
    }

    .editable-add-btn {
        margin-bottom: 8px;
    }
</style>
