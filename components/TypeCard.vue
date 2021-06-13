<template>
  <!-- 单词本展示的card -->

  <div class="container">
    <div class="title">
      <nuxt-link :to="'/word/'+wordTypeId">
        {{ wordType.typeName }}
      </nuxt-link>
    </div>
    <div>
      <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
      <div id="main" style="width: 300px;height:200px;" ref="main"></div>
    </div>
    <div class="footer">
      <div>单词数:{{ wordType.wordCount }}</div>
      <div>答题记录数:{{ wordType.recordCount }}</div>
      <div>错题数:{{ wordType.errorCount }}</div>
    </div>
  </div>
</template>

<script>
import wordTypeApi from "~/api/WordTypeApi";
import recordApi from "@/api/RecordApi";
import * as echarts from 'echarts';

let myCharts = undefined;

export default {
  name: "TypeCard",
  props: ["wordTypeId"],
  data() {
    return {
      wordType: {
        "errorCount": 0,
        "gmtCreate": "",
        "gmtModified": "",
        "id": "",
        "recordCount": 0,
        "typeName": "",
        "userId": "",
        "wordCount": 0
      },
      // 单词本日期数量对象数组
      dateCount: [
        {
          "count": 0,
          "dateDay": "",
          "typeId": ""
        }
      ]
    }
  },
  mounted() {
    // 初始化eCharts实例对象
    myCharts = echarts.init(document.getElementById("main"));
  },
  created() {
    wordTypeApi.getVoById(this.wordTypeId).then(res => {
      this.wordType = res.data
    })

    this.dateCount = []
    recordApi.dateCount({
      "number": 5,
      "typeId": this.wordTypeId
    }).then(res => {
      this.dateCount = res.data
      this.refreshEcharts(this.dateCount)
    })

  },
  methods: {
    // 构建eCharts实例的图表结构数据
    refreshEcharts(data) {
      //绘制图表 定义相关的选项设置
      let option = {
        legend: {},
        tooltip: {},
        dataset: {
          // 指定数据中地系列项
          dimensions: ["dateDay", "count"],
          source: data
        },
        xAxis: {type: 'category'},
        yAxis: {},
        series: [
          {type: 'bar', seriesLayoutBy: 'row', name: "最近答题数"}
        ]
      }
      myCharts.setOption(option)
    }
  }
}
</script>

<style scoped>

.container {
  background-color: #ffffff;
}

.title{
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: x-large;
}

a{
  text-decoration: none;
}
a:visited{
  color: black;
}

.footer {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

</style>
