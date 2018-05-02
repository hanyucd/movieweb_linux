<template>
  <div id="search-result">
    <div class="search-total" v-if="result.title">
      <span>{{ result.title }}</span>
      <span>共 {{ result.total }} 个</span>
    </div>

    <ul class="result-list" v-infinite-scroll="getSearch" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
      <li v-for="(item, index) in result.subjects" :key="index">
        <router-link class="info-img" :to="{ name: 'movieDetail', params: {movieID: item.id} }">
          <img :src="item.images.small" alt="image error"/>
        </router-link>
        <div class="info">
          <h2>{{ item.title }}</h2>
          <p class="rating">评分: <span class="info-text">{{ item.rating.average }}</span></p>
          <p>导演:
            <span class="info-text" v-for="(director, index) in item.directors">
              {{ director.name }} {{ index < item.directors.length - 1 ? ' / ' : ''  }}
            </span>
          </p>
          <p>主演:
            <span class="info-text" v-for="(actor, index) in item.casts">
              {{ actor.name }} {{ index < item.casts.length - 1 ? ' / ' : '' }}
            </span>
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
// 加载更多的插件
import infiniteScroll from 'vue-infinite-scroll';
import { movieSearch_API } from '@/store/fetch';
import { fetch } from '@/store/fetch';
export default {
  directives: {
    infiniteScroll
  },
  data() {
    return {
      result: {
        subjects: [],
        title: '',
        total: null
      },
      busy: false   // 无限滚动是否禁止，true：禁止
    }
  },
  watch: {
    // 路由参数变化时执行
    $route() {
      this.result.subjects = [];
      this.getSearch();
    }
  },
  methods: {
    getSearch() {
      let searchText = this.$route.query.q;
      // 搜索结果开始处
      let start = this.result.subjects.length;
      let params = { start };
      fetch(movieSearch_API + searchText, params).then(res => {
        this.result.title = res.data.title;
        this.result.total = res.data.total;
        this.result.subjects = this.result.subjects.concat(res.data.subjects);

        // 加载结果 小于 搜索总数时开启底部加载
        this.result.subjects.length < this.result.total
          ? this.busy = false
          : this.busy = true;

        // console.log('成功');
      }).catch(error => {
        console.log('加载失败...');
      });
    }
  }
}
</script>

<style scoped>
#search-result {
  padding-bottom: .5rem;
}
.search-total {
  height: .4rem;
  line-height: .4rem;
  background: #f0f3f5;
  padding: 0 .5rem;
}
.search-total span:last-child {
  color: #27a;
}
.result-list {
  margin-top: .2rem;
  padding: 0 20px;
}
.result-list li {
  height: 3rem;
  background: #f0f3f5;
  padding: 10px;
}
.result-list .info-img {
  display: inline-block;
  width: 2rem;
  height: 100%;
}
.info-img > img {
  width: 100%;
  height: 100%;
}
.info-img > img:hover {
  opacity: .7;
}
.result-list .info {
  display: inline-block;
  height: 100%;
  vertical-align: top;
  margin-left: .5rem;
}
.info > h2 {
  margin-bottom: 10px;
  color: #27a;
}
.info > p {
  padding-bottom: 10px;
}
.info-text{
  color: #27a;
}
</style>
