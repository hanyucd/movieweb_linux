<template>
  <span class="icon" :class="icon_style"></span>
</template>

<script>
export default {
  data() {
    return {
      classMap: ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    };
  },
  // 接受父组件传来的 数据
  props: {
    size: Number,
    index: Number
  },
  computed: {
    icon_style() {
      // 返回两个 className
      return this.classMap[this.index] + ' icon-' + this.size;
    }
  }
};
</script>

<style type="text/css" lang="less" scoped>
.icon {
  display: inline-block;
  width: 12px;
  height: 12px;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  vertical-align: top;
  &.icon-12 {
    width: 12px;
    height: 12px;
  }
  &.icon-16 {
    width: 16px;
    height: 16px;
  }
  &.decrease {
		background-image: url('./decrease_2@2x.png');
	}
	&.discount {
		background-image: url('./discount_2@2x.png');
	}
	&.invoice {
		background-image: url('./invoice_2@2x.png');
	}
	&.special {
		background-image: url('./special_2@2x.png');
	}
	&.guarantee {
		background-image: url('./guarantee_2@2x.png');
	}
}
</style>
