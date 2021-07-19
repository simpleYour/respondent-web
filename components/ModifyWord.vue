<template>
  <!-- 修改单词组件 -->
  <div>
    <div @click="modifyDialog = true">
      <!-- 具体样式交给父组件,这里只定义dialog和逻辑代码 -->
      <slot></slot>
    </div>

    <!-- 修改单词dialog -->
    <el-dialog
      title="修改单词"
      :visible.sync="modifyDialog"
      width="30%">
      <el-form :model="word">
        <el-form-item label="单词">
          <el-input type="text" v-model="word.word"></el-input>
        </el-form-item>
        <el-form-item label="中文含义">
          <el-input type="textarea" autosize v-model="word.mean"
                    style="white-space: pre-wrap;"></el-input>
        </el-form-item>
        <el-form-item label="备注信息">
          <el-input type="textarea" autosize v-model="word.notes"
                    style="white-space: pre-wrap;"></el-input>
        </el-form-item>
        <el-form-item label="答题次数">
          <el-input-number v-model="word.count" :step="1" :min="0" :max="100"></el-input-number>
        </el-form-item>
        <el-form-item label="错误次数">
          <el-input-number v-model="word.ecount" :step="1" :min="0" :max="100"></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-upload
            class="upload-demo"
            drag
            :on-success="uploadImageSuccess"
            :action="uploadImageUrl"
            :headers="headers"
            accept="image/*"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传图片，且不超过2000kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyDialog = false">取 消</el-button>
        <el-button type="primary" @click="doModifyWord">确定修改</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import WordApi from "~/api/WordApi";
import auth from "@/utils/auth";

export default {
  name: "ModifyWord",
  data() {
    return {
      // 修改单词的对话框 是否显示
      modifyDialog: false,
      // 上传单词图片地址
      uploadImageUrl: WordApi.uploadImageUrl,
      headers: {"token": auth.getToken()}
    }
  },
  props: {
    // 需要被修改的单词   由于是对象引用传递的方式,父子组件的参数值都会是相等的 从而可以达到不用刷新就可以看到更改后的值
    word: Object
  },
  methods: {
    // 执行修改单词
    doModifyWord() {
      WordApi.modify(this.word.id, this.word).then(res => {
        this.$message({message: "修改成功!", type: "success", center: true})
        this.modifyDialog = false
      })
    },
    // 上传图片成功后的回调函数
    uploadImageSuccess(response, file, fileList) {
      // 给被修改的单词的图片路径赋值
      this.word.image = response.data
      this.$message.success("上传成功!")
    }
  }
}
</script>
<style scoped>

</style>










































