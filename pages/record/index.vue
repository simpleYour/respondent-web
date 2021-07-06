<template>
  <!-- 用户答题记录信息的展示与搜索 -->
  <div>
    <div class="container">

      <!-- 查询条件的一个 form -->
      <el-form :inline="true" :model="query" style="margin-top: 8px;margin-left: 5px">
        <el-form-item label="单词本">
          <el-select v-model="query.wordTypeIds" filterable placeholder="答题笔记本" multiple clearable>
            <el-option
              v-for="item in wordTypeData"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="query.startDate"
            format="yyyy-MM-dd"
            type="date"
            placeholder="开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="query.endDate"
            format="yyyy-MM-dd"
            type="date"
            placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-switch
            v-model="query.rankSort"
            @change="switchChange"
            active-text="正确率排序">
          </el-switch>
        </el-form-item>

        <el-form-item>
          <el-button type="success" @click="search">确认搜索</el-button>
        </el-form-item>
      </el-form>
      <div style="margin: -15px 0 3px 0;font-size: small;color: #909399">查询结果:{{ page.total ? page.total : 0 }}条
      </div>

      <div class="list" ref="dataList" v-show="records.length">
        <div class="row" v-for="item in records">
          <div class="typeName">{{ item.typeName }}</div>

          <div class="progress">
            <el-progress :text-inside="true" :stroke-width="26"
                         :percentage="item.accuracy*100" :color="customColors"></el-progress>
          </div>
          <div class="date">{{ item.gmtCreate | date("mm-dd hh:MM") }}</div>
        </div>
      </div>

      <div v-show="!records.length">
        <el-image src="/noSearch.png" style="height: 500px"></el-image>
      </div>

    </div>
  </div>
</template>

<script>
import recordApi from "@/api/RecordApi";
import timeFormat from "@/utils/timeFormat";
import wordTypeApi from "@/api/WordTypeApi";

export default {
  name: "RecordView",
  data() {
    return {
      // 答题单词本的选择
      wordTypeData: [],
      // 分页的相关数据
      current: 1,
      size: 30,
      // 答题记录的查询对象
      query: {
        "dateSort": false,
        "endDate": undefined,
        // 默认查询已结束的答题记录信息
        "isOver": 1,
        "rankSort": undefined,
        "startDate": undefined,
        "wordTypeIds": []
      },
      // 查询的结果,存放列表数组
      records: [{
        "accuracy": 0,
        "dateScope": 0,
        "gmtCreate": "",
        "gmtModified": "",
        "id": "",
        "isOver": 0,
        "num": 0,
        "respondentType": "",
        "typeName": "",
        "wordTypeId": []
      }],
      // 是否正在向后端请求数据中
      loading: false,
      // 判断是否已经加载到了最后一页了
      isEnd: false,
      // 最近查询的一个分页对象
      page: {},
      customColors: [
        {color: '#f56c6c', percentage: 20},
        {color: '#e6a23c', percentage: 40},
        {color: '#6f7ad3', percentage: 60},
        {color: '#1989fa', percentage: 80},
        {color: '#5cb87a', percentage: 100}
      ],
      // 这个只是用来保存上一次加载的时间戳,然后以用时间戳之间的距离的方式来加锁
      loadLock: 0
    }
  },
  methods: {
    // 依据相关查询条件,查询相关的内容
    getData() {
      this.loading = true
      // 向后端去请求数据
      recordApi.searchVo(this.query, this.current, this.size).then(res => {
        this.records.push(...res.data.records)
        // 以此判断是否已经到了最后一页
        this.isEnd = res.data.current >= res.data.pages
        this.page = res.data
        this.loading = false
      })
    },
    //进行条件查询搜索
    search() {
      // 先将相关的数据重置,然后再去请求相关的数据
      this.records = []
      this.current = 1
      this.isEnd = false

      // 请求相关的数据
      this.getData()
    },
    // 初始化相关的数据
    initData() {
      // 日期范围进行一个限制  防止排行榜长期不变
      // this.query.startDate = this.getBeforeDateStr(-10)

      // 使用默认的query对象对应的一个条件,进行初始化查询,因为这个方法都是在created()生命周期调用,故不去特意创建一个默认的query对象了
      this.search()
    },
    // 获取三天前的日期字符串 格式为后端接受的日期字符串格式  day 相隔几天  负数为前几天,正数为后几天
    getBeforeDateStr(day = 0) {
      let targetDayMilliseconds = new Date().getTime() + 1000 * 60 * 60 * 24 * day
      let date = new Date().setTime(targetDayMilliseconds)
      return timeFormat(date, "yyyy-mm-dd")
    },
    // list列表 滚动条滚动事件
    scroll() {
      let tableBodyDom = this.$refs.dataList
      tableBodyDom.addEventListener('scroll', () => {
        // 滚动条总高度 减去 窗口高度 减去 已卷入的高度 小于 50px 就加载新数据
        if ((tableBodyDom.scrollHeight - tableBodyDom.clientHeight - tableBodyDom.scrollTop) < 50) {
          // 进行一个节流限制,如果是正在加载中,则不进行数据的请求加载
          if (!this.loading) {
            console.log("开始判断加载下一页数据")
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
    },
    // 排序按钮切换事件
    switchChange(value) {
      // 一次只使用一种排序方式
      if (value) {
        this.query.rankSort = true
        this.query.dateSort = undefined
      } else {
        this.query.rankSort = undefined
        this.query.dateSort = false
      }
      this.search()
    }
  },
  created() {
    this.records = []

    wordTypeApi.listAll().then(res => {
      res.data.forEach(item => {
        // 默认选中全部
        this.query.wordTypeIds.push(item.id)
        // 提供给用户的所有选项
        let temp = {
          value: item.id,
          label: item.typeName
        }
        this.wordTypeData.push(temp)
      })
      this.initData()
    })
  },
  mounted() {
    // 给list添加滚动事件
    this.$refs.dataList.addEventListener("scroll", this.scroll)
  }
}
</script>

<style scoped>

.container {
  width: 90%;
  /*background-color: #526488;*/
  /* 使用绝对布局,以及三个边框的固定,将需要展示的内容的位置进行限制 */
  position: absolute;
  top: 0;
  bottom: 0;
  left: 5%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.ranking {
  width: 100%;
  text-align: center;
  font-size: large;
  padding: 3px 0;
}

.list {
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 95%;
  overflow-y: auto;
  /*flex: 1 0 auto;*/
}

.row {
  display: flex;
  margin: 4px 3px;
  align-items: center;
}

.typeName {
  padding: 3px;
  /*font-weight: bold;*/
}

.progress {
  flex-grow: 1;
}

.date {
  margin: 0 5px;
  color: #909399;
}


</style>




























































