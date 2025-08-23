const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

// 模拟加载dev.yml配置
const configPath = path.join(__dirname, 'src', 'config', 'dev.yml');
const config = yaml.load(fs.readFileSync(configPath, 'utf8'));

console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('白名单配置:');
console.log(JSON.stringify(config.perm.router.whitelist, null, 2));

// 测试路径匹配
const { pathToRegexp } = require('path-to-regexp');
const testUrls = [
  '/api/user/one/info',
  '/api/blog/list?title=&category=&status',
  '/api/visit-stats/increment'
];

console.log('\n测试路径匹配:');
config.perm.router.whitelist.forEach(route => {
  testUrls.forEach(url => {
    const reqUrl = url.split('?')[0];
    const match = !!pathToRegexp(route.path).exec(reqUrl);
    console.log(`${route.method} ${route.path} vs ${url}: ${match ? '✅匹配' : '❌不匹配'}`);
  });
});