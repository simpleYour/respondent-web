<template>
  <!-- 词根词缀展示的card -->
  <div>
    <div class="container">
      <div class="header" @click="toLink">
        <highlight :content="word" :high-content="highContent"></highlight>

        <div class="type">{{ typeName }}</div>
      </div>
      <div class="main">
        {{ mean }}

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RootCard",
  props: {
    "link": String,
    "mean": String,
    "type": Number,
    "word": String,
    // 需要被高亮的文本内容,也就是搜索的一个文本内容
    highContent: String
  },
  methods: {
    // 链接跳转到对应的词根词缀页面
    toLink() {
      let link = "https://www.etymonline.com/word/" + this.word

      window.open(link)
    }
  },
  computed: {
    typeName() {
      // 词根词缀所属的一个类型.1:为前缀 2为后缀 3为词根 4为英文词根 -1为所有类型
      switch (this.type) {
        case 1:
          return '前缀'
        case 2:
          return '后缀'
        case 3:
          return '词根'
        default:
          return '英文词根'
      }
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: white;
  border-radius: 10px;
  padding: 8px;
  box-sizing: border-box;
  margin-bottom: 10px;
}

.header {
  display: flex;
  justify-content: space-between;
  font-size: large;
  font-weight: bold;
}

.type {
  /*background-color: chartreuse;*/
  /*border-radius: 5px;*/
  font-weight: normal;
  color: #82848a;
  font-size: medium;

}

.main {
  /*能够识别换行符号,然后进行换行*/
  /*white-space: pre-wrap;*/
  color: #909399;
  margin: 5px 0;
}


</style>
