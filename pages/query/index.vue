<template>
  <!-- 词根词缀查询页面 -->

  <div>
    <div class="container">
      <div class="header">
        <el-select v-model="currentMode" placeholder="请选择">
          <el-option
            v-for="item in modeOption"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <input type="text" v-model="searchContent" placeholder="请输入您要查询的内容,回车即可确认" @change="search"></input>
        <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      </div>
      <div style="margin: 3px 0;font-size: small;color: #909399">查询结果:{{ page.total }}条</div>
      <div class="main" ref="dataList">
        <root-card v-for="item in records" :type="item.type" :word="item.word" :mean="item.mean"
                   :link="item.link" :high-content="searchContent"></root-card>
      </div>
    </div>
  </div>

</template>

<script>
import rootApi from "@/api/RootApi";

// 空白符号 与后端约定,这个符号代替空白进行传递
const empty = "23456746756"

export default {
  name: "index",
  data() {
    return {
      // 搜索的一个内容
      searchContent: "",
      // 可选的一个模式数组
      modeOption: [{
        value: -1,
        label: "所有类型"
      },
        {
          value: 1,
          label: "前缀"
        }, {
          value: 2,
          label: "后缀"
        }, {
          value: 3,
          label: "词根"
        }, {
          value: 4,
          label: "origin"
        }
      ],
      // 当前选中的模式
      currentMode: -1,
      current: 1,
      size: 20,
      // 是否正在向后端请求数据中
      loading: false,
      // 判断是否已经加载到了最后一页了
      isEnd: false,
      // 提示用户 "没有更多数据了",这段话的展示,加个锁
      // 这个只是用来保存上一次加载的时间戳,然后以用时间戳之间的距离的方式来加锁
      loadLock: 0,
      // 用以存放查询出来的结果
      records: [{
        "link": "",
        "mean": "",
        "type": 0,
        "word": ""
      }],
      // 最近的一次查询的page对象
      page: {}
    }
  },
  methods: {
    // 根据既定条件,查询获取数据
    getData() {
      this.loading = true
      // 对查询的内容进行判断是否为空字符串,如果是则替换为 空字符所代表的符号
      let search = this.searchContent ? this.searchContent : empty

      rootApi.search(this.current, this.size, this.currentMode, search).then(res => {
        // 将查询结果以及这次的page给赋值或添加进去
        this.records.push(...res.data.records)
        this.page = res.data
        // 以此判断是否已经到了最后一页
        this.isEnd = res.data.current >= res.data.pages
        this.loading = false
      })
    },
    search() {
      this.records = []
      this.current = 1
      this.getData()
    },
    // list列表 滚动条滚动事件
    scroll() {
      let tableBodyDom = this.$refs.dataList
      tableBodyDom.addEventListener('scroll', () => {
        // 滚动条总高度 减去 窗口高度 减去 已卷入的高度 小于 50px 就加载新数据
        if ((tableBodyDom.scrollHeight - tableBodyDom.clientHeight - tableBodyDom.scrollTop) < 50) {
          // 进行一个节流限制,如果是正在加载中,则不进行数据的请求加载
          if (!this.loading) {
            ++this.current
            if (this.isEnd && this.current > 1) {
              // 如果已经加载到了最后一页,则不继续向下加载了
              // 之所以要判断current>1 是为了防止条件搜索失效
              // 加个3s中的锁,防止疯狂弹出
              if (new Date().getTime() - this.loadLock > 3000) {
                this.$message("没有更多数据了!")
                this.loadLock = new Date().getTime()
              }
              return
            }
            this.getData()
          }
        }
      })
    }
  },
  created() {
    this.records = []
    this.getData()
  },
  mounted() {
    // 给list添加滚动事件
    this.$refs.dataList.addEventListener("scroll", this.scroll)
  }
}
</script>

<style scoped>

.container {
  /* 使用绝对布局,以及两个边框的固定,将页面容器给撑起来 */
  position: absolute;
  top: 0;
  bottom: 10px;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

input {
  font-size: large;
  text-align: center;
  border-radius: 10px;
  padding: 3px;
  width: 60%;
}

/* 搜索的头部区域 */
.header {
  margin-top: 5px;
  width: 70%;
  display: flex;
  justify-content: space-around;
}

.main {
  /*margin-top: 10px;*/
  width: 80%;
  /* 占据所有剩余空间 */
  flex-grow: 1;
  /*height: 800px;*/
  overflow-y: auto;
  padding-right: 5px;
}

</style>
