<template>
  <!-- 单词本展示的card -->

  <div>
    <div class="container">
      <div class="title">
        <nuxt-link :to="'/word/'+wordTypeId">
          {{ wordType.typeName }}
        </nuxt-link>
        <div class="options">
          <div class="option" @click="modifyTypeName">修改</div>
          <div class="option"><i class="el-icon-delete" @click="deleteType"></i></div>
        </div>
      </div>
      <div>
        <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM  由于id属性的唯一性,所以这里加上一个typeId保证唯一性  -->
        <div :id="'main'+wordTypeId" style="width: 400px;height:200px;" ref="main" v-show="dateCount.length"></div>
        <div v-show="!dateCount.length" class="empty" @click="window.location.href = '/respondent'">
          <el-image src="/empty.png" style="width: 150px;margin: 0 auto"></el-image>
          <div>暂时还没有答题数据,快去答题吧!</div>
        </div>

      </div>
      <div class="footer">
        <div>单词数:{{ wordType.wordCount }}</div>
        <div>答题记录数:{{ wordType.recordCount }}</div>
        <div>错题数:{{ wordType.errorCount ? wordType.errorCount : 0 }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import wordTypeApi from "~/api/WordTypeApi";
import recordApi from "@/api/RecordApi";
import * as echarts from 'echarts';

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
      ],
      myCharts: {},
      window: window
    }
  },
  mounted() {
    // 初始化eCharts实例对象
    let element = document.getElementById("main" + this.wordTypeId)

    if (element) {
      this.myCharts = echarts.init(element);
    }
  },
  created() {
    if (this.wordTypeId) {
      this.initData()
    } else {
      // 测试的时候,传递过来的数据有延迟,这里就设置一个定时器来保证
      setTimeout(() => {
        this.initData()
      }, 200)
    }
  },
  methods: {
    // 调用一次组件的初始化信息
    initData() {
      wordTypeApi.getVoById(this.wordTypeId).then(res => {
        this.wordType = res.data
      })

      this.dateCount = []
      recordApi.dateCount({
        "number": 5,
        "typeId": this.wordTypeId
      }).then(res => {
        // 只有当其有数据的时候,才会去加载相应的图表信息
        if (res.data) {
          // this.dateCount = res.data

          // 对那个日期数据进行一下处理,去除年份信息
          res.data.forEach(item => {
            item.dateDay = item.dateDay.substr(6)
          })
          this.dateCount = res.data

          this.refreshEcharts(this.dateCount)
        }
      })
    },
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
      // myCharts.setOption(option)
      this.myCharts.setOption(option)
    },
    // 删除当前单词本
    deleteType() {
      this.$confirm('此操作将永久删除<<' + this.wordType.typeName + '>>该单词本相关的所' +
        '有内容(包括但不限于答题本中的所有单词,相关的所有答题记录),是否继续?', "提示", {
        confirmButtonText: "确定删除",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        wordTypeApi.removeById(this.wordTypeId).then(res => {
          this.$message.success("删除成功,请刷新页面后查看!")
        })
      }).catch(() => {
        this.$message.info("已取消!")
      })
    },
    // 修改单词本的名称
    modifyTypeName() {
      this.$prompt('请输入您要修改的单词本名称,原单词本名称为:<<' + this.wordType.typeName + ">>", '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({value}) => {
        wordTypeApi.modifyTypeName(this.wordType.id, value).then(res => {
          this.$message.success("修改成功!请刷新页面后查看!")
        })
      }).catch(() => {
        this.$message.info("已取消")
      });
    }
  }
}
</script>

<style scoped>

.container {
  background-color: #ffffff;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  padding: 5px;
}

.title {
  width: 100%;
  display: flex;
  justify-content: center;
  font-size: x-large;
  position: relative;
}


.options {
  position: absolute;
  font-size: medium;
  right: 0;
  display: flex;
  flex-direction: row;
}

.option {
  padding: 2px;
  margin: 2px;
  border-radius: 2px;
}

.empty {
  width: 400px;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #909399;
}


a {
  text-decoration: none;
}

a:visited {
  color: black;
}

.footer {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

</style>
