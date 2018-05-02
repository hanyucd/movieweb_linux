<template>
  <div id="movies">
    <div class="error" v-if="error.isError">{{ error.errData }}</div>
    <div class="title">
      <span>电影票 - 杭州</span>
    </div>
    <!-- 正在热映 -->
    <div id="now-playing">
      <div class="mob-title">
        正在热映
      </div>
      <div class="mob-main">
        <ul class="lists clearfix">
          <li class="list-item" v-for="(item, index) in in_Theaters.subjects" :key="index">
            <!-- 命名视图 -->
            <router-link :to="{name: 'movieDetail', params: {movieID: item.id}}" tag="div" class="item-content">
              <img class="movie-img" :src="item.images.medium"/>
              <div class="item-title">
                {{ item.title }}
              </div>
            </router-link>
            <p class="item-rating">
              <span class="rating-score">{{ item.rating.average !== 0 ? '评分：' + item.rating.average : '暂无评分' }}</span>
            </p>
          </li>
        </ul>
      </div>
    </div>
    <!-- 分界线 -->
    <div id="sub-line"></div>

    <!-- 即将上映 -->
    <div class="upComing">
      <div class="mob-title">
        即将上映
      </div>
      <div class="mob-main">
        <ul class="lists clearfix">
          <li class="list-item" v-for="(item, index) in comingSoon.subjects" :key="index">
            <router-link :to="{ name: 'movieDetail', params: {movieID: item.id}}" tag="div" class="item-content">
              <img class="movie-img" :src="item.images.medium"/>
              <div class="item-title">
                {{ item.title }}
              </div>
            </router-link>
            <p class="item-collect">
              {{ item.collect_count + '人想看' }}
            </p>
          </li>
        </ul>
      </div>
    </div>
    <!-- 加载组件 -->
    <Loading v-show="isLoading"></Loading>
  </div>
</template>

<script>
import Loading from '@/components/Loading';
import { theaters_API, comingSoon_API } from '@/store/fetch';
import { fetch } from '@/store/fetch';

export default {
  data() {
    return {
      // 正在热映
      in_Theaters: {
        count: 14,
        city: '杭州',
        subjects: []
      },
      // 即将上映
      comingSoon: {
        count: 14,
        city: '杭州',
        subjects: []
      },
      isLoading: true,   // 是否加载
      error: {
        isError: false,
        errData: '获取数据失败, 刷新试试 ...'
      }
    }
  },
  created() {
    this.getHotMovies();
    this.getComingMovies();
  },
  methods: {
    // 获取正在热映电影
    getHotMovies() {
      let params = {
        count: this.in_Theaters.count,
        city: this.in_Theaters.city
      }
      fetch(theaters_API, params).then(res => {
        if (Array.isArray(res.data.subjects)) {
          this.in_Theaters.subjects = [...res.data.subjects];
          // console.log('获取正在热映数据成功!');
          this.isLoading = false;
        }
      }).catch(error => {
        this.isLoading = false;
        this.error.isError = true;
        console.log('获取正在热映数据失败!');
      });
    },
    getComingMovies() {
      let params = {
        count: this.comingSoon.count,
        city: this.comingSoon.city
      };
      fetch(comingSoon_API, params).then(res => {
        if (Array.isArray(res.data.subjects)) {
          this.comingSoon.subjects = [...res.data.subjects];
          // console.log('获取即将上映数据成功!');
          this.isLoading = false;
        }
      }).catch(error => {
        this.isLoading = false;
        this.error.isError = true;
        console.log('获取即将上映数据失败!');
      })
    }
  },
  components: {
    Loading
  }
}
</script>

<style scoped>
#movies {
  padding-bottom: .5rem;
}
#movies > .error {
  height: .5rem;
  line-height: .5rem;
  text-align: center;
  font-size: .2rem;
  font-weight: bold;
  color: #000;
}
.title {
  margin-top: .06rem;
  padding-left: .06rem;
  font-size: .18rem;
  font-weight: bold;
  height: .3rem;
  line-height: .3rem;
}
#now-playing {
  margin-top: .15rem;
}
.mob-title {
  position: relative;
  font-size: .16rem;
  padding-left: .15rem;
  height: .3rem;
  line-height: .3rem;
  color: #27a;
  border-bottom: 1px solid #eee;
  background: #f0f3f5;
}

/* 正在热映样式 */
.mob-main {
  margin-top: .3rem;
  padding: 0 .06rem;
}
/* 清除浮动 */
.mob-main .clearfix::after {
  content: '';
  display: block;
  clear: both;
}
.mob-main .list-item {
  float: left;
  margin: .1rem;
}
.list-item .item-content {
  position: relative;
  width: 1.7rem;
  height: 2.2rem;
  cursor: pointer;
}
.item-content img {
  width: 100%;
  height: 100%;
}
.item-content .item-title {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: .3rem;
  line-height: .3rem;
  font-size: .15rem;
  letter-spacing: 2px;
  font-weight: bold;
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #fff;
  background: #27a;
  opacity: .8;
  border-radius: 3px 3px 0 0;
  transition: height .5s;
}
.item-content:hover .item-title {
  height: 1rem;
  line-height: 1rem;
}
.item-rating {
  text-align: center;
}
.item-rating > .rating-score {
  font-size: .15rem;
  font-weight: bold;
  color: #e09015;
  line-height: 2;
}

/* 分界线 */
#sub-line {
  width: 100%;
  height: .5rem;
  background: #f0f3f5;
  margin: .5rem 0;
}

/* 即将上映 */
.upComing {
}
.item-collect {
  text-align: center;
  font-size: .15rem;
  font-weight: bold;
  color: #e09015;
  line-height: 2;
}
</style>
