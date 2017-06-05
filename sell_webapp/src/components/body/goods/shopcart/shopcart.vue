<template>
  <div class="shopcart">
    <div class="content">
      <!-- .content 的子元素 1 -->
      <div class="left" @click="toggle_List">
        <!-- .left 的子元素 1 -->
        <div class="logo-wrapper" :class="{ active: total_Count > 0 }">
          <div class="logo">
            <span class="icon icon-shopping_cart"></span>
          </div>
          <div class="num">{{ total_Count }}</div>
        </div>
        <!-- .left 的子元素 2 -->
        <div class="price" :class="{ active: total_Price > 0 }">￥{{ total_Price }}</div>
        <!-- .left 的子元素 3 -->
        <div class="desc">所需配送费 {{ deliveryPrice }}元</div>
        <!-- .left 的子元素 4 -->
        <div class='ball-wrapper'>
          <transition-group name="drop" v-on:before-enter="before_Drop" v-on:enter="droping" v-on:after-enter="after_Drop">
            <div v-for="(ball, index) of balls" v-if="ball.show" class='ball' :key="index">
              <div class="inner"></div>
            </div>
          </transition-group>
        </div>
      </div>
      <!-- .content 的子元素 2 -->
      <div class="right" :class="{ enough: total_Price >= minPrice }" @click="pay">
        {{ pay_Desc }}
      </div>
    </div>

    <transition name="fold">
      <div class="shopcart-list" v-show="list_show">
        <div class="title">
          <h1>购物车</h1>
          <span @click="clear_Cart">清空</span>
        </div>
        <div ref="list_Content">
          <ul class="list">
            <li class='item' v-for="food of selectFoods">
              <div class="name">{{ food.name }}</div>
              <div class="price-wrapper">
                <span class="small">￥</span>
                <span class="price">{{ food.price * food.count }}</span>
              </div>
              <div class="cartcontrol-wrapper">
                <cart-control :food="food"></cart-control>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div class="list-mask" v-show="!fold" @click="fold=!fold"></div>
    </transition>
  </div>
</template>

<script>
import BScroll from 'better-scroll';
// 导入子组件
import cartControl from '../../../public/cart_control/cart_control.vue';
export default {
  data() {
    return {
      balls: [
        { show: false },
        { show: false },
        { show: false },
        { show: false },
        { show: false }
      ],
      dropBalls: [],  // 用于重置下落完毕小球的状态
      fold: true
    };
  },
  // 接受父组件传递的数据
  props: {
    selectFoods: {
      type: Array,
      // 数组／对象的默认值应当由一个工厂函数返回
      default: function() {
        return [];
      }
    },
    deliveryPrice: {
      // 验证类型
      type: Number,
      // 默认值
      default: 0
    },
    minPrice: {
      type: Number,
      default: 0
    }
  },
  // 计算属性
  computed: {
    total_Price() {
      let total = 0;
      // forEach方法：调用数组的每个元素，并执行回调函数 | 返回新数组。
      this.selectFoods.forEach(food => {
        total += food.price * food.count;
      });
      return total;
    },
    total_Count() {
      let count = 0;
      this.selectFoods.forEach(food => {
        count += food.count;
      });
      return count;
    },
    pay_Desc() {
      // 总价
      let total_price = this.total_Price;
      // 最低价
      let min_price = this.minPrice;
      if (total_price === 0) {
        // 模板字符串
        return `￥${ min_price }元 起送`;
      } else if (total_price < min_price) {
        // 差价
        let diff = min_price - total_price;
        return `还差￥${ diff }元 起送`;
      } else {
        return `付钱`;
      }
    },
    list_show() {
      if (!this.total_Count) {
        this.fold = true;
        return false;
      }
      let show = !this.fold;

      // 此段 if 判断 code 未执行 | 无法滚动
      if (show) {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.list_Content, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      }

      return show;
    }
  },
  // 实例创建完成之后被调用（生命周期函数）
  created() {
    // 接收 事件中心派发的事件 |
    this.$root.eventHub.$on('cart_add', this.drop);
  },
  methods: {
    // 事件回调函数 | 回调函数会接收所有传入事件触发函数的额外参数
    drop(el) {
      // console.log(el);
      // 遍历 balls 数组
      for (let i = 0; i < this.balls.length; i++) {
        // 取出单个 ball 对象
        let ball = this.balls[i];
        if (!ball.show) {
          ball.show = true;
          ball.el = el;
          this.dropBalls.push(ball);
          return;   // 结束
        }
      }
    },
    // 钩子函数：当达到某个状态的时候就会触发。
    // vue 过渡钩子函数
    // 过渡 出现前
    before_Drop(el) {
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i];
        if (ball.show) {
          // 获取 dom 元素 相对于浏览器视窗的位置 | 返回矩形对象
          let rect = ball.el.getBoundingClientRect();
          // 32为： 小球终点位置 距 左边（浏览器）的距离
          let x = rect.left - 32;
          // 22为： 小球终点位置 距 底部（浏览器）的距离
          let y = -(window.innerHeight - rect.top - 22);
          el.style.display = '';
          el.style.transform = `translate3d(0, ${ y }px, 0)`;
          // 获取子元素
          let inner = el.getElementsByClassName('inner')[0];
          inner.style.transform = `translate3d(${ x }px, 0, 0)`;
        }
      }
    },
    // 过渡 出现中
    droping(el, done) {
      /* eslint-disable no-unused-vars */
      // 主动触发一次浏览器重绘
      let ref = el.offsetHeight;
      this.$nextTick(() => {
        // 等待DOM更新完毕后，执行
        el.style.display = '';
        el.style.transform = 'translate3D(0, 0, 0)';
        let inner = el.getElementsByClassName('inner')[0];
        inner.style.transform = 'translate3D(0, 0, 0)';
        //  完成过渡后触发
        el.addEventListener('transitionend', done);
      });
    },
    // 过渡 出现后
    after_Drop(el) {
      // shift()：删除 并 返回数组的第一个元素
      let ball = this.dropBalls.shift();
      if (ball) {
        ball.show = false;
        el.style.display = 'none';
      }
    },
    toggle_List() {
      if (!this.total_Count) {
        return;
      }
      this.fold = !this.fold;
    },
    clear_Cart() {
      this.selectFoods.forEach(food => {
        food.count = 0;
      });
    },
    pay() {
      if (this.total_Price > this.minPrice) {
        alert(`支付${ this.total_Price }元成功!`);
      }
    }
  },
  // 注册子组件
  components: {
    cartControl
  }
};
</script>

<style type="text/css" lang="less" scoped>
.shopcart {
  position: fixed;   /* 浏览器窗口是固定位置 */
  left: 0;
  bottom: 0;
  width: 100%;
  height: 48px;
  z-index: 5;
  .content {
    display: flex;   /* 弹性布局 */
    .left {
      flex: 1;
      background: #141d27;
      font-size: 0;
      white-space: nowrap;   /* 文本不会换行 */
      /* .left 的子元素 1 */
      .logo-wrapper {
        display: inline-block;
        position: relative;   /* 相对定位：定位是相对其正常位置 */
        top: -10px;
        width: 56px;
        height: 56px;
        margin-left: 12px;
        padding: 6px;
        box-sizing: border-box;
        border-radius: 50%;
        background: #141d27;
        .logo {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: #2b343c;
          text-align: center;
          .icon {
            line-height: 44px;   /* 行高 等于 高度：垂直居中 */
            font-size: 24px;
            color: rgba(255, 255, 255, .4);
          }
        }
        .num {
          position: absolute;   /* 绝对定位 */
          top: 0;
          right: 0;
          display: none;   /* 元素不显示 */
          font-size: 12px;
          font-weight: 700;
          width: 24px;
          height: 16px;
          line-height: 16px;
          text-align: center;
          color: #fff;
          background: red;
          border-radius: 16px;   /* 元素添加圆角效果 */
          box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 1);   /* 元素添加阴影效果 */
        }
        &.active {
          .logo {
            background: #009688;
            .icon {
              color: #fff;
            }
          }
          .num {
            display: block;
          }
        }
      }
      /* .left 的子元素 2 */
      .price {
        display: inline-block;
        font-size: 16px;
        font-weight: 700;
        color: rgba(255, 255, 255, .4);
        border-right: 1px solid rgba(255, 255, 255, .1);
        line-height: 24px;
        margin-top: 12px;
        vertical-align: top;   /* 垂直对齐：元素的顶端与行中最高元素的顶端对齐 */
        padding-right: 6px;
        &.active {
          color: #fff;
        }
      }
      /* .left 的子元素 3 */
      .desc {
        display: inline-block;
        font-size: 16px;
        font-weight: 200;
        color: rgba(255, 255, 255, .4);
        line-height: 24px;
        vertical-align: top;
        margin-top: 12px;
        padding-left: 6px;
      }
      .ball-wrapper {
        position: absolute;
        left: 32px;
        bottom: 20px;
        width: 16px;
        height: 16px;
        .ball {
          position: fixed;
          left: 32px;
          bottom: 22px;
          z-index: 8;
          transition: all .5s cubic-bezier(.37, -0.39, .63, -0.05);
          .inner {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            transition: all .5s linear;
            background: #009688;
          }
        }
      }
    }
    .right {
      flex: 0 0 105px;   /* 固定空间（宽度） */
      margin-left: -1px;
      line-height: 48px;
      background: #282E35;
      color: rgba(255, 255, 255, .4);
      font-size: 12px;
      font-weight: 700;
      text-align: center;
      &.enough {
        background: #009688;
        color: #fff;
        font-size: 14px;
      }
    }
  }
  .shopcart-list {
    position: absolute;
    left: 0;
    bottom: 48px;
    width: 100%;
    z-index: -1;
    &.fold-enter, &.fold-leave-active {
      opacity: 0;
      transform: translate3d(0, 100%, 0);   /* 100%：相当于当前自身的高度 做 位移 */
      transition: all .5s ease;   /* 速度逐渐变慢 */
    }
    &.fold-enter-active, &.fold-leave {
      opacity: 1;
      /*transform: translate3d(0, 0, 0);*/
      transition: all .5s ease;   /* 速度逐渐变慢 */
    }
    .title {
      height: 40px;
      line-height: 40px;
      padding: 0 18px;
      background: #f3f5f7;
      border-bottom: 1px solid rgba(7, 17, 27, .1);
      > h1 {
        float: left;
        font-size: 14px;
        font-weight: 700;
        color: rgb(7, 17, 27);
      }
      > span {
        float: right;
        font-size: 12px;
        color: #009688;
      }
    }
    .list {
      max-height: 217px;
      padding: 0 18px;
      overflow: hidden;
      /*overflow-y: scroll;*/
      background: #fff;
      .item {
        position: relative;
        padding: 12px 0;
        border-bottom: 1px solid rgba(7, 17, 27, .1);
        .name {
          font-size: 14px;
          color: rgb(7, 17, 27);
          line-height: 24px;
          font-weight: 700;
        }
        .price-wrapper {
          position: absolute;
          bottom: 12px;
          right: 90px;
          color: rgb(240, 20, 20);
          line-height: 24px;
          .small, .price {
            font-size: 14px;
            font-weight: 700;
          }
        }
        .cartcontrol-wrapper {
          position: absolute;
          right: 0;
          bottom: 6px;
        }
      }
    }
  }
  .list-mask {
    position: fixed;
    top: 0;
    left: 0;
    z-index: -2;
    width: 100%;
    height: 100%;
    background-color: rgba(7, 17, 27, .6);
    opacity: 1;
    &.fade-enter, &.fade-leave-active {
      opacity: 0;
      background-color: rgba(7, 17, 27, 0);
    }
    &.fade-enter-active, &.fade-leave {
      opacity: 1;
      transition: all .4s ease;
    }
  }
}
</style>
