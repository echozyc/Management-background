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
            <el-table :data="tableData" border class="table" ref="multipleTable" >
                <el-table-column prop="serialno" label="操作流水ID" width="150"></el-table-column>
                <el-table-column prop="investmentname" label="投资人名称" width="120"></el-table-column>
                <el-table-column prop="country | formatCountry" label="资产类别" :formatter="formatter"></el-table-column>
                <el-table-column prop="investedamount" label="投资金额（$）" :formatter="formatter"></el-table-column>
                <el-table-column prop="annualizedinterestrate" label="投资利率" :formatter="formatter"></el-table-column>
                <el-table-column prop="exchangerate" label="换算汇率" :formatter="formatter"></el-table-column>
                <el-table-column prop="exchangeamount" label="投换算金额(万)" :formatter="formatter"></el-table-column>
                <el-table-column prop="expectation" label="预期收益（$）" :formatter="formatter"></el-table-column>
                <el-table-column prop="+startinterestdate | moment().valueOf()" label="投资日期" :formatter="formatter"></el-table-column>
                <el-table-column prop="matchingnum" label="已配置标的数(个)" :formatter="formatter"></el-table-column>
                <el-table-column prop="matchingstatus | formatInvestmenType" label="匹配状态" :formatter="formatter"></el-table-column>
                <el-table-column prop="operatorname" label="操作人" :formatter="formatter"></el-table-column>
                <el-table-column prop="+insertdatetime | moment().valueOf()" label="操作人时间" :formatter="formatter"></el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :total="this.page.counttotal"></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="新增资产配置" width="80%" :visible.sync="editVisible">
            <el-form ref="form" :inline="true" :model="form" >
                <el-row>
                    <el-form-item label="投资人名称">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="searchName">查询</el-button>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="可用余额">
                        ${{form.availableamounttotal}}
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="投资人金额">
                        <el-input v-model="form.investedamount"></el-input>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-table :data="newTableData" border @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="55"></el-table-column>
                        <el-table-column property="date" label="起投时间">
                            <template slot-scope="time">
                                <el-date-picker
                                    v-model="time.row.investedstartdate"
                                    type="date"
                                    placeholder="选择日期">
                                </el-date-picker>
                            </template>
                        </el-table-column>
                        <el-table-column property="name" label="投资金额" >
                            <template slot-scope="amount">
                                <el-input
                                    v-model="amount.row.investedamount"
                                    size="mini"
                                    placeholder=""/>
                            </template>
                        </el-table-column>
                        <el-table-column property="address" label="投资周期">
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.investedyears" placeholder="请选择">
                                    <el-option
                                        v-for="item in options.days"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column property="address" label="投资类型">
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.investmenttype" placeholder="请选择">
                                    <el-option
                                        v-for="item in options.coins"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column property="address" label="年化率">
                            <template slot-scope="scope">
                                <el-input
                                        v-model="scope.row.annualizedinterestrate"
                                        size="mini"
                                        placeholder=""/>
                            </template>
                        </el-table-column>
                        <el-table-column property="address" label="换算汇率">
                            <template slot-scope="scope">
                                <el-input
                                        v-model="scope.row.exchangerate"
                                        size="mini"
                                        placeholder=""/>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="请确认一下投资信息？" width="80%" :visible.sync="editSureVisible">
            <el-form ref="form" :inline="true" :model="form" >
                <el-row>
                    <el-form-item label="投资人名称">
                        {{form.name}}
                    </el-form-item>
                    <el-form-item label="投资人金额">
                        {{form.investedamount}}
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-table :data="newTableData" border>
                        <el-table-column property="+investedstartdate | moment('YYYY-MM-DD')" label="起投时间">
                            <template slot-scope="scope">
                                {{+scope.row.investedstartdate | moment('YYYY-MM-DD')}}
                            </template>
                        </el-table-column>
                        <el-table-column property="investedamount" label="投资金额" >
                        </el-table-column>
                        <el-table-column property="investedyears" label="投资周期">
                        </el-table-column>
                        <el-table-column property="investmenttype" label="投资类型">
                        </el-table-column>
                        <el-table-column property="annualizedinterestrate" label="年化率">
                        </el-table-column>
                        <el-table-column property="exchangerate" label="换算汇率">
                        </el-table-column>
                    </el-table>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editSureCancleClick">取 消</el-button>
                <el-button type="primary" @click="editSureClick">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    import ajax from '@/utils/fetch';
    import moment from 'moment';
    export default {
        name: 'basetable',
        data() {
            return {
                editVisible: true,
                editSureVisible: false,
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
                form: {
                    name: '', // 投资人名称
                    availableamounttotal: 0, // 可  用 余 额
                    investedamount: 0, // 投资人金额
                },
                page: {
                    pageindex: 1,
                    pagesize: 20,
                    counttotal: 0, // 当前参数下查询总记录数
                },
                options: {
                    days: [
                        {
                            value: '半年',
                            label: '半年',
                        }, {
                            value: '一年',
                            label: '一年',
                        }, {
                            value: '两年',
                            label: '两年',
                        }, {
                            value: '三年',
                            label: '三年',
                        }
                    ],
                    coins: [
                        {
                            value: '001',
                            label: '越南资产'
                        }, {
                            value: '003',
                            label: '菲律宾资产'
                        }, {
                            value: '002',
                            label: '印尼资产'
                        }, {
                            value: '004',
                            label: '俄罗斯资产'
                        }
                    ],
                },
                tableData: [],
                newTableData: [
                    {
                        investedstartdate: '',
                        investedamount: '',
                        investedyears: '',
                        annualizedinterestrate: '',
                        currency: '',
                        exchangerate: '',
                    },
                    {
                        investedstartdate: '',
                        investedamount: '',
                        investedyears: '',
                        annualizedinterestrate: '',
                        currency: '',
                        exchangerate: '',
                    },
                    {
                        investedstartdate: '',
                        investedamount: '',
                        investedyears: '',
                        annualizedinterestrate: '',
                        currency: '',
                        exchangerate: '',
                    },
                    {
                        investedstartdate: '',
                        investedamount: '',
                        investedyears: '',
                        annualizedinterestrate: '',
                        currency: '',
                        exchangerate: '',
                    }
                ],
                multipleSelection: [],
                del_list: [],
            }
        },
        created() {

        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.page.pageindex = val;
                this.search();
            },
            // 获取 easy-mock 的模拟数据
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

                let data = {
                    pageindex: this.page.pageindex,
                    pagesize: this.page.pagesize,
                    investmentname: this.searchData.assetSelect.investmentname, // 投资方名称
                    country: this.searchData.assetSelect.country, // 国家（投资类型） 001：越南，002：印尼，003：菲律宾，004：俄罗斯
                    matchingstatus: this.searchData.assetSelect.region,// 匹配状态  d:匹配中，s：匹配完成，w：待匹配
                    startdate: this.searchData.time ? '' + moment(this.searchData.time[0]).valueOf() : '',
                    enddate: this.searchData.time ? '' + moment(this.searchData.time[1]).valueOf() : '',
                };
                console.log(data)
                ajax.post('/admin/getassetsconfiglist', data)
                    .then(res => {
                        let {head, body} = res;
                        if (head && head.returncode === '0000') {
                            if (body && body.list) {
                                this.tableData = body.list;
                                this.page.total = body.counttotal;
                                this.tableData.map(item => {
                                    // 投资者类型；0：公司，1：个人（目前公司）
                                })
                            }
                        }
                    })
                    .catch(e => {
                        console.log(e);
                    })
            },
            searchName() {
                let data = {
                    investmentname: this.form.name
                };
                ajax.post('/user/getaccountinfo', data)
                    .then(res => {
                        let {head, body} = res;
                        if (head && head.returncode === '0000') {
                        //    availableamounttotal
                            this.form.availableamounttotal = body.availableamounttotal;

                        }
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
                console.log(val)
                this.multipleSelection = val;
            },
            // 保存编辑
            saveEdit() {
                this.editVisible = false;
                this.editSureVisible = true;
                this.newTableData.map(item => {
                    if (item.investedstartdate) {
                        item.investedstartdate = '' + moment(item.investedstartdate).valueOf();
                    }
                });
                ajax.post('/admin/addassetsconfiginfo', this.newTableData)
                .then(res => {
                    let {head, body} = res;
                    if (head && head.returncode === '0000') {
                        this.editVisible = false;
                        this.editSureVisible = true;
                    }
                })
                .catch(e => {
                    console.log(e)
                })
            },
            editSureClick() {
                this.editSureVisible = false;
                this.newTableData.map(item => {
                    if (item.investedstartdate) {
                        item.investedstartdate = '';
                    }
                });
            },
            editSureCancleClick() {
                this.newTableData.map(item => {
                    if (item.investedstartdate) {
                        item.investedstartdate = '';
                    }
                });
                this.editVisible = true;
                this.editSureVisible = false;
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
