<template>
  <!-- 这是添加单词的一个组件 单独把这个组件给抽离出来,也是为了轻松方便的控制和扩展管理  -->
  <div>
    <div class="horizontal">
      <div @click="showDialog = true">
        <!-- 给到一个slot方便父组件自定义  这里使用匿名slot,默认插入到这里,也是默认为添加单个单词 -->
        <slot></slot>
      </div>

      <div @click="showUpload = true">
        <!-- 批量添加单词的组件位置,具体样式由父组件定义,这里只定义好其所需要执行的具体逻辑代码 -->
        <slot name="batch"></slot>
      </div>

      <div @click="downloadTemplate">
        <!-- 批量添加单词模板下载位置,跟slot-batch类似 -->
        <slot name="template"></slot>
      </div>
    </div>
    <!-- 添加单词dialog -->
    <el-dialog
      title="添加单词"
      :visible.sync="showDialog"
      width="30%">
      <div class="form">

        <div class="item"><span>&nbsp;&nbsp;单&nbsp;&nbsp;&nbsp;词&nbsp;&nbsp;</span>
          <!--          <input type="text" v-model="word.word" placeholder="回车获取网络解释" @keyup.enter="getWebMean"></input>-->
          <el-input type="text" v-model="word.word" placeholder="回车获取网络解释" @change="getWebMean"></el-input>
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

    <!-- 上传文件的dialog -->
    <el-dialog
      title="上传"
      :visible.sync="showUpload"
      center
      width="30%">
      <el-upload
        class="upload-demo"
        drag
        ref="upload"
        style="margin: 0 auto"
        name="file"
        :auto-upload="false"
        :headers="headers"
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        :on-success="uploadSuccess"
        :action="baseURL">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传excel文件，且不超过500kb</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showUpload = false">取 消</el-button>
         <el-button type="primary" @click="doUpload">确认上传</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import wordApi from "@/api/WordApi";
import auth from "@/utils/auth";

export default {
  name: "AddWord",
  data() {
    return {
      // 添加单词的对话框是否显示
      showDialog: false,
      // 上传选择框是否显示
      showUpload: false,
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
      },
      // 上传文件的路径地址
      baseURL: wordApi.uploadURL(this.typeId),
      // 上传的token请求头
      headers: {"token": auth.getToken()}
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

        // 将数据给置空
        this.word = {
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

      }).catch(error => {
        this.$message.error("添加失败!")
      })
    },
    downloadTemplate() {
      wordApi.downloadTemplate()
    },
    // 文件上传成功后的回调函数
    uploadSuccess(response, file, fileList) {
      if (response.data) {
        this.$message.success("上传解析成功,请刷新后查看!")
      } else {
        this.$message.error("上传解析失败,请重新上传!")
      }
      this.showUpload = false
    },
    // 进行一个手动上传操作
    doUpload() {
      this.$refs.upload.submit();
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

.horizontal {
  display: flex;
}

.horizontal > * {
  margin: 0 5px;
}


</style>
