"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryParams = exports.throttle = exports.debounce = exports.deepClone = exports.formatDate = void 0;
// 日期格式化工具
const formatDate = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    return format
        .replace('YYYY', String(year))
        .replace('MM', month)
        .replace('DD', day)
        .replace('HH', hours)
        .replace('mm', minutes)
        .replace('ss', seconds);
};
exports.formatDate = formatDate;
// 深拷贝工具
const deepClone = (obj) => {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }
    if (Array.isArray(obj)) {
        return obj.map(item => (0, exports.deepClone)(item));
    }
    if (typeof obj === 'object') {
        const clonedObj = {};
        Object.keys(obj).forEach(key => {
            const typedKey = key;
            clonedObj[key] = (0, exports.deepClone)(obj[typedKey]);
        });
        return clonedObj;
    }
    return obj;
};
exports.deepClone = deepClone;
// 防抖函数
const debounce = (func, delay) => {
    let timeoutId = null; // 使用 any 类型避免 NodeJS 未定义的问题
    return (...args) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => func(...args), delay);
    };
};
exports.debounce = debounce;
// 节流函数
const throttle = (func, delay) => {
    let lastCall = 0;
    return (...args) => {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            func(...args);
        }
    };
};
exports.throttle = throttle;
// URL参数处理
const queryParams = (params) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
        }
    });
    return searchParams.toString();
};
exports.queryParams = queryParams;
