<template>
  <div>
    <div class="container">
      <!-- 查询条件的一个 form -->
      <el-form :inline="true" :model="query" style="margin-top: 8px;margin-left: 5px">
        <el-form-item>
          <el-date-picker
            v-model="query.startDate"
            format="yyyy-MM-dd"
            type="date"
            placeholder="开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="query.endDate"
            format="yyyy-MM-dd"
            type="date"
            placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="单词">
          <el-input type="text" v-model="query.word" @change="search" clearable></el-input>
        </el-form-item>
        <el-form-item label="中文含义">
          <el-input type="text" v-model="query.mean" @change="search" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="search">确认搜索</el-button>
        </el-form-item>

        <el-form-item>
          <add-word :type-id="typeId">
            <el-button type="primary">添加单词</el-button>

            <div slot="batch">
              <el-button>上传<i class="el-icon-upload el-icon--right"></i></el-button>
            </div>

            <div slot="template">
              <el-button>模板下载<i class="el-icon-download el-icon--right"></i></el-button>
            </div>

          </add-word>
        </el-form-item>


      </el-form>


      <div style="margin: -15px 0 3px 0;font-size: small;color: #909399">查询结果:{{ page.total }}条</div>

      <!-- 信息展示的一个table -->
      <el-table
        :data="records"
        style="width: 100%;"
        :fit="true"
        max-height="800"
        ref="table"
        @sort-change="serviceSort"
        stripe>
        <el-table-column label="序号" align="center">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          prop="word"
          min-width="100"
          label="单词">
          <template slot-scope="scope">
            <a :href="scope.row.link" target="_blank">
              <highlight :content="scope.row.word" :high-content="query.word"></highlight>
            </a>
          </template>
        </el-table-column>
        <el-table-column
          label="中文解释"
          min-width="200">
          <template slot-scope="scope">
            <highlight :content="scope.row.mean" :high-content="query.mean"
                       style="white-space: pre-wrap;"></highlight>
          </template>
        </el-table-column>
        <el-table-column
          prop="count"
          sortable="custom"
          width="100"
          label="答题次数">
        </el-table-column>
        <el-table-column
          prop="ecount"
          width="100"
          sortable="custom"
          label="错误次数">
        </el-table-column>
        <el-table-column
          width="100"
          label="发音播放">
          <template slot-scope="scope">
            <el-image @click="playAudio(scope.row.voicePath)" @mouseenter="playAudio(scope.row.voicePath)"
                      style="width: 25px; "
                      class="play-icon"
                      src="/voice.png"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="gmtCreate"
          width="190"
          sortable="custom"
          label="创建时间">
        </el-table-column>
        <el-table-column
          min-width="150"
          label="备注信息">
          <template slot-scope="scope">
            <div style="white-space: pre-wrap;">{{ scope.row.notes }}</div>
          </template>
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
            <el-input type="textarea" autosize v-model="currentModifyWord.mean"
                      style="white-space: pre-wrap;"></el-input>
          </el-form-item>
          <el-form-item label="备注信息">
            <el-input type="textarea" autosize v-model="currentModifyWord.notes"
                      style="white-space: pre-wrap;"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="modifyDialog = false">取 消</el-button>
        <el-button type="primary" @click="doModifyWord(currentModifyWord)">确定修改</el-button>
      </span>
      </el-dialog>

      <!-- 音频播放audio -->
      <audio ref="audio" src="http://dict.youdao.com/dictvoice?audio=explore">
        <!--              <source :src="scope.row.voicePath" type="audio/mpeg">-->
        您的浏览器不支持 audio 元素。
      </audio>
    </div>
  </div>
</template>

<script>
import WordApi from "~/api/WordApi";

export default {
  name: "typeId",
  data() {
    return {
      current: 1,
      size: 20,
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
      // 单词列表的条件查询封装类
      query: {
        "countSort": undefined,
        // 默认以这个日期的降序排序
        "dateSort": false,
        "endDate": "",
        "errorCountSort": undefined,
        "mean": "",
        "notes": "",
        "startDate": "",
        "word": "",
        "wordTypeId": ""
      },
      // 修改单词的对话框 是否显示
      modifyDialog: false,
      // 当前将要被修改的单词
      currentModifyWord: {},
      // 是否正在向后端请求数据中
      loading: false,
      // 判断是否已经加载到了最后一页了
      isEnd: false,
      // 提示用户 "没有更多数据了",这段话的展示,加个锁
      // 这个只是用来保存上一次加载的时间戳,然后以用时间戳之间的距离的方式来加锁
      loadLock: 0,
      // 最近查询的一个分页对象
      page: {},
      // 依据table的父组件的绝对布局,确定table需要展示的一个高度
      tableHeight: 800
    }
  },
  methods: {
    // 依据相关的条件 加载获取这个单词本的单词信息
    getData() {
      if (this.isEnd && this.current > 1) {
        // 如果已经加载到了最后一页,则不继续向下加载了
        // 之所以要判断current>1 是为了防止条件搜索失效

        // 加个1s中的锁,防止疯狂弹出
        if (new Date().getTime() - this.loadLock > 3000) {
          this.$message("没有更多数据了!")
          this.loadLock = new Date().getTime()
        }

        return
      }
      this.loading = true
      WordApi.list(this.query, this.current, this.size).then(res => {
        //将查询结果push进去
        this.records.push(...res.data.records)

        // 以此判断是否已经到了最后一页
        this.isEnd = res.data.current >= res.data.pages

        this.page = res.data

        this.loading = false
      })
    },
    // 当点击了table中的排序字段后,调用该方法,进行一个后端服务器的排序调用
    // 被问我为什么要取obj这么个名字,要问就问element-ui的官方人员
    serviceSort(obj) {
      console.log("接收到的要排序的属性名称为:" + obj.prop)
      // console.log("接收到的排序顺序为:" + obj.order)

      // 对这三个参数进行后端请求排序

      // 将el-table中的排序字符转化为后端所识别的排序字符
      let sortSymbol = obj.order ? obj.order === 'ascending' : undefined

      console.log("排列顺序为:" + sortSymbol)

      // 为了增加用户的一个体验,排序时只允许同时一个参数进行排序 这里就先进行所有排序参数的清空
      this.query.countSort = undefined
      this.query.errorCountSort = undefined
      this.query.dateSort = undefined

      // 对这三个参数进行数据处理
      switch (obj.prop) {
        case 'count':
          this.query.countSort = sortSymbol
          break
        case 'gmtCreate':
          this.query.dateSort = sortSymbol
          break
        case 'ecount':
          this.query.errorCountSort = sortSymbol
          break
      }
      this.search()
    },
    playAudio(voicePath) {
      let audio = this.$refs.audio
      // 只有当上一个音频已经播放结束了,才会去播放下一个音频
      // if (audio.ended) {
      audio.src = voicePath
      audio.play()
      // }
    },
    // 向后端服务器查询符合条件的数据集合
    search() {
      this.records = []
      // 将当前页面重置回到第一页
      this.current = 1
      this.getData()
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
    },
    // table滚动条滚动事件
    scroll() {
      let tableBodyDom = this.$refs.table.bodyWrapper
      tableBodyDom.addEventListener('scroll', () => {
        // 滚动条总高度 减去 窗口高度 减去 已卷入的高度 小于 50px 就加载新数据
        if ((tableBodyDom.scrollHeight - tableBodyDom.clientHeight - tableBodyDom.scrollTop) < 50) {
          // 进行一个节流限制,如果是正在加载中,则不进行数据的请求加载
          if (!this.loading) {
            ++this.current
            this.getData()
          }
        }
      })
    }
  },
  created: function () {
    this.query.wordTypeId = this.typeId
    this.records = []
    this.getData()
  },
  mounted() {
    // 给table添加滚动事件
    this.$refs.table.bodyWrapper.addEventListener("scroll", this.scroll)
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
  /*justify-content: center;*/
  align-items: center;
}

/*.container > * {*/
/*  width: 100%;*/
/*}*/

/* 播放音频图标,鼠标悬浮时的css样式 */
.play-icon:hover {
  background-color: aquamarine;
}

a {
  text-decoration: none;
  font-size: large;
  font-weight: normal;
}

a:visited, a:link {
  /*color: -moz-default-color;*/
  color: black;
}

a:hover {
  text-decoration: aquamarine;
}


</style>
