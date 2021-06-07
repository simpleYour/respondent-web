<template>
  <!-- 单词本展示的card -->

  <div class="container">
    <div class="title">
      <nuxt-link :to="'/word/'+wordTypeId">
        {{ wordType.typeName }}
      </nuxt-link>
    </div>
    <div>
      <!-- todo 用以展示最近的答题记录信息(图表的形式) -->
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
      }
    }
  },
  created() {
    wordTypeApi.getVoById(this.wordTypeId).then(res => {
      this.wordType = res.data
    })
  },
  methods: {}
}
</script>

<style scoped>

.container {
  background-color: #ffffff;
}

</style>
