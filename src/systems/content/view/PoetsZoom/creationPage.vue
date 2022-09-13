<template>
  <div>
    <!-- 进度条 -->
    <el-row
      :gutter="20"
      class="process process_margin"
    >
      <el-col
        :span="18"
        :offset="3"
      >
        <div class="grid-content ">
          <el-steps :active="1">
            <el-step
              title="创作"
              icon="el-icon-edit"
            ></el-step>
              <el-step
                title="上传"
                icon="el-icon-upload"
              ></el-step>
                <el-step
                  title="发布"
                  icon="el-icon-picture"
                ></el-step>
          </el-steps>
        </div>
        </el-col>
        </el-row>
        <!-- 输入框 -->
        <el-row
          :gutter="20"
          class="content "
        >
          <el-col
            :span="12"
            :offset="6"
          >
            <div class="grid-content content_bgcolor">
              <el-input
                class="content_bgcolor"
                type="textarea"
                :autosize="{ minRows: 10, maxRows: 20}"
                :rows="10"
                placeholder="请输入内容..."
                v-model="textarea"
              >
                </el-input>
            </div>
            </el-col>
            </el-row>
            <!-- 提交按钮 -->
            <el-col
            class="button button_margin"
            :span="2"
            :offset="11">
               <el-button type="primary" :round=true @click="testAPI()">保存</el-button>
            </el-col>
<textarea name="" id="" cols="30" rows="10"></textarea>
  </div>
</template>
<script>
export default {
  name: "Creation",
  data() {
    return {
      textarea: ""
    };
  },
  methods:{
    testAPI:function(){
      this.$ajax.get('/api/user/all',{
        // params: {}
      })
     .then(function (response) {
      console.log(JSON.stringify(response.data))
     });
    }
  }
};
</script>
<style>
.process_margin {
  margin-top: 100px;
}
.content_appear {
  height: auto;
  min-height: 300px;
  padding: 20px;
  margin-top: 50px;
}
.el-textarea{
  padding: 5px ;
    border-radius: 10px;
    border:1px solid #409EFF;
  }

.button_margin{
  margin-top: 20px
}
textarea {
  outline:none !important;
  border: none !important;
  font-size: 15px;
  font-weight: bold;
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>