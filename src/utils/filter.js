import {countryMap, investmenTypeMap, assetConfigMap, payBackMap,tradeTypeMap,operateTypeMap,operateStatusMap } from '@/utils/config.js';

function formatCountry(val) {
    return countryMap[val];
}
function formatInvestmenType(val) {
    return investmenTypeMap[val];
}
function formatAssetConfige(val) {
    return assetConfigMap[val];
}
function formatPayBack(val) {
    return payBackMap[val];
}
function formatTradeType(val) {
    return tradeTypeMap[val];
}
function formatOperateTypeMap(val) {
    return operateTypeMap[val];
}
function formatOperateStatus(val) {
    return operateStatusMap[val];
}
export default {
    formatCountry,
    formatInvestmenType,
    formatAssetConfige,
    formatPayBack,
    formatTradeType,
    formatOperateTypeMap,
    formatOperateStatus
}
