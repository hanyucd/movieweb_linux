<template>
  <div class="seller" ref="seller_Wrapper">
    <div class="seller-content">
      <div class="header">
        <h3 class="name">{{ seller.name }}</h3>
        <div class="rating">
          <star :size="15" :score="seller.score"></star>
          <span class="rating_num">( {{ seller.ratingCount }} )</span>
          <span class="seller_num">月售 {{ seller.sellCount }} 单</span>
        </div>

        <div class="deliver">
          <ul class="item">
            <li class="label">起送价</li>
            <li class="text">
              <span class="num">{{ seller.minPrice }}</span>
              <span class="small">元</span>
            </li>
          </ul>
          <ul class="item">
            <li class="label">商家配送</li>
            <li class="text">
              <span class="num">{{ seller.deliveryPrice }}</span>
              <span class="small">元</span>
            </li>
          </ul>
          <ul class="item">
            <li class="label">平均配送时间</li>
            <li class="text">
              <span class="num">{{ seller.deliveryTime }}</span>
              <span class="small">分</span>
            </li>
          </ul>
        </div>

        <div class="collect" v-on:click="toogle_collect">
          <div class='icon' :class="{ active: collected }"></div>
          <span class="text">{{ collect_text }}</span>
        </div>
      </div>

      <split></split>
      <div class="bulletin-wrapper">
        <h3 class="title">公告与活动</h3>
        <div class="bulletin">{{ seller.bulletin }}</div>
        <ul class="supports">
          <li class="item" v-for="support in seller.supports">
            <icon-type :size="16" :index="support.type"></icon-type>
            <span class="text">{{ support.description }}</span>
          </li>
        </ul>
      </div>

      <split></split>
      <div class="pics">
				<div class="title">商家实景</div>
				<div class="pic_Wrapper" ref="pic_Wrapper">
					<div class="pic-list" ref="pic_List">
						<img class="img" v-for="pic in seller.pics" :src="pic" />
					</div>
				</div>
			</div>

      <split></split>
      <div class="seller-info">
        <div class="title">商家信息</div>
        <ul>
          <li class="item" v-for="info in seller.infos">{{ info }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
// 导入子组件
import star from '../../public/star/star.vue';
import split from '../../public/split/split.vue';
import iconType from '../../public/iconType/iconType.vue';

import BScroll from 'better-scroll';

export default {
  data() {
    return {
      collected: false
    };
  },
  computed: {
    collect_text() {
      return this.collected ? '已收藏' : '收藏';
    }
  },
  props: {
    seller: Object
  },
  // 监听某个值（双向绑定）的变化，一旦发生变化，就调用方法
  watch: {
    seller: function() {
      this._initScroll();
      this._initPics();
    }
  },
  // 调用 vue 生命周期函数（实例挂载之后调用） | 执行优先于 watch
  mounted() {
    this._initScroll();
    this._initPics();
  },
  methods: {
    toogle_collect(event) {
      if (!event._constructed) {
        return;
      }
      this.collected = !this.collected;
    },
    _initScroll() {
      this.$nextTick(() => {
        if (!this.sellerScroll) {
          this.sellerScroll = new BScroll(this.$refs.seller_Wrapper, {
            click: true
          });
        } else {
          // 强制 scroll 重新计算 | 刷新
          this.sellerScroll.refresh();
        }
      });
    },
    // 实现 图片横向滚动
    _initPics() {
      this.$nextTick(() => {
        // 图片宽度
        let img_width = 120;
        // 图片边距
        let img_margin = 6;
        // 判断获取的数据 为空时，执行
        if (!this.seller.pics) {
          return;
        }
        // 所有图片内容 宽度
        let wrap_width = (img_width + img_margin) * this.seller.pics.length;
        // console.log('seller长度为：', this.seller.pics.length);
        this.$refs.pic_List.style.width = wrap_width + 'px';
        if (!this.picScroll) {
          this.picScroll = new BScroll(this.$refs.pic_Wrapper, {
            scrollX: true
          });
        } else {
          this.picScroll.refresh();
        }
      });
    }
  },
  // 注册子组件
  components: {
    star,
    split,
    iconType
  }
};
</script>

<style type="text/css" lang="less" scoped>
.seller {
  position: absolute;
  top: 175px;
  left: 0;
  bottom: 0;
  width: 100%;
  overflow: hidden;
  .header {
    padding: 18px;
    .name {
      font-size: 14px;
      font-weight: bold;
      color: rgb(7, 17, 27);
      line-height: 1;
      margin-bottom: 8px;
    }
    .rating {
      font-size: 0;
      height: 18px;
      margin-bottom: 18px;
      .rating_num {
        font-size: 10px;
        display: inline-block;   /* 行内块级元素 */
        color: rgb(77, 85, 93);
        line-height: 18px;
        margin: 0 6px;
        vertical-align: top;
      }
      .seller_num {
        font-size: 10px;
        display: inline-block;
        color: rgb(77, 85, 93);
        line-height: 18px;
        vertical-align: top;
      }
    }
    .deliver {
      display: flex;
      border-top: 1px solid rgba(7, 17, 27, .1);
      padding-top: 18px;
      .item {
        flex-basis: 33.33%;   /* 主轴空间占据 固定空间 */
        text-align: center;
        /* 选择 除最后一个元素 */
        &:not(:last-child) {
          border-right: 1px solid rgba(7, 17, 27, .1);
        }
        .label {
          font-size: 10px;
          color: rgb(147, 153, 159);
          margin-bottom: 4px;
        }
        .text {
          font-size: 0;
          color: rgb(7, 17, 27);
          .num {
            font-size: 24px;
            color: #009688;
          }
          .small {
            font-size: 10px;
          }
        }
      }
    }
    .collect {
      position: absolute;
      top: 18px;
      right: 18px;
      text-align: center;
      .icon {
        width: 48px;
        height: 20px;
        border-radius: 50%;
        background: #d4d6d9;
        margin-bottom: 4px;
        &.active {
          /*background: rgb(240, 20, 20);*/
          background: #009688;
        }
      }
      .text {
        line-height: 10px;
        font-size: 10px;
        color: rgb(77, 85, 93);
      }
    }
  }
  .bulletin-wrapper {
    padding: 18px 18px 0 18px;
    .title {
      font-size: 16px;
      font-weight: 700;
      color: #333;
      margin-bottom: 8px;
    }
    .bulletin {
      font-size: 12px;
      font-weight: 700;
      color: #009688;
      line-height: 24px;
      padding: 0 12px 12px 12px;
    }
    .supports {
      .item {
        font-size: 0;
        border-top: 1px solid rgba(7, 17, 27, .1);
        padding: 16px 12px;
        .text {
          font-size: 12px;
          color: #009688;
          line-height: 16px;
          margin-left: 4px;
        }
      }
    }
  }
  .pics {
    padding: 18px;
    .title {
      font-size: 18px;
      color: #009688;
      font-weight: 700;
      margin-bottom: 12px;
    }
    .pic_Wrapper {
      width: 100%;
      white-space: nowrap; /* 指定元素内的空白: 不会换行 */
      overflow: hidden;
      .pic-list {
        font-size: 0;
        .img {
          display: inline-block;
          width: 120px;
          height: 90px;
          &:not(:last-child) {
            margin-right: 6px;
          }
        }
      }
    }
  }
  .seller-info {
    padding: 18px 18px 0 18px;
    .title {
      color: #009688;
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 12px;
    }
    .item {
      font-size: 12px;
      line-height: 16px;
      border-top: 1px solid rgba(7, 17, 27, .1);
      padding: 16px 12px;
      color: rgb(7, 17, 27);
    }
  }
}
</style>
