## 仿豆瓣电影

一个仿豆瓣电影站点, 使用 [豆瓣电影 API.](https://developers.douban.com/wiki/?title=movie_v2) 获取数据，

完成三个功能模块（首页列表、搜索列表、详情页）。

## 相关技术栈（应用环境）

- Vue 2.x.x + Vuer-Router
- Axios
- Vue-infinite-scroll
- CSS

### 开发环境下解决跨域请求问题

Vue 通过 Webpack 进行配置，可在 config/index.js 文件下的 proxyTable 配置代理：

```
proxyTable: {
  '/api': {
    target: 'https://api.douban.com/',
    changeOrigin: true,
    pathRewrite: {
      '^/api': ''
    }
  }
```

## 如何运行

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

## 应用演示

![豆瓣电影](./static/result.gif)
