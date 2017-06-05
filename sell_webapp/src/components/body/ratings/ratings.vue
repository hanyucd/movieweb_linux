<template>
  <div class="ratings" ref="ratings">
    <div class="ratings-content">
      <div class="score-wrapper">
        <div class="left">
          <div class="score">{{ seller.score }}</div>
          <div class="text">综合评分</div>
          <div class="linght_text">高于周边商家{{ seller.rankRate }}%</div>
        </div>

        <ul class="right">
          <li class="line">
            <span class="label">服务态度</span>
            <star :size="12" :score="seller.serviceScore"></star>
            <span class="score">{{ seller.serviceScore }}</span>
          </li>
          <li class="line">
            <span class="label">菜品满意</span>
            <star :size="12" :score="seller.foodScore"></star>
            <span class="score">{{ seller.foodScore }}</span>
          </li>
          <li class="line">
            <span class="label">送达时间</span>
            <span class="text">{{ seller.deliveryTime }}分钟</span>
          </li>
        </ul>
      </div>

      <split></split>
      <div class="rating-wrapper">
        <rating-select :ratings="ratings" :block="block" :selectType="selectType" :onlyContent="onlyContent"></rating-select>
        <ul class="rating-list">
          <li class="item" v-for="rating of selected_Ratings">
            <div class="headimg">
              <img :src="rating.avatar" />
            </div>
            <ul class="content">
              <li class="time">{{ rating.rateTime | format_date }}</li>
              <li class="name">{{ rating.username }}</li>
              <li>
                <star :size="12" :score="rating.score"></star>
                <span class="light_text">{{ rating.deliveryTime }}分钟送达</span>
              </li>
              <li class="text">{{ rating.text }}</li>
              <li class="line">
                <span :class="[ 'icon', rating.rateType == 1 ? 'icon-thumb_down' : 'icon-thumb_up' ]"></span>
                <span class="food" v-for="name in rating.recommend">{{ name }}</span>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
// 导入子组件
import star from '../../public/star/star.vue';
import split from '../../public/split/split.vue';
import ratingSelect from '../../public/rating_select/rating_select.vue';
import BScroll from 'better-scroll';

// 常量
const ERR_OK = 0;
export default {
  data() {
    return {
      ratings: [],
      block: ['全部', '满意', '不满意'],
      selectType: 2,
      onlyContent: false
    };
  },
  props: {
    seller: Object
  },
  // 调用 vue 生命周期函数 (实例创建成功后调用)
  created() {
    // 发送请求后，使用then方法来处理 响应结果 | vue-resource 实现
    this.$http.get('./api/ratings').then(res => {
      /* let 声明的变量，只在块内有效
      返回响应体（object类型） */
      let json = res.body;
      if (json.errno === ERR_OK) {
        this.ratings = json.data;
        this.$nextTick(() => {
          if (!this.ratingsScroll) {
            this.ratingsScroll = new BScroll(this.$refs.ratings, {
              click: true
            });
          } else {
            // 强制 scroll 重新计算 | 刷新
            this.ratingsScroll.refresh();
          }
        });
      }
    }, res => {
      // 响应失败回调
    });
    // 监听当前实例上的自定义事件 | 监听子组件派发的事件 | 调用 回调函数
    this.$on('update-selects', this._update_Selects);
  },
  methods: {
    _update_Selects(selects) {
      this.selectType = selects[0];
      this.onlyContent = selects[1];
      // 数据改变 获取最新的 DOM
      this.$nextTick(() => {
        // 强制 scroll 重新计算 | 刷新
        this.ratingsScroll.refresh();
      });
    }
  },
  computed: {
    selected_Ratings() {
      let selected_Ratings = [];
      if (this.ratings && this.ratings.length === 0) {
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
  filters: {
    format_date(time) {
      let date = new Date(time);
      // 据本地时间格式，把 Date 对象转换为字符串
      return date.toLocaleString();
    }
  },
  // 注册组件
  components: {
    star,
    split,
    ratingSelect
  }
};
</script>

<style type="text/css" lang="less" scoped>
.ratings {
  position: absolute;
  top: 175px;
  left: 0;
  bottom: 0;
  width: 100%;
  overflow: hidden;
  .ratings-content {
    .score-wrapper {
      display: flex;   /* 弹性布局 */
      padding: 18px 0;
      .left {
        flex-basis: 120px;   /* 占据固定的主轴空间 */
        width: 100%;
        text-align: center;
        line-height: 1;
        padding-right: 24px;
        border-right: 1px solid rgba(7, 17, 27, .2);
        .score {
          font-size: 24px;
          color: #009688;
          line-height: 28px;
          margin-bottom: 6px;
        }
        .text {
          font-size: 12px;
          font-weight: 600;
          color: rgb(7, 17, 27);
          padding-bottom: 8px;
        }
        .linght_text {
          font-size: 10px;
          color: rgba(7, 17, 27, .4);
          padding-bottom: 6px;
        }
      }
      .right {
        flex: 1;   /* 等分剩余空间 */
        text-align: center;
        .line {
          font-size: 0;
          line-height: 1;
          padding: 6px 0;
          .label {
            display: inline-block;
            font-size: 12px;
            color: rgb(7, 17, 27);
            font-weight: 600;
            margin-right: 12px;
            vertical-align: top;
          }
          .score {
            font-size: 12px;
            display: inline-block;
            margin-left: 12px;
            color: #009688;
            vertical-align: top;
          }
          .text {
            font-size: 12px;
            display: inline-block;
            min-width: 103px;
            text-align: left;   /* 文本的水平对齐方式: 排列到左边 */
            color: rgb(147, 153, 159);
            vertical-align: top;
          }
        }
      }
    }
    .rating-wrapper {
      .rating-list {
        padding: 18px;
        .item {
          position: relative;
          border-bottom: 1px solid rgba(7, 17, 27, .2);
          padding: 18px 0;
          .headimg {
            position: absolute;
            width: 28px;
            height: 28px;
            img {
              display: block;
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
          .content {
            padding-left: 40px;
            .time {
              position: absolute;
              top: 1px;
              right: 0;
              font-size: 10px;
              font-size: 200;
              color: rgb(147, 153, 159);
              line-height: 12px;
            }
            .name {
              font-size: 10px;
              line-height: 12px;
              color: rgb(7, 17, 27);
              margin-bottom: 4px;
            }
            .light_text {
              font-size: 10px;
              color: rgba(7, 17, 27, .4);
              padding-bottom: 6px;
            }
            .text {
              font-size: 12px;
              color: rgb(7, 17, 27);
              line-height: 18px;
            }
            .line {
              font-size: 0;
              .icon {
                display: block;
                font-size: 12px;
                line-height: 16px;
                &.icon-thumb_up {
                  color: rgb(0, 160, 220);
                }
                &.icon-thumb_down {
                  color: rgb(183, 187, 191);
                }
              }
              .food {
                font-size: 9px;
                display: inline-block;
                color: rgb(147, 153, 159);
                line-height: 16px;
                border: 1px solid rgba(7, 17, 27, .1);
                border-radius: 2px;
                margin-right: 8px;
                padding: 0 6px;
                margin-bottom: 4px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
