<template>
  <div>
    <div class="container">
      <div class="types">
        <type-card v-for="item in types" :word-type-id="item.id"></type-card>
        <el-image src="/add.png" style="width: 80px; height: 80px;margin-left: 160px;margin-top: 20px"
                  @click="addType"
        ></el-image>
      </div>

      <div class="records">
        <record-list :type-ids="typeIds"></record-list>
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
      }]
    }
  },
  computed: {
    // 计算获取用户所有单词本id集合
    typeIds() {
      let ids = []
      this.types.forEach(item => {
        ids.push(item.id)
      })
      return ids
    }
  },
  methods: {
    // 初始化单词本数据
    initTypeData() {
      wordTypeApi.listAll().then(res => {
        // 返回的数据不为空的情况下才会去设置
        if (res.data) {
          this.types = res.data
        }
      })
    },
    // 添加一个单词本
    addType() {
      this.$prompt('请输入您要添加的单词本名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({value}) => {
        // 添加单词本
        let addTypeContent = {
          "typeName": value,
        }
        wordTypeApi.addType(addTypeContent).then(res => {
          this.$message.success("添加成功!请刷新页面后查看!")
        })
      }).catch(() => {
        this.$message.info("已取消")
      });
    }
  },
  created() {
    this.types = []
    this.initTypeData()
  }
}
</script>

<style scoped>

.container {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
}

.types {
  display: flex;
  flex-direction: column;
  margin-left: 10px;
  margin-top: 10px;
  position: absolute;
  top: 0;
  bottom: 0;
  overflow-y: auto;
}

.types > * {
  margin-bottom: 10px;
}

.records {
  /*display: flex;*/
  /*flex-direction: column;*/
}

</style>
