<template>
  <div id="douban-header">
    <!-- 搜索栏 -->
    <div id="nav-search">
      <a href="/">豆瓣电影</a>
      <!-- Enter键 被松开触发 -->
      <input @keyup.enter="search()" v-model.trim="searchContent" maxlength="50"
        class="search-input" autofocus placeholder="搜索电影、综艺、影人 ..."
      />
    </div>

    <!-- 导航栏 -->
    <ul id="nav-list">
      <li v-for="(item, index) in items" @click="select(item)"
        :class="{ 'active': item.isActive }" :key="index">
        <router-link :to="item.path">{{ item.title }}</router-link>
      </li>
    </ul>

  </div>
</template>

<script>
export default {
  data() {
    return {
      searchContent: '',
      items: [
        { title: '电影', path: '/', isActive: true},
        { title: '电视剧', path: '/tv' },
        { title: '排行榜', path: '/chart' },
        { title: '影评', path: '/comment' },
      ],
    }
  },
  methods: {
    search() {
      this.$router.push({path: '/movie/search', query: {q: this.searchContent}});
    },
    select(item) {
      this.items.forEach((value) => {
        this.$set(value, 'isActive', false);
      });
      this.$set(item, 'isActive', true);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#douban-header {
  position: fixed;
  top: 0px;
  left: 0;
  z-index: 999;
  width: 100%;
  min-width: 320px;
  background: #f0f3f5;
}

/* 搜索栏 */

#nav-search {
  width: 100%;
  height: .7rem;
  line-height: .7rem;
  border-bottom: 1px solid #ccc;
}
#nav-search a {
  display: inline-block;
  width: 20%;
  line-height: .5rem;
  padding-left: .18rem;
  font-size: .18rem;
  font-weight: bold;
  color: #27a;
}
#nav-search > .search-input {
  border: none;
  width: 50%;
  height: .3rem;
  border-radius: .14rem;
  background: #fff;
  padding-left: .1rem;
}

/* 导航栏 */

#nav-list {
  padding: 0 .05rem;
}
#nav-list > li {
  position: relative;
  display: inline-block;
  width: .77rem;
  height: .4rem;
  line-height: .4rem;
  font-size: .14rem;
  text-align: center;
}
#nav-list > li::before {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 0;
  height: 2px;
  background: #27a;
  width: 100%;
  transform: scaleX(0);
  transition: transform .5s;
}
#nav-list > li.active::before {
  transform: scaleX(1);
}
#nav-list a {
  display: inline-block;
  width: 100%;
  color: #27a;
}
</style>
