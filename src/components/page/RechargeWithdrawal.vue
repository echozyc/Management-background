<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>充值提现</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-form :inline="true" :model="searchData.assetSelect" class="demo-form-inline">
                    <el-form-item label="投资人名称">
                        <el-input v-model="searchData.assetSelect.investmentname"  placeholder="投资人名称"></el-input>
                    </el-form-item>
                    <el-form-item label="操作类型">
                        <el-select v-model="searchData.assetSelect.trandtype" placeholder="操作类型">
                            <!--交易类型 1：充值, 4：提现-->
                            <el-option label="充值" value="1"></el-option>
                            <el-option label="提现" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="操作日期">
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
                    <el-form-item>
                        <el-button type="primary" @click="search">查询</el-button>
                    </el-form-item>
                </el-form>
                <el-row>
                    <el-button type="primary" @click="recharge">充值</el-button>
                    <el-button type="primary" @click="withdraw">提现</el-button>
                </el-row>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column prop="serialno" label="操作流水号" width="150"></el-table-column>
                <el-table-column prop="investmentname" label="投资人名称" width="120"></el-table-column>
                <el-table-column prop="trandtype | formatTradeType" label="交易类型" :formatter="formatter"></el-table-column>
                <el-table-column prop="amount" label="金额（$）" :formatter="formatter"></el-table-column>
                <el-table-column prop="operatorid" label="操作人Id" :formatter="formatter"></el-table-column>
                <el-table-column prop="operatorname" label="操作人" :formatter="formatter"></el-table-column>
                <el-table-column prop="updatedatetime" label="操作时间" :formatter="formatter"></el-table-column>
                <el-table-column prop="summary" label="备注" :formatter="formatter"></el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :total="page.counttotal"></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="充值" :visible.sync="editVisible" >
            <el-form ref="form" :model="rechargeForm" label-width="150px">
                <el-form-item label="投资人名称">
                    <el-input v-model="rechargeForm.name"></el-input>
                </el-form-item>
                <el-form-item label="投资机构营业号/个人投资者身份证号">
                    <el-input v-model="rechargeForm.id"></el-input>
                </el-form-item>
                <el-form-item label="提现金额">
                    <el-input v-model="rechargeForm.num"></el-input>
                </el-form-item>
                <el-form-item label="币种">
                    <el-select v-model="rechargeForm.type" placeholder="币种">
                        <el-option label="人民币" value="人民币"></el-option>
                        <el-option label="美元" value="美元"></el-option>
                        <el-option label="印尼盾" value="印尼盾"></el-option>
                        <el-option label="越南盾" value="越南盾"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" v-model="rechargeForm.text"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="rechargeSure()">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="提现" :visible.sync="editVisible2" >
            <el-form ref="form" :model="form2" label-width="150px">
                <el-form-item label="投资人名称">
                    <el-input v-model="form2.name"></el-input>
                </el-form-item>
                <el-form-item label="投资机构营业号/个人投资者身份证号">
                    <el-input v-model="rechargeForm.id"></el-input>
                </el-form-item>
                <el-form-item label="提现金额">
                    <el-input v-model="form2.num"></el-input>
                </el-form-item>
                <el-form-item label="币种">
                    <el-select v-model="form2.type" placeholder="币种">
                        <el-option label="人民币" value="人民币"></el-option>
                        <el-option label="美元" value="美元"></el-option>
                        <el-option label="印尼盾" value="印尼盾"></el-option>
                        <el-option label="越南盾" value="越南盾"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" v-model="form2.text"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible2 = false">取 消</el-button>
                <el-button type="primary" @click="withdrawSure">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import ajax from '../../utils/fetch';
    import moment from 'moment';
    export default {
        name: 'RechargeWithdrawal',
        data() {
            return {
                searchData: {
                    assetSelect: {
                        investmentname: '',
                        trandtype: '',

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
                    pagesize: 20,
                    counttotal: 0,
                },
                tableData: [],
                multipleSelection: [],
                editVisible: false,
                editVisible2: false,

                delVisible: false,
                rechargeForm: {
                    name: '',
                    num: '',
                    type: '',
                    text: '',
                    id: ''
                },
                form2: {
                    name: '',
                    num: '',
                    type: '',
                    text: '',
                    id: '',
                },
                idx: -1
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
                // } else if(this.searchData.assetSelect.trandtype === '') {
                //     return this.$message.error('操作类型不能为空');
                // } else if(this.searchData.time === '') {
                //     return this.$message.error('操作日期不能为空');
                // }

                let data = {
                    pageindex:  this.page.pageindex,
                    pagesize: this.page.pagesize,
                    investmentname: this.searchData.assetSelect.investmentname,
                    trandtype: this.searchData.assetSelect.trandtype, // 交易类型 1：充值, 4：提现
                    startdate: this.searchData.time ? '' + moment(this.searchData.time[0]).valueOf() : '',
                    enddate: this.searchData.time ? '' + moment(this.searchData.time[1]).valueOf() : '',
                };
                ajax.post('/admin/getaccounttrandlist', data)
                    .then(res => {
                        let {head, body} = res;
                        if (head && head.returncode === '0000') {
                            if (body && body.list) {
                                this.tableData = body.list;
                                this.page.counttotal = body.counttotal;
                            }
                        }
                    })
                    .catch(e => {
                        console.log(e);
                    })

            },
            //充值
            recharge() {
                this.editVisible = true
            },
            //充值确认
            rechargeSure() {
                let data = {
                    investmentid: this.rechargeForm.id,
                    investmentname: this.rechargeForm.name,
                    amount: this.rechargeForm.num,
                    investmenttype: '1',  //1充值 4提现
                    summary: this.rechargeForm.text,
                    currency: this.rechargeForm.type,
                };
                ajax.post('/admin/addaccounttrandinfo', data)
                    .then(res => {
                        let {head, body} = res;
                        if (head && head.returncode === '0000') {
                            this.search();
                        }
                    })
                    .catch(e => {
                        console.log(e);
                    })
            },

            //提现
            withdraw() {
                this.editVisible2 = true
            },

            withdrawSure() {
                let data = {
                    investmentid: this.form2.id,
                    investmentname: this.form2.name,
                    amount: this.form2.num,
                    investmenttype: '4',  //1充值 4提现
                    summary: this.form2.text,
                    币种: this.form2.type,  //这他妈啥啊 参数呢
                }
                console.log(data)
                ajax.post('/admin/addaccounttrandinfo', data)
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
                this.editVisible = true;
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
                this.editVisible = false;
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
