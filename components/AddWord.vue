<template>
  <!-- 这是添加单词的一个组件 单独把这个组件给抽离出来,也是为了轻松方便的控制和扩展管理  -->

  <div>
    <div @click="showDialog = true">
      <!-- 给到一个slot方便父组件自定义 -->
      <slot></slot>
    </div>

    <!-- 添加单词dialog -->
    <el-dialog
      title="添加单词"
      :visible.sync="showDialog"
      width="30%">
      <div class="form">

        <div class="item"><span> 单 词 </span>
          <input type="text" v-model="word.word" placeholder="回车获取网络解释" @keyup.enter="getWebMean"></input>
        </div>
        <div class="item"><span>中文解释</span>
          <el-input type="textarea" v-model="word.mean" style="white-space: pre-wrap;"></el-input>
        </div>
        <div class="item"><span>备注信息</span>
          <el-input type="textarea" v-model="word.notes" style="white-space: pre-wrap;"></el-input>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="addWord">确定添加</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import wordApi from "@/api/WordApi";

export default {
  name: "AddWord",
  data() {
    return {
      // 添加单词的对话框是否显示
      showDialog: false,
      // 需要添加的单词
      word: {
        "count": 0,
        "ecount": 0,
        "link": "",
        "mean": "",
        "notes": "",
        "voicePath": "",
        "word": "",
        // 将typeId赋值上来
        "wordTypeId": this.typeId
      }
    }
  },
  props: {
    // 接收单词本id的属性
    typeId: {
      type: String,
      required: true
    }
  },
  methods: {
    // 获取网络解释并自动填写上
    getWebMean() {
      wordApi.getWebMean(this.word.word).then(res => {
        this.word.mean = res.data
      })
    },
    // 确认添加单词,依据绑定的相关对象进行添加单词
    addWord() {
      wordApi.add(this.word).then(res => {
        this.$message.success("添加成功!")
        this.showDialog = false
      }).catch(error => {
        this.$message.error("添加失败!")
      })
    }
  }
}
</script>

<style scoped>


input {
  text-align: center;
  padding: 5px;
}

.form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.item {
  display: flex;
  width: 100%;
  align-items: center;
  padding: 5px;
}

.item:first-child, span {
  padding: 3px;
  flex-shrink: 0;
}



</style>
