<template>
  <!-- 词根词缀展示的card -->
  <div>
    <div class="container">
      <div class="header" @click="toLink">
        <!--        {{ word }}-->
        <highlight :content="word" :high-content="highContent"></highlight>

        <div class="type">{{ type }}</div>
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
      window.open(this.link)
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
  background-color: chartreuse;
  border-radius: 5px;
}

.main {
  /*能够识别换行符号,然后进行换行*/
  /*white-space: pre-wrap;*/
  color: #909399;
  margin: 5px 0;
}


</style>
