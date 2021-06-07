<template>
  <div>
    我这里接收到的单词本id为:{{ typeId }}
    sdfgsdf{{ query.wordTypeId }}

    <el-table
      :data="records"
      stripe
      style="width: 100%">
      <el-table-column
        prop="word"
        label="单词"
      >
      </el-table-column>
      <el-table-column
        prop="mean"
        label="中文解释"
        width="300"
      >
      </el-table-column>
      <el-table-column
        prop="count"
        label="答题次数">
      </el-table-column>
      <el-table-column
        prop="ecount"
        label="错误次数">
      </el-table-column>
      <el-table-column
        prop="gmtCreate"
        width="190"
        label="创建时间">
      </el-table-column>
      <el-table-column
        prop="gmtModified"
        width="190"
        label="最近修改时间">
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import WordApi from "~/api/WordApi";

export default {
  name: "typeId",
  data() {
    return {
      current: 1,
      size: 100,
      records: [{
        "count": 0,
        "deleted": 0,
        "ecount": 0,
        "gmtCreate": "",
        "gmtModified": "",
        "id": "",
        "mean": "",
        "version": 0,
        "voicePath": "",
        "word": "",
        "wordTypeId": ""
      }],
      query: {
        wordTypeId: "",
        word: "",
        mean: ""
      }
    }
  },
  methods: {
    // 加载获取这个单词本的单词信息
    load() {
      WordApi.list(this.query, this.current, this.size).then(res => {
        this.records = res.data.records
      })
    }
  },
  created() {
    this.query.wordTypeId = this.typeId
    this.load()
  },
  validate({params}) {
    // 传递过来的单词本id必须是number类型
    return /^\d+$/.test(params.typeId)
  },
  asyncData({params, error}) {
    const id = params.typeId
    // 将路由传递过来的typeId给赋值出去 合并到data中去
    return {"typeId": id}
  }
}
</script>

<style scoped>

</style>
