<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>资产配置记录</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-form :inline="true" :model="searchData.assetSelect" class="demo-form-inline">
                    <el-form-item label="投资人名称">
                        <el-input v-model="searchData.assetSelect.investmentname" placeholder="投资人名称"></el-input>
                    </el-form-item>
                    <el-form-item label="投资资产">
                        <el-select v-model="searchData.assetSelect.country" placeholder="投资资产">
                            <el-option label="越南资产" value="001"></el-option>
                            <el-option label="印尼资产" value="002"></el-option>
                            <el-option label="俄罗斯资产" value="003"></el-option>
                            <el-option label="菲律宾资产" value="004"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="投资日期">
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
                    <el-form-item label="匹配状态">
                        <el-select v-model="searchData.assetSelect.region" placeholder="匹配状态">
                            <el-option label="待匹配" value="w"></el-option>
                            <el-option label="匹配中" value="d"></el-option>
                            <el-option label="已完成" value="s"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="search">查询</el-button>
                    </el-form-item>
                </el-form>

                <el-row>
                    <el-button type="primary" @click="editVisible = true">新增配置资产</el-button>
                </el-row>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="serialno" label="操作流水ID" sortable width="150"></el-table-column>
                <el-table-column prop="investmentname" label="投资人名称" width="120"></el-table-column>
                <el-table-column prop="country" label="资产类别" :formatter="formatter"></el-table-column>
                <el-table-column prop="investedamount" label="投资金额（$）" :formatter="formatter"></el-table-column>
                <el-table-column prop="annualizedinterestrate" label="投资利率" :formatter="formatter"></el-table-column>
                <el-table-column prop="exchangerate" label="换算汇率" :formatter="formatter"></el-table-column>
                <el-table-column prop="exchangeamount" label="投换算金额(万)" :formatter="formatter"></el-table-column>
                <el-table-column prop="expectation" label="预期收益（$）" :formatter="formatter"></el-table-column>
                <el-table-column prop="address" label="投资日期" :formatter="formatter"></el-table-column>
                <el-table-column prop="matchingnum" label="已配置标的数(个)" :formatter="formatter"></el-table-column>
                <el-table-column prop="matchingstatus" label="匹配状态" :formatter="formatter"></el-table-column>
                <el-table-column prop="operatorname" label="操作人" :formatter="formatter"></el-table-column>
                <el-table-column prop="address" label="操作人时间" :formatter="formatter"></el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :total="100"></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="充值" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="投资人名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="提现金额">
                    <el-input v-model="form.num"></el-input>
                </el-form-item>
                <el-form-item label="币种">
                    <el-select v-model="form.type" placeholder="币种">
                        <el-option label="人民币" value="人民币"></el-option>
                        <el-option label="美元" value="美元"></el-option>
                        <el-option label="印尼盾" value="印尼盾"></el-option>
                        <el-option label="越南盾" value="越南盾"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" v-model="form.text"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import ajax from '../../utils/fetch'

    export default {
        name: 'basetable',
        data() {
            return {
                url: './static/vuetable.json',
                editVisible: '',

                searchData: {
                    assetSelect: {
                        investmentname: '',
                        country: '',
                        matchingstatus: '',
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
                page: {
                    pageindex: 1,
                    pagesize: 20
                },
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                del_list: [],
                form: {
                    name: '',
                    date: '',
                    address: ''
                },
            }
        },
        created() {
            this.getData();
        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                // this.getData();
                this.search()
            },
            // 获取 easy-mock 的模拟数据
            getData() {
                // 开发环境使用 easy-mock 数据，正式环境使用 json 文件
                if (process.env.NODE_ENV === 'development') {
                    this.url = '/ms/table/list';
                };
                this.$axios.post(this.url, {
                    page: this.cur_page
                }).then((res) => {
                    this.tableData = res.data.list;
                })
            },
            search() {
                // if(this.searchData.assetSelect.investmentname === '') {
                //     return this.$message.error('投资方名称不能为空');
                // } else if(this.searchData.assetSelect.country === '') {
                //     return this.$message.error('投资资产不能为空');
                // } else if(this.searchData.assetSelect.region === '') {
                //     return this.$message.error('匹配状态不能为空');
                // } else if(this.searchData.time === '') {
                //     return this.$message.error('投资日期不能为空');
                // }

                let moment = require("moment");
                let data = {
                    pageindex: this.cur_page,
                    pagesize: 20,
                    investmentname: this.searchData.assetSelect.investmentname, // 投资方名称
                    country: this.searchData.assetSelect.country, // 国家（投资类型） 001：越南，002：印尼，003：菲律宾，004：俄罗斯
                    matchingstatus: this.searchData.assetSelect.region,// 匹配状态  d:匹配中，s：匹配完成，w：待匹配
                    startdate: this.searchData.time?moment(this.searchData.time[0]).valueOf(): '',
                    enddate: this.searchData.time?moment(this.searchData.time[1]).valueOf(): '',
                }
                console.log(data)
                    ajax.post('/admin/getassetsconfiglist', data)
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
            handleEdit(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                    name: item.name,
                    date: item.date,
                    address: item.address
                }
                // this.editVisible = true;
            },
            handleDelete(index, row) {
                this.idx = index;
                this.delVisible = true;
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 保存编辑
            saveEdit() {
                this.$set(this.tableData, this.idx, this.form);
                // this.editVisible = false;
                this.$message.success(`修改第 ${this.idx+1} 行成功`);
            },
            // 确定删除
            deleteRow(){
                this.tableData.splice(this.idx, 1);
                this.$message.success('删除成功');
                this.delVisible = false;
            }
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
