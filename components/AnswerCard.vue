<template>
  <!-- 回答问题的card -->
  <div class="context">
    <div class="punishment" v-if="punishment.current !== -1">
      当前为惩罚模式:请您第{{ punishment.current }}输入正确答案,总共有{{ punishment.number }}次!
    </div>

    <div class="question">
      <div></div>
      <div style="font-size: large">
        问题为:{{ question }}
      </div>
      <el-image @click="playAudio"
                style="width: 25px; "
                class="play-icon"
                src="/voice.png"
      ></el-image>
    </div>

    <!-- 只有当用户回答的有内容之后,才会去进行判断显示后面的内容 -->
    <div v-if="userAnswer">
      <!-- 一个分割线,进行分割一下 -->
      <div class="line"></div>
      <!-- 依据用户回答的一个内容来进行显示-->
      <div v-if="isRight" class="right">
        恭喜你!回答正确!
      </div>
      <div v-else class="error">
        不好意思,你回答错误了!正确答案为:{{ answer }},您回答的内容为:{{ userAnswer }}
      </div>
    </div>
    <!-- 音频播放audio -->
    <audio ref="audio" src="http://dict.youdao.com/dictvoice?audio=explore">
      您的浏览器不支持 audio 元素。
    </audio>
  </div>
</template>

<script>
export default {
  name: "AnswerCard",
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
    punishment: Object
  },
  methods: {
    // 音频的播放
    playAudio() {
      this.$refs.audio.src = this.voicePath
      this.$refs.audio.play()
    },
  },
  created() {

  },
  mounted() {
    // 创建初始化该组件的时候,如果设置为可以播放,则直接去进行播放
/*    if (this.isPlay) {
      this.playAudio()
    }*/
  }
}
</script>

<style scoped>

.context {
  background-color: white;
  padding: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  /*width: 100%;*/
  border-radius: 20px;

}

.context > * {
  width: 100%;
  flex-grow: 1;
}

.question {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.line {
  height: 1px;
  width: 100%;
  background-color: dimgrey;
  margin: 10px 0;
}

.right {
  background-color: rgb(92, 184, 122);
}

.error {
  background-color: rgb(230, 162, 60);
}

</style>
