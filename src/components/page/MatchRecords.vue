<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>标的匹配记录</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-form :inline="true" :model="searchData.assetSelect" class="demo-form-inline">
                    <el-form-item label="投资人名称">
                        <el-input v-model="searchData.assetSelect.user" placeholder="投资人名称"></el-input>
                    </el-form-item>
                    <el-form-item label="投资资产">
                        <el-select v-model="searchData.assetSelect.region" placeholder="投资资产">
                            <el-option label="越南资产" value="001"></el-option>
                            <el-option label="印尼资产" value="002"></el-option>
                            <el-option label="俄罗斯资产" value="003"></el-option>
                            <el-option label="菲律宾资产" value="004"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="起投日期">
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
                    <el-form-item label="还款状态">
                        <el-select v-model="searchData.assetSelect.status" placeholder="还款状态">
                            <el-option label="已还款" value="d"></el-option>
                            <el-option label="待还款" value="s"></el-option>
                            <el-option label="已逾期" value="w"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="search">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column prop="serialno" label="匹配流水ID" sortable width="150"></el-table-column>
                <el-table-column prop="investmentname" label="投资人名称" width="120"></el-table-column>
                <el-table-column prop="orderid" label="借款订单号" :formatter="formatter"></el-table-column>
                <el-table-column prop="name" label="借款人" :formatter="formatter"></el-table-column>
                <el-table-column prop="address" label="借款人所在地" :formatter="formatter"></el-table-column>
                <el-table-column prop="sex" label="性别" :formatter="formatter"></el-table-column>
                <el-table-column prop="amount" label="借款金额（$）" :formatter="formatter"></el-table-column>
                <el-table-column prop="days" label="借款天数" :formatter="formatter"></el-table-column>
                <el-table-column prop="startdate" label="起投日期" :formatter="formatter"></el-table-column>
                <el-table-column prop="enddate" label="到期日期" :formatter="formatter"></el-table-column>
                <el-table-column prop="status" label="还款状态" :formatter="formatter"></el-table-column>
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
        name: 'MatchRecords',
        data() {
            return {
                url: './static/vuetable.json',
                searchData: {
                    assetSelect: {
                        user: '',
                        region: '',
                        status: '',
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
                multipleSelection: [],
                submitData: {
                    user: '',
                    region: '',
                    status: '',
                    start: '',
                    end: ''
                },
                page: {
                    pageindex: '',
                    pagesize: 20,
                },
            }
        },
        created() {
            this.getData();
        },
        methods: {
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 分页导航
            handleCurrentChange(val) {
                this.page.pageindex = val;
                this.getData();
            },
            // 获取 easy-mock 的模拟数据
            getData() {
                // 开发环境使用 easy-mock 数据，正式环境使用 json 文件
                if (process.env.NODE_ENV === 'development') {
                    this.url = '/ms/table/list';
                };
                this.$axios.post(this.url, {
                    page: this.page.pageindex
                }).then((res) => {
                    this.tableData = res.data.list;
                })
            },
            search() {
                // if(this.searchData.assetSelect.user === '') {
                //     return this.$message.error('投资方名称不能为空');
                // } else if(this.searchData.assetSelect.region === '') {
                //     return this.$message.error('投资资产不能为空');
                // } else if(this.searchData.assetSelect.status === '') {
                //     return this.$message.error('还款状态不能为空');
                // } else if(this.searchData.time === '') {
                //     return this.$message.error('投资日期不能为空');
                // }

                let moment = require('moment')
                let data = {
                    pageindex: this.page.pageindex,
                    pagesize: this.page.pagesize,
                    investmentname: this.searchData.assetSelect.user, // 投资方名称
                    country: this.searchData.assetSelect.region, // 国家（投资类型） 001：越南，002：印尼，003：菲律宾，004：俄罗斯
                    paybackstatus: this.searchData.assetSelect.status,// 还款状态 s:已还款,w:待还款，m:已逾期
                    startdate: this.searchData.time?moment(this.searchData.time[0]).valueOf(): '',
                    enddate: this.searchData.time?moment(this.searchData.time[1]).valueOf(): '',
                };
                console.log(data)
                ajax.post('/admin/getmatchinglist', data)
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
