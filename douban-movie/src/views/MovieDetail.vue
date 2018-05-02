<template>
  <div id="movie-detail">
    <div class="error" v-if="error.isError">{{ error.errData }}</div>

    <div v-if="details">
      <div class="back" @click="back()"><返回</div>
      <div class="movie-msg">
        <img :src="details.images.large" />
        <div class="info">
          <h2>{{ details.title }}<span style="padding-left: 10px; font-size: .1rem; opacity: .5;">( {{ details.year }} )</span></h2>
          <p class="rating">评分: <span class="info-text">{{ details.rating.average }}</span></p>
          <p>导演: <span class="info-text">{{ directors }}</span></p>
          <p>主演: <span class="info-text">{{ casts }} ...</span></p>
          <p>类型: <span class="info-text">{{ types }}</span></p>
        </div>
      </div>

      <div class="story-info">
        <p>{{ details.title }}的剧情介绍：</p>
        <p>{{ details.summary }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from '@/components/Loading';
import { movieDetail_API } from '@/store/fetch';
import { fetch } from '@/store/fetch';

export default {
  data() {
    return {
      details: null,
      error: {
        isError: false,
        errData: '获取数据失败, 刷新试试 ...'
      }
    }
  },
  computed: {
    // 导演
    directors() {
      return this.details.directors[0].name;
    },
    // 主演
    casts() {
      let new_casts = this.details.casts.map(value => {
        return value.name;
      });
      return new_casts.join(' / ');
    },
    // 类型
    types() {
      return this.details.genres.join(' / ');
    }
  },
  mounted() {
    this.getDetail();
  },
  methods: {
    getDetail() {
      // 路由参数
      let movieID = this.$route.params.movieID;
      fetch(movieDetail_API + movieID).then(res => {
        this.details = res.data;
      }).catch(err => {
        this.error.isError = true;
        console.log('获取失败。')
      });
    },
    // 后退
    back() {
      this.$router.go(-1);
    }
  }
}
</script>

<style scoped>
#movie-detail {
  margin: 0 auto;
  width: 8rem;
  padding-bottom: .5rem;
}
#movie-detail > .error {
  width: 100%;
  height: 1rem;
  line-height: 1rem;
  text-align: center;
  font-size: .2rem;
  font-weight: bold;
  color: #000;
}
.back {
  display: inline-block;
  width: .5rem;
  height: .4rem;
  line-height: .4rem;
  font-size: .1rem;;
  letter-spacing: 2px;
  color: #27a;
  cursor: pointer;
}
.movie-msg {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background: #f0f3f5;
  height: 3.2rem;
}
.movie-msg > img {
  width: 2rem;
  height: 3rem;
}
.movie-msg > .info {
  width: 5rem;
}
.info > h2 {
  margin-bottom: 20px;
}
.info > .rating {
  font-size: .2rem;
  padding-bottom: 8px;
}
.info .info-text {
  color: #27a;
}
.story-info {
  margin-top: 20px;
}
.story-info p:first-child {
  font-size: .2rem;
  color: #072;
  padding-bottom: 10px;
}
.story-info p:last-child {
  text-indent: 15px;
  letter-spacing: 3px;
}
</style>
