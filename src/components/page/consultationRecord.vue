<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>客户咨询记录</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-form :inline="true" :model="searchData.assetSelect" class="demo-form-inline">
                    <el-form-item label="投资人名称">
                        <el-input v-model="searchData.assetSelect.user" placeholder="投资人名称"></el-input>
                    </el-form-item>
                    <el-form-item label="日期">
                        <el-date-picker
                            v-model="searchData.time"
                            type="datetimerange"
                            :picker-options="searchData.timeOption"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            align="right">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="处理状态">
                        <el-select v-model="searchData.assetSelect.region" placeholder="处理状态">
                            <el-option label="已处理" value="已处理"></el-option>
                            <el-option label="未处理" value="未处理"></el-option>
                            <el-option label="其他" value="其他"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="search">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="investmentname" label="投资人名称" sortable width="150"></el-table-column>
                <el-table-column prop="investmentamount" label="计划投资金额" width="120"></el-table-column>
                <el-table-column prop="contactperson" label="联系人名称" :formatter="formatter"></el-table-column>
                <el-table-column prop="investmentphone" label="联系电话" :formatter="formatter"></el-table-column>
                <el-table-column prop="investmentemail" label="联系邮箱" :formatter="formatter"></el-table-column>
                <el-table-column prop="status" label="处理状态" :formatter="formatter"></el-table-column>
                <el-table-column prop="optiontype" label="操作" :formatter="formatter"></el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :total="1000"></el-pagination>
            </div>
        </div>

    </div>
</template>

<script>
    import ajax from '../../utils/fetch'

    export default {
        name: 'consultationRecord',
        data() {
            return {
                url: './static/vuetable.json',
                searchData: {
                    assetSelect: {
                        user: '',
                        region: ''
                    },
                    time: '',
                    timeOption: {  // 时间选择器配置
                        shortcuts: [{
                            text: '最近一周',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                                picker.$emit('pick', [start, end]);
                            }
                        }, {
                            text: '最近一个月',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                                picker.$emit('pick', [start, end]);
                            }
                        }, {
                            text: '最近三个月',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                                picker.$emit('pick', [start, end]);
                            }
                        }]
                    }
                },
                tableData: [],
                page: {
                    cur_page: 1,
                    pageindex: '',
                    pagesize: 20,

                },
                multipleSelection: [],
                submitData: {
                    name: '',
                    start: '',
                    end: '',
                    status: ''
                },
            }
        },
        created() {
            this.getData();
        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.page.cur_page = val;
                this.getData();
            },
            // 获取 easy-mock 的模拟数据
            getData() {
                // 开发环境使用 easy-mock 数据，正式环境使用 json 文件
                if (process.env.NODE_ENV === 'development') {
                    this.url = '/ms/table/list';
                };
                this.$axios.post(this.url, {
                    page: this.page.cur_page
                }).then((res) => {
                    this.tableData = res.data.list;
                })
            },
            search() {
                // if(this.searchData.assetSelect.user === '') {
                //     return this.$message.error('投资方名称不能为空');
                // } else if(this.searchData.assetSelect.region === '') {
                //     return this.$message.error('处理状态不能为空');
                // } else if(this.searchData.time === '') {
                //     return this.$message.error('日期不能为空');
                // }

                let moment = require("moment");
                let data = {
                    pageindex: this.page.cur_page,
                    pagesize: this.page.pagesize,
                    investmentname: this.searchData.assetSelect.user, // 投资人/投资机构名
                    startdate: this.searchData.time?moment(this.searchData.time[0]).valueOf(): '',
                    enddate: this.searchData.time?moment(this.searchData.time[1]).valueOf(): '',
                    status:  this.searchData.assetSelect.region, // 处理状态
                }
                console.log(data)
                ajax.post('/interested/getlist', data)
                    .then(res => {
                        let {head, body} = res;
                        if (head && head.returncode === '0000') {
                            let data = body.data;
                        }
                        console.log(res)
                    })
                    .catch(e => {
                        console.log(e);
                    })
            },
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
        }
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
    .table{
        width: 100%;
        font-size: 14px;
    }
    .red{
        color: #ff0000;
    }
</style>
