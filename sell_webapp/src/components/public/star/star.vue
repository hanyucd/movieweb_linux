<template>
	<div class="star_wrapper" :class="star_type">
		<span class="star_item" v-for="item of items" :class="item"></span>
	</div>
</template>

<script>
// 常量 | 星星总数
const STAR_LENGTH = 5;

export default {
	// 接受父组件传参的 属性
	props: {
		// 验证类型为 Number 类型
		size: Number,
		score: Number
	},
	// 计算属性
	computed: {
		// 可以像绑定普通属性一样在模板中绑定计算属性
		star_type() {
			return 'star-' + this.size;   // 获取父组件传来的 size
		},
		items() {
			// let 命令，用来声明的变量 只在 let 命令所在的代码块内有效。
			let result = [];
			// let score = Math.floor(this.score * 2) / 2;
			// 取出父组件传来的 数据
			let score = this.score - 2;
			// 判断是否有半星 | Boolean 类型
			let has_decimal = score % 1 !== 0;
			// 求有几个全星 | 方法 floor：返回小于或等于指定数的最小整数
			let star_integer = Math.floor(score);
			for (let i = 0; i < star_integer; i++) {
				// push() 方法向数组的末尾追加一个或多个元素
				result.push('on');
			}
			if (has_decimal) {
				result.push('half');
			}
			while (result.length < STAR_LENGTH) {
				result.push('off');
			}
			// 返回数组
			return result;
		}
	}
};
</script>

<style type="text/css" lang="less" scoped>
.star_wrapper {
	display: inline-block;
	text-align: center;
}

.star-20 {
	.star_item {
		display: inline-block;   /* 显示为：行内块级 | 可设置宽高 */
		width: 20px;
		height: 20px;
		margin-right: 12px;
		background-size: 100% 100%;   /* 将计算相对于背景定位区域的百分比 */
		background-repeat: no-repeat;
	}
	.on {
		background-image: url('./star48_on@3x.png');
	}
	.half {
		background-image: url('./star48_half@3x.png');
	}
	.off {
		background-image: url('./star48_off@3x.png');
	}
}

.star-15 {
	.star_item {
		display: inline-block;
		width: 15px;
		height: 15px;
		margin-rigth: 6px;
		background-size: 100% 100%;
		background-repeat: no-repeat;
	}
	.on {
		background-image: url('./star48_on@3x.png');
	}
	.half {
		background-image: url('./star48_half@3x.png');
	}
	.off {
		background-image: url('./star48_off@3x.png');
	}
}

.star-12 {
	.star_item {
		display: inline-block;
		width: 12px;
		height: 12px;
		margin-right: 3px;
		background-size: 100% 100%;
		background-repeat: no-repeat;
	}
	.on {
		background-image: url('./star48_on@3x.png');
	}
	.half {
		background-image: url('./star48_half@3x.png');
	}
	.off {
		background-image: url('./star48_off@3x.png');
	}
}
</style>
