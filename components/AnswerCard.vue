<template>
  <!-- 回答问题的card -->
  <!-- 最外面的这个div,会被父组件应用上css样式,并且子组件也可以应用上css样式 这点就很坑人 -->
  <div>
    <div class="context">
      <div class="punishment" v-if="punishment.current !== -1">
        当前为惩罚模式:请您第{{ punishment.current }}输入正确答案,总共有{{ punishment.number }}次!
      </div>

      <div class="question">
        <div></div>
        <div style="font-size: large" @click="linkToWord">
          问题为:{{ question }}
        </div>

        <el-image @click="playAudio"
                  style="width: 25px; "
                  class="play-icon"
                  src="/voice.png"
        ></el-image>

        <div class="notes-switch" v-if="notes">备注
          <el-switch
            v-model="showNotes"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </div>
      </div>

      <!-- 只有当用户回答的有内容之后,才会去进行判断显示后面的内容 -->
      <template v-if="userAnswer">
        <!-- 一个分割线,进行分割一下 -->
        <div class="line"></div>
        <!-- 依据用户回答的一个内容来进行显示-->
        <div v-if="isRight" class="right">
          恭喜你!回答正确!
        </div>
        <div v-else class="error">
          不好意思,你回答错误了!正确答案为:<span class="highlight">{{ answer }}</span>,您回答的内容为:{{ userAnswer }}
        </div>
      </template>

      <div v-show="showNotes" style="width: 100%">
        <div class="line"></div>
        <div class="notes" style="text-align: center">备注信息为:{{ notes }}</div>
      </div>

      <!-- 音频播放audio -->
      <audio ref="audio" src="http://dict.youdao.com/dictvoice?audio=explore">
        您的浏览器不支持 audio 元素。
      </audio>
    </div>
  </div>
</template>

<script>
export default {
  name: "AnswerCard",
  data() {
    return {
      showNotes: false
    }
  },
  props: {
    // id唯一值
    id: {
      type: String,
      required: true
    },
    // 问题的内容
    question: String,
    // 答案的内容
    answer: String,
    // 用户回答的答案内容
    userAnswer: String,
    // 音频播放的地址
    voicePath: String,
    // 是否自动播放音频
    isPlay: Boolean,
    // 后端给到的一个答案,判断是否回答正确
    isRight: Boolean,
    // 惩罚模式的封装参数
    punishment: Object,
    notes: String
  },
  methods: {
    // 音频的播放
    playAudio() {
      this.$refs.audio.src = this.voicePath
      this.$refs.audio.play()
    },
    // 跳转到单词网的解释页面
    linkToWord() {
      // todo 这里需要后期去修改成后端提供的链接
      let url = 'http://www.youdao.com/w/eng/' + this.answer
      window.open(url)
    }
  },
  created() {

  },
  mounted() {
    // 创建初始化该组件的时候,如果设置为可以播放,则直接去进行播放
    /*    if (this.isPlay) {
          this.playAudio()
        }*/
  },
  watch: {
    isRight(val, oldVal) {
      // todo 其实这里的方法是没有生效的,这个watch应该是有点问题,只执行了一次,可以参看下面一行代码
      // console.log("oldVal:" + oldVal)

      // 因为第一次赋值时false,所以为了避免,第一次赋值时的影响,这里对oldVal进行一个判断处理
      if ((typeof oldVal) === 'undefined') {
        console.log("............")
        return
      }

      // 监听是否正确的参数,如果错误,则自动展示备注信息
      // 加上一个条件,必须是这个单词有备注信息的情况下 没有的话,没必要展示
      if (!val && this.notes) {
        this.showNotes = true
      }
    }
  }
}
</script>

<style scoped>

.context {
  background-color: white;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-wrap: nowrap;
  /*height: 50px;*/
  /*width: 100%;*/
  border-radius: 10px;
  position: relative;
}

.context > * {
  /*width: 100%;*/
  /*flex-grow: 1;*/
}

.punishment {
  color: #909399;
  font-size: medium;
  text-align: center;
}

.question {
  display: flex;
  align-items: center;
  width: 80%;
  justify-content: space-between;
}

.line {
  height: 1px;
  width: 100%;
  background-color: #c8c9cc;
  margin: 10px 0;
}

.right {
  background-color: rgb(92, 184, 122);
  text-align: center;
  padding: 2px;
  border-radius: 5px;
}

.error {
  background-color: rgb(230, 162, 60);
  text-align: center;
  padding: 2px;
  border-radius: 5px;
}

.highlight {
  font-weight: bold;
  font-size: large;
  color: red;
}

.notes-switch {
  position: absolute;
  right: 5px;
}

</style>
