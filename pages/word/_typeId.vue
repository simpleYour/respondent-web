<template>
  <div class="container">
    <!-- 查询条件的一个 form -->
    <el-form :inline="true" :model="query" style="margin-top: 5px">
      <el-form-item label="单词">
        <el-input type="text" v-model="query.word" @change="search" clearable></el-input>
      </el-form-item>
      <el-form-item label="中文含义">
        <el-input type="text" v-model="query.mean" @change="search" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="search">确认</el-button>
      </el-form-item>
    </el-form>

    <!-- 信息展示的一个table -->
    <el-table
      :data="records"
      style="width: 100%"
      max-height="800"
      stripe>
      <el-table-column label="序号" align="center">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        prop="word"
        label="单词">
      </el-table-column>
      <el-table-column
        label="中文解释"
        width="300">
        <template slot-scope="scope">
          <div style="white-space: pre-wrap;">{{ scope.row.mean }}</div>
        </template>
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
        label="发音播放">
        <template slot-scope="scope">
<!--          <i class="el-icon-video-play" @click="playAudio(scope.row.voicePath)">
          </i>-->
          <el-image @click="playAudio(scope.row.voicePath)"
            style="width: 25px; "
            src="/voice.png"
            ></el-image>
        </template>
      </el-table-column>
      <el-table-column
        prop="gmtCreate"
        width="190"
        sortable
        label="创建时间">
      </el-table-column>
      <el-table-column
        prop="gmtModified"
        width="190"
        sortable
        label="最近修改时间">
      </el-table-column>
      <el-table-column
        label="操作"
        width="180">
        <template slot-scope="scope">
          <el-button type="warning" @click="modifyWord(scope.row)">修改</el-button>
          <el-button type="danger" @click="deleteWord(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 修改单词dialog -->
    <el-dialog
      title="修改单词"
      :visible.sync="modifyDialog"
      width="30%">
      <el-form :model="currentModifyWord">
        <el-form-item label="单词">
          <el-input type="text" v-model="currentModifyWord.word"></el-input>
        </el-form-item>
        <el-form-item label="中文含义">
          <el-input type="textarea" v-model="currentModifyWord.mean" style="white-space: pre-wrap;"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyDialog = false">取 消</el-button>
        <el-button type="primary" @click="doModifyWord(currentModifyWord)">确定修改</el-button>
      </span>
    </el-dialog>

    <!-- 音频播放audio -->
    <audio ref="audio">
      <!--              <source :src="scope.row.voicePath" type="audio/mpeg">-->
      您的浏览器不支持 audio 元素。
    </audio>

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
      },
      // 修改单词的对话框 是否显示
      modifyDialog: false,
      // 当前将要被修改的单词
      currentModifyWord: {}
    }
  },
  methods: {
    // 依据相关的条件 加载获取这个单词本的单词信息
    load() {
      WordApi.list(this.query, this.current, this.size).then(res => {
        //  这里应给是pushAll
        res.data.records.forEach(item => {
          this.records.push(item)
        })
      })
    },
    playAudio(voicePath) {
      this.$refs.audio.src = voicePath
      this.$refs.audio.play()
    },
    // 向后端服务器查询符合条件的数据集合
    search() {
      this.records = []
      // 将当前页面重置回到第一页
      this.current = 1
      this.load()
    },
    // 依据现有条件,加载下一页的数据
    nextPage() {
      ++this.current
      this.load()
    },
    // 修改单词
    modifyWord(word) {
      // 加载dialog的数据并显示dialog
      this.currentModifyWord = word
      this.modifyDialog = true
    },
    // 执行修改单词
    doModifyWord(word) {
      WordApi.modify(word.id, word).then(res => {
        this.$message({message: "修改成功!", type: "success", center: true})
        this.modifyDialog = false
      })
    },
    // 删除单词
    deleteWord(word) {
      this.$confirm(`您是否要删除单词:${word.word}?`, '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        WordApi.delete(word.id).then(res => {
          if (res.data) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            //  这里将this.records 中对应的数据也删除掉
            this.records.forEach((item, index) => {
              if (item === word) {
                // 删除指定位置上的元素,并且表示删除一个
                this.records.splice(index, 1)
              }
            })
          } else {
            this.$message({
              type: 'error',
              message: '删除失败!'
            });
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  },
  created() {
    this.query.wordTypeId = this.typeId
    this.records = []
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

.container {
  width: 100%;
  display: flex;
  flex-direction: column;
  /*flex-wrap: wrap;*/
  justify-content: center;
  align-items: center;
}

/*.container > * {*/
/*  width: 100%;*/
/*}*/

</style>
