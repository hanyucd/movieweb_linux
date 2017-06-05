<template>
  <div class="goods">
    <!-- .goods 的子元素 1 -->     <!-- 值 不可使用短横线拼接命名的方式 -->
    <div class="menu-wrapper" ref="menuWrapper">   <!-- ref属性：提供 vue 可操作 Dom | vue 内部会获取所有有 ref 属性元素. -->
      <ul>
        <li class="menu-item" v-for="(item, index) in goods"
        :class="{ active: currentIndex === index}" @click="select_Menu(index, $event)">   <!-- $event:访问原生 DOM 事件对象 -->
          <span class="title">
            <icon-type v-show="item.type > 0" :size="12" :index="item.type"></icon-type>
            <span class="text">
              {{ item.name }}
            </span>
          </span>
        </li>
      </ul>
    </div>
    <!-- .goods 的子元素 2 -->      <!-- 值 不可使用 短横线拼接命名的方式 -->
    <div class="goods-wrapper" ref="goodsWrapper">   <!-- ref属性：提供 vue 可操作元素 Dom | vue 内部会获取所有有 ref 属性元素.-->
      <ul>
        <!-- 当 v-for 用于元素的时候，引用信息将是包含 DOM 节点的 数组 -->
        <li class="food-list" v-for="item of goods" ref="goodsList">
          <h1 class="title">{{ item.name }}</h1>
          <ul>
            <li class="food" v-for="food of item.foods" @click="show_Food(food, $event)">
              <div class="img">
                <img :src="food.icon" alt="food.name"/>
              </div>
              <div class="content">
                <h1 class='name'>{{ food.name }}</h1>
                <p class="desc">{{ food.description }}</p>
                <div class="count-wrapper">
                  <span class="mon">月售 {{ food.sellCount }}</span>
                  <span>好评率 {{ food.rating }}%</span>
                </div>
                <div class="price-wrapper">
                  <span class="now_price"><small>￥</small>{{ food.price }}</span>
                  <span class="old_price" v-show="food.oldPrice"><small>￥</small>{{ food.oldPrice }}</span>
                </div>
                <div class="cart_control-wrapper">
                  <cart-control :food="food"></cart-control>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shop-cart :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shop-cart>
    <food :food="selectedFood" ref="food"></food>
  </div>
</template>

<script>
// 实现滚动效果，且 没有滚动条
import BScroll from 'better-scroll';
// 导入子组件
import iconType from '../../public/iconType/iconType.vue';
import cartControl from '../../public/cart_control/cart_control.vue';
import shopCart from './shopcart/shopcart.vue';
import food from './food/food.vue';

const ERR_OK = 0;

export default {
  data() {
    return {
      goods: [],
      listHeight: [],
      scrollY: 0,
      selectedFood: {}
    };
  },
  // 接收来自父组件的数据
  props: {
    // 验证类型为 Object
    seller: Object
  },
  // 计算属性
  computed: {
    currentIndex() {
      for (let i = 0; i < this.listHeight.length; i++) {
        // 获取每一个 区间
        let height_1 = this.listHeight[i];
        // 注：（超出数组的索引值时，返回 undefinde | 布尔值为 false）
        let height_2 = this.listHeight[i + 1];
        // 当区间未到最后的值 或者 当前位置 的 Y 轴值，在区间范围内
        if (!height_2 || this.scrollY >= height_1 && this.scrollY < height_2) {
          return i;
        }
      }
      return 0;
    },
    selectFoods() {
      let foods = [];
      // 遍历取出 商品分类 的数据
      this.goods.forEach(good => {
        // 遍历取出 每个商品 的数据
        good.foods.forEach(food => {
          if (food.count) {
            foods.push(food);
          }
        });
      });
      return foods;
    }
  },
  // 调用 vue 生命周期函数（实例已经创建完成之后被调用）
  created() {
    // 在一个Vue实例内使用 $http 发送请求，使用 then方法来处理响应结果 | vue-resource 实现
    this.$http.get('./api/goods').then(res => {
      // let 声明的变量，只在块内有效
      // 返回响应体（object类型）
      let json = res.body;
      // console.log(json.data);
      if (json.errno === ERR_OK) {
        // 获取 （数组类型）
        this.goods = json.data;
        // 对 DOM 一系列的 js 操作都要放进 Vue.nextTick() 的回调函数中
        this.$nextTick(() => {   // 修改数据之后 立即使用这个方法，获取更新后的 DOM
        // 在这个函数中调用 防止 内容还未加载完 就执行，获取不到元素的高度导致无法滑动
          this._initScroll();
          this._countHeight();
        });
      }
    }, res => {
      // 响应失败回调
    });
  },
  methods: {
    _initScroll() {
      // 获取 Dom 对象
      this.menuScroll = new BScroll(this.$refs.menuWrapper, {
        click: true   // 派发点击事件
      });
      this.goodsScroll = new BScroll(this.$refs.goodsWrapper, {
        click: true,
        probeType: 3   //  3: scroll 滚动时 实时获取 滚动的位置
      });
      // 监听滚动事件 | 获取当前位置
      this.goodsScroll.on('scroll', (pos) => {
        // 获取滚动 实时的 y轴位置 | 四舍五入取绝对值
        this.scrollY = Math.abs(Math.round(pos.y));
        // this.scrollY = pos.y;
        // console.log('y轴位置：' + this.scrollY);
      });
    },
    // 获取区间高度 数组
    _countHeight() {
      // 获取 所有 包含 ref="goodsList" 的 Dom 元素 | 数组
      let goodsList = this.$refs.goodsList;
      let height = 0;
      // 向数组末尾添加元素
      this.listHeight.push(height);
      for (let i = 0; i < goodsList.length; i++) {
        // 获取单个 dom 元素
        let item = goodsList[i];
        // 在页面上返回 内容 的可视高度
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    },
    // 单击菜单栏 ，右侧相应联动
    select_Menu(index, event) {
      // 原生js 事件对象 无这个 _constructed 属性
      if (!event._constructed) {
        return;   // 退出函数
      }
      let goodsList = this.$refs.goodsList;
      let el = goodsList[index];
      // 滚动到某个元素 持续时间 1s
      this.goodsScroll.scrollToElement(el, 1000);
    },
    show_Food(food, event) {
      if (!event._constructed) {
        return;
      }
      this.selectedFood = food;
      // 父组件 调用 子组件 方法
      this.$refs.food.show();
    }
  },
  // 注册组件
  components: {
    iconType,
    shopCart,
    cartControl,
    food
  }
};
</script>

<style type="text/css" lang="less" scoped>
.goods {
  display: flex;   /* 弹性布局 */
  position: absolute;   /* 绝对定位 */
  top: 175px;
  bottom: 46px;  /* 下边距 */
  width: 100%;
  overflow-y: hidden;   /* 指定如果溢出了元素的内容区：裁剪（上下）内容 - 不提供滚动机制 */
  /* .goods 的子元素 1 */
  .menu-wrapper {
    /*flex: 0 0 80px;*/
    flex-basis: 80px;   /* 定义了在分配多余空间之前，项目占据的主轴空间 | 占据固定空间(宽度)：80px */
    background: #f3f5f7;
    .menu-item {
      display: table;
      height: 54px;
      width: 56px;
      line-height: 14px;   /* 行高是指文本行基线间的垂直距离 */
      padding: 0 12px;
      .title {
        border-bottom: 1px solid rgba(7, 17, 27, .1);
        display: table-cell;
        width: 56px;
        font-size: 0;
        vertical-align: middle;
        .text {
          font-size: 12px;
          color: #009688;
        }
      }
      &.active {
        position: relative;
					margin-top: -1px;
					z-index: 10;
					font-weight: 700;
					background-color: #fff;
          .title {
            border-bottom: none;
          }
      }
    }
  }
  /* .goods 的子元素 2 */
  .goods-wrapper {
    flex: 1;   /* 等分剩余空间 */
    .food-list {
      .title {
        font-size: 12px;
        color: rgb(147, 153, 159);
        height: 26px;
        line-height: 26px;
        border-left: 2px solid #d9dde1;
        background: #f3f5f7;
      }
      .food {
        display: flex;
        margin: 0 18px;
        padding: 18px 0;
        position: relative;
        &:not(:last-child):after {   /* 选取 除 最后一个子元素之外的所有子元素 | 之后插入内容*/
          content: "";
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 1px;
          background: rgba(7, 17, 27, .1);
        }
        .img {
          flex: 0 0 50px;
          img {
            width: 100%;
            border-radius: 20%;
          }
        }
        .content {
          flex: 1;   /* 等分剩余空间 */
          margin-left: 10px;
          .name {
            font-size: 14px;
            /*font-weight: bold;*/
            color: rgb(7, 17, 27);
            line-height: 1;   /* 此数字会与当前的字体尺寸相乘来设置行间距 */
            margin-top: 2px;
          }
          .desc {
            font-size: 10px;
            color: rgb(147, 153, 159);
            line-height: 1;
            margin-top: 8px;
          }
          .count-wrapper {
            font-size: 10px;
            color: rgb(147, 153, 159);
            line-height: 1;
            margin-top: 8px;
            .mon {
              margin-right: 12px;
            }
          }
          .price-wrapper {
            margin-top: 8px;
            .now_price {
              font-size: 16px;
              line-height: 1;
              color: rgb(240, 20, 20);
              small {
                font-size: 5px;
              }
            }
            .old_price {
              font-size: 10px;
              color: rgb(147, 153, 159);
              line-height: 1;
              font-weight: 700;
              text-decoration: line-through;   /* 定义穿过文本的一条线 */
            }
          }
          .cart_control-wrapper {
            position: absolute;
            right: 0;
            bottom: 0;
          }
        }
      }
    }
  }
}
</style>
