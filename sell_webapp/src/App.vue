<template>
  <div id="app">
    <v-header :seller="seller"></v-header>

    <div class="tab">
      <div class="tab-item">
        <!-- 默认渲染成 <a>标签 -->
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <!-- keep-alive组件用来 缓存 组件,避免多次加载相应的组件,减少性能消耗 -->
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import header from './components/header/header.vue';

// 定义常量
const ERR_OK = 0;
// 默认导出 匿名
export default {
  data() {
    return {
      // 初始化 seller 为空对象
      seller: {}
    };
  },
  // 调用 vue 生命周期函数 (实例创建成功后调用)
  created() {
    // 发送请求后，使用then方法来处理 响应结果 | vue-resource 实现
    this.$http.get('/api/seller').then(response => {
      // let 声明的变量，只在块内有效
      // 返回响应体（object类型）
      let json = response.body;
      console.log(json.data);
      if (json.errno === ERR_OK) {
        this.seller = json.data;
      }
    }, response => {
      // 响应失败回调
    });
  },
  components: {
    'v-header': header
  }
};
</script>

<style type="text/css" lang="less">
.tab {
  display: flex;
  width: 100%;
  line-height: 40px;
  height: 40px;
  border-bottom: 1px solid rgba(7, 17, 27, .1);
  .tab-item {
    flex: 1;    /* flex-grow（定义项目的放大比例）：设为 1， 将等分剩余空间 */
    text-align: center;  /* 文本对齐方式：居中 */
    a {
      display: block;
      font-size: 14px;
      color: rgb(77, 85, 93);
    }
    .item_active {
      color: #009688;
    }
  }
}

</style>
