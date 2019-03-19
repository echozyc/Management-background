import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/AssetAllocation'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children:[
                {
                    path: '/AssetAllocation',
                    component: resolve => require(['../components/page/AssetAllocation.vue'], resolve),
                    meta: { title: '配置资产' }
                },
                {
                    path: '/MatchRecords',
                    component: resolve => require(['../components/page/MatchRecords.vue'], resolve),
                    meta: { title: '资产匹配记录' }
                },
                {
                    path: '/RechargeWithdrawal',
                    component: resolve => require(['../components/page/RechargeWithdrawal.vue'], resolve),
                    meta: { title: '充值提现' }
                },
                {
                    path: '/InvestorInformation',
                    component: resolve => require(['../components/page/InvestorInformation.vue'], resolve),
                    meta: { title: '投资人信息' }
                },
                {
                    path: '/consultationRecord',
                    component: resolve => require(['../components/page/consultationRecord.vue'], resolve),
                    meta: { title: '客户投资人信息' }
                },
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
