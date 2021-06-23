<template>
  <div>
    <div class="container">

      <div class="types">
        <type-card v-for="item in types" :word-type-id="item.id"></type-card>
      </div>

      <div class="records">


      </div>
    </div>
  </div>
</template>

<script>
import wordTypeApi from "@/api/WordTypeApi";

export default {
  data() {
    return {
      // 已经登录用户的单词本列表
      types: [{
        "errorCount": 0,
        "gmtCreate": "",
        "gmtModified": "",
        "id": "",
        "recordCount": 0,
        "typeName": "",
        "userId": "",
        "wordCount": 0
      }],
      // 答题记录的查询对象
      recordQuery: {
        "dateSort": true,
        "endDate": "",
        "isOver": 0,
        "rankSort": true,
        "startDate": "",
        "wordTypeIds": []
      }
    }
  },
  methods: {
    // 初始化单词本数据
    initTypeData() {
      wordTypeApi.listAll().then(res => {
        this.types = res.data
      })
    }
  },
  created() {
    this.initTypeData()
  }
}
</script>

<style>

.container {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
}

.types {
  display: flex;
  flex-direction: column;
}

</style>
