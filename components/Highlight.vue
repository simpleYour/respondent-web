<template>
  <!-- 高亮显示一段文本  这里没有使用多个div摆脱父组件的样式控制,
  便代表,这个组件的样式可以有父组件很方便地进行修改-->
  <div v-html="targetContent">
  </div>
</template>

<script>
export default {
  name: "Highlight",
  props: {
    // 全部内容的一个文本
    content: String,
    // 需要高亮的一个文本内容,需要被包含在content中,才能够正常高亮出来
    highContent: String
  },
  computed: {
    // 目标内容,即给需要高亮的文本加上了对应的html标签后的文本内容
    targetContent() {
      // 三相运算符 进行一个是否为空的判断

      // 使用全局匹配的方式进行替换
      return !this.highContent ? this.content : this.content.replace(new RegExp(this.highContent, "g"), `<span style="font-weight: bold;background-color:yellow;
">${this.highContent}</span>`)
    }
  }
}
</script>
