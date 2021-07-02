<template>
  <!-- 开始答题的模式选择页面 -->
  <div>
    <div class="container">
      <div class="main-box">
        <div class="title">
          <el-divider content-position="center">
            <h3>请选择答题选项</h3>
          </el-divider>
        </div>
        <div class="selectBox">
          <el-select v-model="respondentOption.mode" filterable placeholder="答题模式">
            <el-option
              v-for="item in modeData"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="respondentOption.num" filterable placeholder="答题数量">
            <el-option
              v-for="item in numberData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select v-model="respondentOption.dateScope" filterable placeholder="答题日期范围">
            <el-option
              v-for="item in dateData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select v-model="respondentOption.typeId" filterable placeholder="答题笔记本">
            <el-option
              v-for="item in wordTypeData"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="center">
          <el-button type="primary" @click="startRespondent">确 定</el-button>
          <el-button type="info" @click="downloadExcel" size="small">下载Excel文件</el-button>
        </div>
        <el-divider content-position="center">
          <h3>Tips</h3>
        </el-divider>
        <div class="tips">
          <el-collapse v-model="activeName" accordion>
            <el-collapse-item title="普通模式" name="1">
              <div>在生成题库的时候会偏向于 <span>日期范围内倒叙添加的单词</span> 和 <span>错误次数比较多的单词</span></div>
              <div>例如我选择的选项是 - <span>普通模式</span>、<span>最近10天</span>、<span>10个单词</span>、<span>日常单词</span></div>
              <div>那么我的题库出现的单词是 <span>日常单词的单词本里面抽取最多10个最近10天添加的单词</span></div>
            </el-collapse-item>
            <el-collapse-item title="错题本模式" name="2">
              <div>在生成的题库只会在选定的单词本中 <span>有错误记录数的单词</span> 生成,并且 <span>答错会减少
                    单词的错误记录数</span>
              </div>
              <div>例如我选择的是 - <span>错题本模式</span>、<span>最近10天</span>、<span>30个单词</span>、<span>日常单词</span></div>
              <div>
                会在普通模式的基础上,增加一个 <span>有错误记录数</span>的记录
              </div>
            </el-collapse-item>
            <el-collapse-item title="整个单词本模式" name="3">
              <div>和普通模式最大的不同就是<span>单词本中日期范围内所有单词出现在题库的机率都是一样的</span></div>
            </el-collapse-item>
            <el-collapse-item title="中英文颠倒模式" name="4">
              <div>和普通模式相比就是 <span>题目是:单词 答案是:单词对应的中文含义</span></div>
              <el-divider></el-divider>
              <div>
                比如:<br/>
                - 单词: international<br/>
                - 对应的中文含义:adj. 国际的；国际通用的/n. 国际体育比赛（选手）；外国人/n. (International)
                共产国际（组织）<br/>
                - 提交的答案为 : 国际的<br/>
                <el-divider></el-divider>
                因为这"国际的"三个字符在其对应的中文含义中是包含关系,则判断答对了,没有包含关系则判断打错了
              </div>
            </el-collapse-item>
            <el-collapse-item title="补充说明" name="5">
              <div>
                除了错题本模式外,其他模式在答题过程中,无论是否答错每个单词的答题记录数都会+1,并且永远不会
                减少,并且在答错的时候,会将错误记录数+1
              </div>
              <div>
                在错题本模式中,答对单词将单词的错误记 录数将会-1,以此减少错题本中的单词数量
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import wordTypeApi from "@/api/WordTypeApi";
import respondentApi from "@/api/RespondentApi";

export default {
  name: "index",
  data() {
    return {
      // 模式的选择
      modeData: [
        {
          value: "normal",
          label: "普通模式",
        },
        {
          value: "wrongBook",
          label: "错题本模式",
        },
        {
          value: "allBook",
          label: "整个单词本模式",
        },
        {
          value: "modeInvert",
          label: "中英文颠倒模式",
        },
      ],
      // 答题数量的选择
      numberData: [
        {
          value: 10,
          label: "10题",
        },
        {
          value: 30,
          label: "30题",
        },
        {
          value: 50,
          label: "50题",
        },
      ],
      // 答题日期范围的选择
      dateData: [
        {
          value: 1,
          label: "最近1天",
        },
        {
          value: 3,
          label: "最近3天",
        },
        {
          value: 10,
          label: "最近10天",
        },
        {
          value: 20,
          label: "最近20天",
        },
        {
          value: 30,
          label: "最近30天",
        },
        {
          value: 10000,
          label: "全部单词",
        },
      ],
      // 答题单词本的选择
      wordTypeData: [],
      // 答题模式的各个选项
      respondentOption: {
        mode: "normal",
        num: 30,
        dateScope: 10000,
        typeId: ""
      },
      activeName: '', //折叠面板默认展开
    }
  },
  methods: {
    // 开始答题
    startRespondent() {
      // 进行请求参数的效验

      let {mode, num, dateScope, typeId} = this.respondentOption
      // 发送请求,成功后跳转页面
      respondentApi.init(typeId, mode, num, dateScope).then(res => {
        if (res.data) {
          this.$message("初始化成功!")
          // this.rounte
          this.$router.push({path: "/respondent/answerIn"})
        }
      })
    },
    // 初始化一些基本的数据
    initBaseData() {
      // 加载获取单词本的可选数组列表
      wordTypeApi.listAll().then(res => {
        res.data.forEach(item => {
          let temp = {
            value: item.id,
            label: item.typeName
          }
          this.wordTypeData.push(temp)
        })
        // 选择第一个单词本
        this.respondentOption.typeId = res.data[0].id
      })
    },
    downloadExcel() {
      let {mode, num, dateScope, typeId} = this.respondentOption
      // 发送请求,成功后跳转页面
      respondentApi.downloadExcel(typeId, mode, num, dateScope)
    }
  },
  created() {
    this.initBaseData()

  }
}
</script>

<style scoped>

.container {
  /*position: relative;*/
  display: flex;
  width: 100%;
  justify-content: center;
  flex-direction: row;
}

.main-box {
  width: 500px;
  /*margin: 200 px auto;*/
  /*position: absolute;*/
  /*top: 50%;*/
  /*left: 50%;*/
  /*transform: translate(-50%, -50%);*/
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 50px;
  background: #fff;
}

.el-select {
  width: 45%;
  padding: 10px 0;
}

.selectBox {
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}


.center {
  display: flex;
  justify-content: center;


}

</style>
