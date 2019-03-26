// /admin/getassetsconfiglist
// 国家映射 国家（投资类型） 001：越南，002：印尼，003：菲律宾，004：俄罗斯
const countryMap = {
    '001': '越南',
    '002': '印尼',
    '003': '菲律宾',
    '004': '俄罗斯',
};
// 投资者类型；0：公司，1：个人（目前公司）
const investmenTypeMap = {
    '0': '公司',
    '1': '个人',
};
// 匹配状态  d:匹配中，s：匹配完成，w：待匹配
const assetConfigMap = {
    'd': '匹配中',
    's': '匹配完成',
    'w': '待匹配',
};

// 还款状态 s:已还款,w:待还款，m:已逾期
const payBackMap = {
    'm': '已逾期',
    's': '已还款',
    'w': '待还款',
};
// 交易类型 1：充值，2：投资，3：回款，4：提现
const tradeTypeMap = {
    '1': '充值',
    '2': '提现'
};
// 操作类型  0:投资，1:预约充值，2:预约提现
const operateTypeMap = {
    '0': '投资' ,
    '1': '预约充值',
    '2': '预约提现',
};
// 处理状态 0：未处理，1：已处理，2：其它
const operateStatusMap = {
    '0': '未处理',
    '1': '已处理',
    '2': '其它',
};
export {
    countryMap,
    investmenTypeMap,
    assetConfigMap,
    payBackMap,
    tradeTypeMap,
    operateTypeMap,
    operateStatusMap
}
