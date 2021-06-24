<template>

  <!-- 答题记录列表展示 -->
  <div>
    <div class="container">

      <div class="ranking">答题记录(近7天)</div>

      <div class="list">
        <div class="row" v-for="item in records">
          <div class="typeName">{{ item.typeName }}</div>

          <div class="progress">
            <el-progress :text-inside="true" :stroke-width="26"
                         :percentage="item.accuracy*100" :color="customColors"></el-progress>
          </div>
          <div class="date">{{ item.gmtCreate | date("mm-dd hh:MM") }}</div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import recordApi from "@/api/RecordApi";
import timeFormat from "@/utils/timeFormat";

export default {
  name: "RecordList",
  props: {
    // 需要展示的一个单词本id集合(数组)
    typeIds: Array
  },
  data() {
    return {
      // 分页的相关数据
      current: 1,
      size: 100,
      // 答题记录的查询对象
      query: {
        "dateSort": false,
        "endDate": "",
        // 默认查询已结束的答题记录信息
        "isOver": 1,
        "rankSort": undefined,
        "startDate": "",
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
      ]
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
      //初始化单词本id集合信息
      this.query.wordTypeIds = this.typeIds
      // 日期范围进行一个限制  防止排行榜长期不变
      this.query.startDate = this.getBeforeDateStr(-7)

      // 使用默认的query对象对应的一个条件,进行初始化查询,因为这个方法都是在created()生命周期调用,故不去特意创建一个默认的query对象了
      this.search()
    },
    // 获取三天前的日期字符串 格式为后端接受的日期字符串格式  day 相隔几天  负数为前几天,正数为后几天
    getBeforeDateStr(day = 0) {
      let targetDayMilliseconds = new Date().getTime() + 1000 * 60 * 60 * 24 * day
      let date = new Date().setTime(targetDayMilliseconds)
      return timeFormat(date, "yyyy-mm-dd")
    }
  },
  created() {
    // 可能由于父组件是使用计算属性传递值得原因,这里接收到得参数有可能是为空的,但是过了一点时间就好了,
    // 所以这里使用一个循环计时器的方式,判断是否有数据,然后再去向后端请求数据
    let id = setInterval(() => {
      if (this.typeIds[0]) {
        this.initData()
        clearInterval(id)
      }
    }, 50)
  }
}
</script>

<style scoped>

.container {
  width: 50%;
  /*background-color: #526488;*/
  /* 使用绝对布局,以及三个边框的固定,将需要展示的内容的位置进行限制 */
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
}

.ranking {
  width: 100%;
  text-align: center;
  font-size: large;
  padding: 3px 0;
}

.list {
  display: flex;
  flex-direction: column;
  height: 95%;
  overflow-y: scroll;
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




























































