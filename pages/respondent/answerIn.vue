<template>
  <!-- 答题过程中的页面 -->
  <div class="context">

    <div class="main">
      <!-- 已回答内容区域 -->
      <div class="answer" ref="scroll">
        <!--      <answer-card :id="result.current.id" :question="result.current.word" :answer="result.current.mean"
                           :is-play="true" :voice-url="result.current.voicePath"></answer-card>-->
        <div v-for="item in history">
          <answer-card :id="item.id" :question="item.question" :answer="item.answer" :user-answer="item.userAnswer"
                       :is-play="item.isPlay" :voice-path="item.voicePath" :is-right="item.isRight"
                       :punishment="item.punishment"></answer-card>
          <div class="empty"></div>
        </div>
      </div>
      <!-- 底部答案输入位置 -->
      <div class="footer">
        <input type="text" aria-placeholder="请输入您的答案" @change="toAnswer" v-model="answer" class="answer-input"
               placeholder="请输入您的答案,回车即可提交!"></input>
        <el-button @click="toAnswer" type="primary"> 确 认</el-button>
      </div>
    </div>

    <div class="title-show">
      剩余题目数: <span class="highlight">{{ result.remain }}</span>
      正确次数:<span class="highlight">{{ result.rightCount }}</span>
      错误次数:<span class="highlight">{{ result.wrongCount }} </span>
      答题的模式为:<span class="highlight">{{ result.mode }}</span>
    </div>
    <!-- 音频播放audio -->
    <audio ref="audio" src="">
      您的浏览器不支持 audio 元素。
    </audio>
  </div>
</template>

<script>
import respondentApi from "@/api/RespondentApi";

// 后端识别的代表刷新的符号
const refreshSymbol = "23456746756"

export default {
  name: "answerIn",
  data() {
    return {
      // 用户回答的一个答案
      answer: "",
      // 全局设置是否自动音频播放
      isPlay: true,
      // 惩罚相关的数据
      punishment: {
        // 惩罚的一个次数
        number: 5,
        // 当前是第几次,并且还可以表示是否开启一个惩罚模式
        // -1 表示不开启,0表示初始化第一个题目 <=number 表示惩罚的一个过程中的次数
        current: -1
      },
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
        voicePath: "",
        // 默认情况下,音频是自动播放的
        isPlay: true,
        // 惩罚的一个数据封装
        punishment: {
          number: 5,
          current: -1
        }
      }],
      // 答题正确与否,是否显示正确或错误的toast信息
      isShowMessage: false
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

      // 判断处理是否为惩罚模式
      if (this.punishment.current !== -1 && this.punishment.current <= this.punishment.number) {
        // 进入惩罚的一个模式
        this.doPunishment()
        return
      }

      respondentApi.isRight(this.answer).then(res => {
        this.result = res.data

        // 这里对不同的status进行不一样的处理
        if (this.result.status === 'right') {
          if (this.isShowMessage) {
            this.$message({
              message: "回答正确!", duration: 1000, type: "success"
            })
          }

          // 给上一个问题一个答复
          this.current.userAnswer = this.answer
          this.current.isRight = true

          // 创建出来下一个问题
          this.transform()
        } else if (this.result.status === 'error') {
          if (this.isShowMessage) {
            this.$message({
              message: "回答错误!", duration: 1000, type: "error"
            })
          }

          // 给上一个问题一个答复
          this.current.userAnswer = this.answer
          this.current.isRight = false

          // 这里设置为0,表示开始一个惩罚的计数
          this.punishment.current = 0
          // 进行一个次数的惩罚
          this.doPunishment();

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
          respondentApi.end().then(resp => {
            // 获取本次答题的一个记录对象
            let record = resp.data[0];
            if (resp.data.length === 10) {
              record = resp.data[5]
            }

            this.$alert("答题结束,您的正确率为!" + record.accuracy * 100 + "%即将返回首页!", '答题结束', {
              confirmButtonText: '确定',
              callback: action => {
                this.$router.push({path: "/"})
              }
            });

          })
        }
      })
    },
    // 提取result对象中对于当前题目的内容,生成一个对应的history对象  isCurrent 是否转化的是当前的问题 值为false表示转换上一个问题
    transform(isCurrent = true) {
      let currentWord = this.result.current

      if (!isCurrent) {
        // 这个只有在错误惩罚的时候才会去调用处理,所以这个previous应该是不会为null的
        currentWord = this.result.previous
      }

      console.log("即将添加一个card,其voicePath为:" + currentWord.voicePath)

      // todo 后面这里需要对是否为颠倒模式进行相应的判断处理
      let temp = {
        id: currentWord.id,
        question: currentWord.mean,
        answer: currentWord.word,
        userAnswer: "",
        // 是否回答正确,这个是由后端返回的数据进行判断的,而非前端自行判断的值
        isRight: undefined,
        voicePath: currentWord.voicePath,
        // 默认情况下,音频是自动播放的
        isPlay: this.isPlay,
        // 因为这是对象的原因,所以需要进行一个深拷贝,防止对象引用
        punishment: {...this.punishment}
      }
      this.history.push(temp)

//  已经在updated的生命周期中进行了处理
      /*      setTimeout(() => {
              // 将滚动条滚动到最后面
              this.$refs.scroll.scrollTop = this.$refs.scroll.scrollHeight
            }, 200)*/

      // 最后,将用户回答的内容文本框清空
      this.answer = ""

      // 播放上一个添加的card的音频
      let previous = this.history[this.history.length - 2]
      // 判断是否为null
      if (previous) {
        this.playAudio(previous.voicePath)
      }

    },
    doPunishment() {
      // 这里面需要涉及到三个时期,第一个为初始化进入时期,第二个为惩罚的时期,第三个为退出的flush时期

      // 第一次进入  只是添加一个问题  不进行用户回答是否正确的判断
      if (this.punishment.current === 0) {
        // 设置当前次数为第一次,开始一个正式的惩罚
        this.punishment.current = 1
        this.transform(false)
        return
      }

      if (this.punishment.current < this.punishment.number) {
        // 后面的1-4次进入,判断用户是否回答正确,给到一个反馈

        this.current.userAnswer = this.answer
        // 判断用户回答是否正确,并且给出下一个问题  todo 后面处理颠倒模式
        if (this.answer === this.current.answer) {
          this.current.isRight = true

          // 给那个惩罚的次数进行 +1
          ++this.punishment.current

          if (this.isShowMessage) {
            this.$message({
              message: "回答正确!", duration: 1000, type: "success"
            })
          }


        } else {
          // 如果说回答错误,则不去进行一个过多的操作
          this.current.isRight = false

          if (this.isShowMessage) {
            this.$message({
              message: "回答错误!", duration: 1000, type: "error"
            })
          }
        }
        // 给出下一次的一个提问
        this.transform(false)

      } else {
        // 第5次进入,除了上面需要做的事情之外,还需要退出惩罚的一个模式
        // 判断用户回答的对与错,是否去结束惩罚模式
        this.current.userAnswer = this.answer
        // 判断用户回答是否正确,并且给出下一个问题  todo 后面处理颠倒模式
        if (this.answer === this.current.answer) {
          this.current.isRight = true
          // 当前次数,设置为-1,表示结束这一个惩罚模式
          this.punishment.current = -1
          // 给出退出惩罚模式后的下一个问题
          this.transform()
        } else {
          // 如果说回答错误,则不去进行一个过多的操作
          this.current.isRight = false

          if (this.isShowMessage) {
            this.$message({
              message: "回答错误!", duration: 1000, type: "error"
            })
          }

          // 给出下一次的一个提问
          this.transform(false)
        }
      }
    },
    // 音频的播放
    playAudio(voicePath) {
      // 只有全局设置为允许播放的时候,才可以去进行播放
      if (this.isPlay) {
        this.$refs.audio.src = voicePath
        this.$refs.audio.play()
      }
    },
  },
  created() {
    this.history = []
    // 创建的时候,初始化一下相关的数据
    this.refreshData()
  },
  updated() {
    // 将滚动条滚动到最后面
    this.$refs.scroll.scrollTop = this.$refs.scroll.scrollHeight
  }
}
</script>

<style scoped>

.context {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.main {
  width: 60%;
  height: 100%;
}

.answer {
  width: 100%;
  background-color: wheat;
  height: 80%;
  overflow-y: scroll;
  padding: 20px;
}

/* 用户答案的一个输入框 */
.answer-input {
  text-align: center;
  /*flex-grow: 1;*/
  width: 70%;
  font-size: x-large;
}

.empty {
  width: 100%;
  height: 10px;
}

.footer {
  display: flex;
  margin: 10px 20px;
  width: 100%;
  box-sizing: border-box;
  justify-content: space-around;
}

.title-show {
  margin: 10px 0;
  position: absolute;
  bottom: 10px;
}

.highlight {
  font-weight: bold;
  font-size: large;
}


</style>
