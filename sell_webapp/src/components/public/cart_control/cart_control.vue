<template>
  <div class="cart_control">
    <transition name='move'>
      <div class="cart-decrease icon icon-remove_circle_outline" v-show="food.count" @click.stop="decrease_Cart($event)"></div>
    </transition>
    <div class="cart-count" v-show="food.count">{{ food.count }}</div>
    <div class='cart-add icon icon-add_circle' @click.stop="add_Cart($event)"></div>   <!-- $event：访问原生 DOM -->
  </div>
</template>

<script>
export default {
  props: {
    food: {
      type: Object
    }
  },
  methods: {
    add_Cart(event) {
      if (!event._constructed) {
        return;
      }
      // 获取对象不存在的 key，返回 undefined | 布尔值为 false
      if (!this.food.count) {
        // 向 vue 已创建的实例 添加、修改数组 或 对象的值 | 使用 Vue.set API
        this.$set(this.food, 'count', 1);   // 初始为 1
      } else {
        // 触发点击事件一次, 加 1
        this.$set(this.food, 'count', this.food.count + 1);
      }
      // 访问 当前组件树的根组件的 eventHub 对象 | 触发事件
      this.$root.eventHub.$emit('cart_add', event.target);   //  event.target：返回触发此事件的元素 传给 监听事件的回调函数的参数
    },
    decrease_Cart(event) {
      if (!event._constructed) {
        return;
      }
      if (this.food.count) {
        // 向 vue 已创建的实例 添加、修改数组 或 对象的值 | 使用 Vue.set API
        this.$set(this.food, 'count', this.food.count - 1);
      }
    }
  }
};
</script>

<style type='text/css' lang="less" scoped>
.cart_control {
  font-size: 0;
  .cart-decrease {
    display: inline-block;
    font-size: 24px;
    line-height: 1;   /* 设置数字，此数字会与当前的字体尺寸相乘来设置行间距 */
    padding: 6px;
    color: #009688;
    &.move-enter, &.move-leave-active {
      opacity: 0;
      transform: translate3d(24px, 0, 0) rotate(180deg);
      transition: all .4s linear;   /* 持续 0.4s,匀速过渡 */
    }
    &.move-enter-active, &.move-leave {
      opacity: 1;
      transfrom: translate3d(0, 0, 0) rotate(180deg);
      transition: all .4s linear;   /* all 指的是 transition 之后的样式 */
    }
  }
  .cart-count {
    display: inline-block;
    font-size: 12px;
    width: 12px;
    text-align: center;
    color: black;
    vertical-align: top;
    margin-top: 12px;
  }
  .cart-add {
    display: inline-block;
    font-size: 24px;
    padding: 6px;
    color: #009688;
    line-height: 1;
  }
}
</style>
