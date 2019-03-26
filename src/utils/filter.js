import {countryMap, investmenTypeMap, assetConfigMap, payBackMap,tradeTypeMap,operateTypeMap,operateStatusMap } from '@/utils/config.js';
/**
 * @param fen  人民币 单位分
 * @output 222,222.00
 * */
export function formatMoney(fen) {
    const num1 = (+fen/100).toFixed(2) + ' ';
    return num1.replace(/\B(?=(\d{3})+(\.\d{1,2})?\b)/g,',')
}
export function formatCountry(val) {
    return countryMap[val];
}
export function formatInvestmenType(val) {
    return investmenTypeMap[val];
}
export function formatAssetConfige(val) {
    return assetConfigMap[val];
}
export function formatPayBack(val) {
    return payBackMap[val];
}
export function formatTradeType(val) {
    return tradeTypeMap[val];
}
export function formatOperateTypeMap(val) {
    return operateTypeMap[val];
}
export function formatOperateStatus(val) {
    return operateStatusMap[val];
}

