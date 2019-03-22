<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>投资人信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-form :inline="true" :model="searchData.assetSelect" class="demo-form-inline">
                    <el-form-item label="投资人名称">
                        <el-input v-model="searchData.assetSelect.user" placeholder="投资人名称"></el-input>
                    </el-form-item>
                    <el-form-item label="投资人类型">
                        <el-select v-model="searchData.assetSelect.type" placeholder="投资人类型">
                            <el-option label="机构用户" value="机构用户"></el-option>
                            <el-option label="个人用户" value="个人用户"></el-option>
                        </el-select>
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
                    <el-form-item>
                        <el-button type="primary" @click="search">查询</el-button>
                    </el-form-item>
                </el-form>
                <el-row>
                    <el-button type="primary" @click="editVisible = true">新增用户</el-button>
                </el-row>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="investmentid" label="用户ID" sortable width="150"></el-table-column>
                <el-table-column prop="investmenttype" label="投资人类型" width="120"></el-table-column>
                <el-table-column prop="investmentname" label="投资人名称" :formatter="formatter"></el-table-column>
                <el-table-column prop="legalcertificate" label="证件号" :formatter="formatter"></el-table-column>
                <el-table-column prop="investmentemail" label="开户邮箱" :formatter="formatter"></el-table-column>
                <el-table-column prop="contactperson" label="业务联系人" :formatter="formatter"></el-table-column>
                <el-table-column prop="investmentphone" label="联系电话" :formatter="formatter"></el-table-column>
                <el-table-column prop="investmentaddress" label="联系地址" :formatter="formatter"></el-table-column>
                <el-table-column prop="legalname" label="法人姓名" :formatter="formatter"></el-table-column>
                <el-table-column prop="legalcertificate" label="法人证件号" :formatter="formatter"></el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :total="1000"></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="新增用户" :visible.sync="editVisible" width="50%">
            <el-form ref="form" :model="dialogData.form" :inline="true" :rules="dialogData.rules">
                <el-form-item label="投资人类型">
                    <el-select v-model="dialogData.form.type" placeholder="投资人类型">
                        <el-option label="机构用户" value="机构用户"></el-option>
                        <el-option label="个人用户" value="个人用户"></el-option>
                    </el-select>
                </el-form-item>
                <br>
                <el-form-item label="企业名称：">
                    <el-input v-model="dialogData.form.investmentname"></el-input>
                </el-form-item>
                <el-form-item label="营业执照：">
                    <el-input v-model="dialogData.form.investmentid"></el-input>
                </el-form-item>
                <el-form-item label="开户邮箱：">
                    <el-input v-model="dialogData.form.investmentemail"></el-input>
                </el-form-item>
                <el-form-item label="联系地址：">
                    <el-input v-model="dialogData.form.investmentaddress"></el-input>
                </el-form-item>
                <el-form-item label="业务联系人名称：">
                    <el-input v-model="dialogData.form.contactperson"></el-input>
                </el-form-item>
                <el-form-item label="联系电话：">
                    <el-input v-model="dialogData.form.investmentphone"></el-input>
                </el-form-item>
                <el-form-item label="法人名称：">
                    <el-input v-model="dialogData.form.legalname"></el-input>
                </el-form-item>
                <el-form-item label="法人证件号码：">
                    <el-input v-model="dialogData.form.legalcertificate"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="add">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
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
    export default {
        name: 'InvestorInformation',
        data() {
            return {
                url: './static/vuetable.json',
                searchData: {
                    assetSelect: {
                        user: '',
                        type: ''
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
                    pageindex: '',
                    pagesize: 20,
                },
                dialogData: {
                    rules: {
                        type: [
                            { required: false, message: '请输入活动名称', trigger: 'blur' },
                            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                        ],
                        name: [
                            { required: true, message: '请输入活动名称', trigger: 'blur' },
                            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                        ],
                    },
                    form: {
                        type: '',
                        investmentname: '',
                        investmentid: '',
                        investmentemail: '',
                        investmentaddress: '',
                        contactperson: '',
                        investmentphone: '',
                        legalname: '',
                        legalcertificate: '',
                    },
                },
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                editVisible: false,
                delVisible: false,
            }
        },
        created() {
            this.getData();
        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            add () {
                let data = {
                    type: '',
                    investmentname: '',
                    investmentid: '',
                    investmentemail: '',
                    investmentaddress: '',
                    contactperson: '',
                    investmentphone: '',
                    legalname: '',
                    legalcertificate: '',
                };
                // /admin/addinterestedinfo
                this.editVisible = false
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
                let data = {
                    pageindex: this.page.pageindex,
                    pagesize: this.page.pagesize,
                    investmenttype: this.searchData.assetSelect.type, // 投资方类型0：公司，1：个人
                    investmentname:  this.searchData.assetSelect.user, // 投资方名称
                    startdate: this.searchData.time,
                    enddate: this.searchData.time
                }
                // /admin/getinterestedlist
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
