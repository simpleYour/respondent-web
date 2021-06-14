<template>
  <!-- 答题过程中的页面 -->

  <div class="container">

    <!-- 已回答内容区域 -->
    <div class="answer" ref="scroll">
      <!--      <answer-card :id="result.current.id" :question="result.current.word" :answer="result.current.mean"
                         :is-play="true" :voice-url="result.current.voicePath"></answer-card>-->
      <div v-for="item in history">
        <answer-card :id="item.id" :question="item.question" :answer="item.answer" :user-answer="item.userAnswer"
                     :is-play="item.isPlay" :voice-url="item.voicePath"></answer-card>
        <div class="empty"></div>
      </div>
    </div>

    <!-- 底部答案输入位置 -->
    <div class="footer">
      <el-input type="text" aria-placeholder="请输入您的答案" @change="toAnswer" v-model="answer"></el-input>
      <el-button @click="toAnswer">确认</el-button>
    </div>

  </div>
</template>

<script>
import respondentApi from "@/api/RespondentApi";
import AnswerCard from "@/components/AnswerCard";

// 后端识别的代表刷新的符号
const refreshSymbol = "23456746756"

export default {
  name: "answerIn",
  components: {AnswerCard},
  data() {
    return {
      // 用户回答的一个答案
      answer: "",
      // 全局设置是否自动音频播放
      isPlay: true,
      // 答题过程中的信息传输类
      result: {
        "current": {
          "count": 0,
          "ecount": 0,
          "gmtCreate": "",
          "id": "",
          "mean": "",
          "voicePath": "",
          "word": "",
          "wordTypeId": ""
        },
        "mode": "",
        "previous": {
          "count": 0,
          "ecount": 0,
          "gmtCreate": "",
          "id": "",
          "mean": "",
          "voicePath": "",
          "word": "",
          "wordTypeId": ""
        },
        "recordId": "",
        "remain": 0,
        "rightCount": 0,
        "status": "",
        "wrongCount": 0
      },
      // 答题的历史记录保存
      history: [{
        id: "",
        question: "",
        answer: "",
        userAnswer: "",
        // 是否回答正确,这个是由后端返回的数据进行判断的,而非前端自行判断的值
        isRight: false,
        voiceUrl: "",
        // 默认情况下,音频是自动播放的
        isPlay: true
      }]
    }
  },
  computed: {
    // 获取当前正在处理的history对象,即获取history数组中的最后一个对象
    current() {
      if (this.history.length > 0) {
        return this.history[this.history.length - 1]
      }
      return null;
    }
  },
  methods: {
    // 刷新重新获取一下后端传递过来的数据
    refreshData() {
      this.answer = refreshSymbol
      this.toAnswer()
    },
    // 与后端进行交互,进行一个答题 回答的答案为 this.answer
    toAnswer() {
      respondentApi.isRight(this.answer).then(res => {
        this.result = res.data

        // 这里对不同的status进行不一样的处理
        if (this.result.status === 'right') {
          this.$message({
            message: "回答正确!", duration: 1000, type: "success"
          })

          // 给上一个问题一个答复
          this.current.userAnswer = this.answer
          this.current.isRight = true

          // 创建出来下一个问题
          this.transform()
        } else if (this.result.status === 'error') {
          this.$message({
            message: "回答错误!", duration: 1000, type: "error"
          })

          // 给上一个问题一个答复
          this.current.userAnswer = this.answer
          this.current.isRight = false

          // todo 进行一个次数的惩罚
          // 创建出来下一个问题
          this.transform()

        } else if (this.result.status === 'flush') {
          // 判断history中的上一个题目是否已经为当前问题了
          // 如果上一个题目为空,那么就直接进行一个转化
          if (!this.current) {
            this.transform()
          } else {
            // 使用单词id的方式判断,上个题目中这个单词是否已经被添加到了history中了
            if (this.current.id !== this.result.current.id) {
              // 如果没有被添加的话,则添加进去
              this.transform()
            }
          }
        } else if (this.result.status === 'end') {

        }

        // 最后,将用户回答的内容文本框清空
        this.answer = ""

      })
    },
    // 提取result对象中对于当前题目的内容,生成一个对应的history对象
    transform() {
      let currentWord = this.result.current
      // todo 后面这里需要对是否为颠倒模式进行相应的判断处理
      let temp = {
        id: currentWord.id,
        question: currentWord.mean,
        answer: currentWord.word,
        userAnswer: "",
        // 是否回答正确,这个是由后端返回的数据进行判断的,而非前端自行判断的值
        isRight: undefined,
        voiceUrl: currentWord.voicePath,
        // 默认情况下,音频是自动播放的
        isPlay: this.isPlay
      }
      this.history.push(temp)

      setTimeout(() => {
        // 将滚动条滚动到最后面
        this.$refs.scroll.scrollTop = this.$refs.scroll.scrollHeight
      }, 200)

    }
  },
  created() {
    this.history = []
    // 创建的时候,初始化一下相关的数据
    this.refreshData()
  }
}
</script>

<style scoped>

.container {
  height: 1000px;
  display: flex;
}

.answer {
  width: 100%;
  background-color: aquamarine;
  height: 70%;
  overflow-y: scroll;
}

.empty {
  width: 100%;
  height: 10px;
}


</style>
