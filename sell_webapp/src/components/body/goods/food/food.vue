<template>
  <transition name="move">
    <div class="food" v-show="foodShow" ref="food_Wrapper">
      <div class="content">
        <!-- .content 子元素 1 -->
        <div class="header-image">
          <img class="img" :src="food.image" />
          <div class="back-btn">
            <span class="icon icon-arrow_lift" @click="foodShow = false"></span>
          </div>
        </div>
        <!-- .content 子元素 2 -->
        <div class="base-info">
          <h3 class="name">{{ food.name }}</h3>
          <div class="count-wrapper">
            <span class="left">月售{{ food.sellCount }}份</span>
            <span class="right">好评率{{ food.rating }}</span>
          </div>
          <div class="price-wrapper">
            <span class="now_price"><small>￥</small>{{ food.price }}</span>
            <span class="old_price" v-show="food.oldPrice"><small>￥</small>{{ food.oldPrice }}</span>
          </div>
          <transition name="fade">
            <div class="add-cart" v-show="!food.count > 0" @click="add_First($event)">加入购物车</div>
          </transition>
          <div class="control-wrapper" v-show="food.count > 0">
            <cart-control :food="food"></cart-control>
          </div>
        </div>

        <split v-show="food.info"></split>
        <div class="desc-wrapper" v-show="food.info">
          <h3 class="title">商品介绍</h3>
          <div class="desc">{{ food.info }}</div>
        </div>
        <split></split>

        <div class="ratings-wrapper">
          <h3 class="title">商品评论</h3>
          <rating-select :ratings="ratings" :selectType="selectType" :onlyContent="onlyContent"></rating-select>
          <ul class="ratings-list" v-show="selected_Ratings.length > 0">
            <li class="item" v-for="rating in selected_Ratings">
              <div class="header">
                <span class="time">{{ rating.rateTime | format_date }}</span>
                <img class="headimg" :src="rating.avatar" width="12px"/>
                <span class="uid">{{ rating.username }}</span>
              </div>
              <div class="rating-content">
                <span :class="[ 'icon', rating.rateType == 1 ? 'icon-thumb_down': 'icon-thumb_up' ]"></span>
                <span class="text">{{ rating.text }}</span>
              </div>
            </li>
          </ul>
          <div class="no_data" v-show="selected_Ratings.length == 0">暂无数据</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
// 导入子组件
import cartControl from '../../../public/cart_control/cart_control.vue';
import split from '../../../public/split/split.vue';
import ratingSelect from '../../../public/rating_select/rating_select.vue';
import BScroll from 'better-scroll';

export default {
  data() {
    return {
      foodShow: false,
      selectType: 1,
      onlyContent: false
    };
  },
  props: {
    food: {
      type: Object
    }
  },
  computed: {
    ratings() {
      // 取出商品的评论数据
      return this.food.ratings;
    },
    selected_Ratings() {
      var selected_Ratings = [];
      if (!this.ratings || this.ratings.length === 0) {
        return [];
      }
      if (this.selectType === 2) {
        selected_Ratings = this.ratings;
      } else {
        // 返回符合条件所有元素的数组 | 过滤
        selected_Ratings = this.ratings.filter(rating => {
          return rating.rateType === this.selectType;
        });
      }
      if (this.onlyContent) {
        selected_Ratings = selected_Ratings.filter(rating => {
          return rating.text.length !== 0;
        });
      }
      return selected_Ratings;
    }
  },
  // 调用 vue 生命周期函数（实例已经创建完成之后被调用）
  created() {
    // 监听当前实例上的自定义事件 | 监听子组件派发的事件 | 调用 回调函数
    this.$on('update-selects', this._update_Selects);
    // this.$root.eventHub.$on('update-selects', this._update_Selects);
  },
  methods: {
    show() {
      // 初始化 数据 | 默认值
      this.foodShow = true;
      this.selectType = 2;
      this.onlyContent = false;
      // 修改数据之后 立即使用 $nextTick 方法，获取更新后的 DOM
      this.$nextTick(() => {
        if (!this.foodScroll) {
          this.foodScroll = new BScroll(this.$refs.food_Wrapper, {
            click: true
          });
        } else {
          // 强制 scroll 重新计算
          this.foodScroll.refresh();
        }
      });
    },
    add_First(event) {
      if (!event._constructed) {
        return;
      }
      // 向 vue 已创建的实例 添加、修改数组 或 对象的值 | 使用 Vue.set API
      this.$set(this.food, 'count', 1);   // 初始为 1
      /* 访问 当前组件树的根组件的 eventHub 对象 | 触发事件
       event.target：返回触发此事件的元素 传给 监听事件的回调函数的参数 */
      this.$root.eventHub.$emit('cart_add', event.target);
    },
    // 用于 回调函数
    _update_Selects(selects) {
      this.selectType = selects[0];
      this.onlyContent = selects[1];
      this.$nextTick(() => {
        if (!this.foodScroll) {
          this.foodScroll = new BScroll(this.$refs.food_Wrapper, {
            click: true
          });
        } else {
          // 刷新
          this.foodScroll.refresh();
        }
      });
    }
  },
  // 过滤器
  filters: {
    format_date(time) {
      let date = new Date(time);
      // 据本地时间格式，把 Date 对象转换为字符串
      return date.toLocaleString();
    }
  },
  // 注册子组件
  components: {
    cartControl,
    ratingSelect,
    split
  }
};
</script>

<style type="text/css" lang="less" scoped>
.food {
  position: fixed;   /* 元素的位置相对于浏览器窗口是固定位置 */
  top: 0;
  left: 0;
  background: #fff;
  width: 100%;
  height: 100%;
  &.move-enter-active, &.move-leave {
    transition: all 1s;
    transform: translate3d(0, 0, 0);
  }
  &.move-enter, &.move-leave-active {
    transition: all 1s;
    transform: translate3d(100%, 0, 0);
  }
  .content {
    padding-bottom: 60px;
    .header-image {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 100%;   /* 配合 height: 0 使用，可实现高度 等于 宽度 */
      .img {
        position: absolute;
        top: 0;
        left: 0;
        display: block;
        width: 100%;
        height: 100%;
      }
      .back-btn {
        position: absolute;
        top: 0;
        left: 0;
        font-size: 20px;
        color: #fff;
        padding: 10px;
      }
    }
    .base-info {
      position: relative;
      padding: 18px;
      .name {
        font-size: 14px;
        color: rgb(7, 17, 27);
        font-weight: 700;
        line-height: 1;   /* 设置数字，此数字会与当前的字体尺寸相乘来设置行间距。 */
        margin-bottom: 8px;
      }
      .count-wrapper {
        font-size: 0;
        color: rgb(147, 153, 159);
        line-height: 1;
        margin-bottom: 18px;
        .left {
          font-size: 10px;
          margin-right: 12px;
        }
        .right {
          font-size: 10px;
        }
      }
      .price-wrapper {
        font-size: 0;
        height: 24px;
        line-height: 24px;
        .now_price {
          font-size: 14px;
          color: rgb(240, 20, 20);
          margin-right: 12px;
          small {
            font-size: 10px;
          }
        }
        .old_price {
          font-size: 10px;
          color: rgb(147, 153, 159);
          font-weight: 700;
          text-decoration: line-through;
        }
      }
      .add-cart {
        position: absolute;
        right: 18px;
        bottom: 18px;
        font-size: 10px;
        color: rgb(255, 255, 255);
        background: #009688;
        width: 74px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        border-radius: 12px;   /* 元素添加圆角效果 */
        opacity: 1;
        &.fade-enter, &.fade-leave-active {
          opacity: 0;
          transition: all .2s;
        }
      }
      .control-wrapper {
        position: absolute;
        right: 18px;
        bottom: 18px;
      }
    }
    .desc-wrapper {
      padding: 18px;
      .title {
        font-size: 14px;
        line-height: 1;
        font-weight: 700;
        color: rgb(7, 17, 27);
        margin-bottom: 6px;
      }
      .desc {
        font-size: 12px;
        font-weight: 200;
        line-height: 24px;
        color: #009688;
        padding: 0 8px;
      }
    }
    .ratings-wrapper {
      .title {
        font-size: 14px;
        font-weight: 700;
        color: rgb(7, 17, 27);
        line-height: 1;
        padding-top: 18px;
        padding-left: 18px;
      }
      .ratings-list {
        .item {
          padding: 16px 18px;
          border-bottom: 1px solid rgba(7, 17, 27, .1);
          .header {
            font-size: 0;
            height: 12px;
            line-height: 12px;
            .time {
              font-size: 10px;
              float: left;
              color: rgb(147, 153, 159);
            }
            .headimg {
              float: right;   /* 右侧浮动 */
              display: inline-block;
              width: 12px;
              height: 12px;
              border-radius: 50%;
              margin-left: 6px;
            }
            .uid {
              font-size: 10px;
              float: right;
              color: rgb(147, 153, 159);
            }
          }
          .rating-content {
            margin-top: 6px;
            font-size: 0;
            .icon {
              font-size: 12px;
              &.icon-thumb_down {
                color: rgb(147, 153, 159);
              }
              &.icon-thumb_up {
                color: rgb(0, 160, 220);
              }
            }
            .text {
              font-size: 12px;
              color: rgb(7, 17, 27);
              line-height: 16px;
              margin-left: 6px;
            }
          }
        }
      }
      .no_data {
        padding: 16px 18px;
        font-size: 12px;
        color: rgb(147, 153, 159);
      }
    }
  }
}
</style>
