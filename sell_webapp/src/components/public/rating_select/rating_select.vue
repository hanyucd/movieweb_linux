<template>
  <div class="rating_select">
    <div class="options">
      <!-- options 子组件 1 -->
      <div class="option normal" :class="{ selected: selectType === 2 }" @click="change_Type(2, $event)">
        <span class="text">{{ block[0] }}</span>
        <span class="num">{{ ratings.length }}</span>
      </div>
      <!-- options 子组件 2 -->
      <div class="option normal" :class="{ selected: selectType === 0 }" @click="change_Type(0, $event)">
        <span class="text">{{ block[1] }}</span>
        <span class="num">{{ positives.length }}</span>
      </div>
      <!-- options 子组件 3 -->
      <div class="option bad" :class="{ selected: selectType === 1 }" @click="change_Type(1, $event)">
        <span class="text">{{ block[2] }}</span>
        <span class="num">{{ negatives.length }}</span>
      </div>
    </div>

    <div class="only_content" :class="{ selected: onlyContent }" @click="toogle_Content($event)">
      <span class="icon icon-check_circle"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selected_Type: this.selectType,
      selected_Content: this.onlyContent
    };
  },
  props: {
    ratings: {
      type: Array,
      default() {
        return [];
      }
    },
    block: {
      type: Array,
      // 默认值
      default () {
        return ['全部', '推荐', '吐槽'];
      }
    },
    selectType: {
      type: Number,
      default: 2
    },
    onlyContent: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    positives() {
      // 返回符合条件所有元素的数组 | 过滤
      return this.ratings.filter(rating => {
        return rating.rateType === 0;
      });
    },
    negatives() {
      return this.ratings.filter(rating => {
        return rating.rateType === 1;
      });
    }
  },
  methods: {
    change_Type(type, event) {
      if (!event._constructed) {
        return;
      }
      this.selected_Type = type;
      this._update_Selects();
    },
    toogle_Content(event) {
      if (!event._constructed) {
        return;
      }
      this.selected_Content = !this.selected_Content;
      this._update_Selects();
    },
    _update_Selects() {
      // 触发父组件上的事件。附加参数都会传给监听器回调
      this.$parent.$emit('update-selects', [this.selected_Type, this.selected_Content]);
      // this.$root.eventHub.$emit('update-selects', [this.selected_Type, this.selected_Content]);
    }
  }
};
</script>

<style type="text/css" lang="less" scoped>
.rating_select {
  padding: 18px 18px 0 18px;
  border-bottom: 1px solid rgba(77, 85, 93, .2);
  .options {
    font-size: 0;
    padding-bottom: 18px;
    .option {
      display: inline-block;   /* 行内块级元素 */
      font-size: 0;
      padding: 8px 12px;
      border-radius: 2px;
      line-height: 1;
      margin-right: 10px;
      .text {
        font-size: 12px;
        margin-right: 5px;
      }
      .num {
        font-size: 8px;
      }
      &.normal {
        background: rgba(0, 160, 220, .2);
        color: rgb(77, 85, 93);
        &.selected {
          background: rgb(0, 160, 220);
          color: rgb(255, 255, 255);
        }
      }
      &.bad {
        background: rgba(77, 85, 93, .2);
        color: rgb(77, 85, 93);
        &.selected {
          background: rgb(77, 85, 93);
          color: rgb(255, 255, 255);
        }
      }
    }
  }
  .only_content {
    font-size: 0;
    padding: 12px 0;
    border-top: 1px solid rgba(77, 85, 93, .2);
    &.selected {
      .icon {
        color: #009688;
      }
    }
    .icon {
      display: inline-block;
      font-size: 24px;
      color: rgb(147, 153, 159);
      line-height: 24px;
      vertical-align: top;   /* 把元素的顶端与行中最高元素的顶端对齐 */
      margin-right: 5px;
    }
    .text {
      display: inline-block;
      font-size: 12px;
      color: rgb(147, 153, 159);
      line-height: 24px;
    }
  }
}
</style>
