<template>
  <div class="authentication">
		<el-breadcrumb separator="/">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item><a href="/authentication">认证课管理</a></el-breadcrumb-item>
			<el-breadcrumb-item>课程大纲</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="sections">
			<div class="contain">
        <div class="course_outline">
          <div v-if="list === null">没有章节</div>
          <div v-else>
            <el-button class="filter-item" style="margin-bottom: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
              新增章
            </el-button>
            <el-table
              :data="list"
              style="width: 100%;margin-bottom: 20px;"
              row-key="id"
              border
              default-expand-all
              :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
              <el-table-column
                prop="name"
                label="章节名称"
                width="180">
              </el-table-column>

              <el-table-column label="创建人" width="150px" align="center">
                <template slot-scope="{row}">
                  <span>{{ row.createPerson }}</span>
                </template>
              </el-table-column>
              <el-table-column label="创建时间" width="150px" align="center">
                <template slot-scope="{row}">
                  <span>{{ row.createTime }}</span>
                </template>
              </el-table-column>

              <el-table-column fixed="right" align="center" label="操作">
                <template slot-scope="{row}">
                  <div v-if="row.children !== undefined">
                    <el-button
                      size="mini"
                      icon="el-icon-tickets" 
                      class="button-view"
                      @click="handleUpdate(row)"
                      >查看/修改</el-button
                    >
                    <el-button
                      size="mini"
                      class="button-edit" 
                      icon="el-icon-edit"
                      @click="handleCreateChild()"
                      >添加子章节</el-button
                    >
                    <el-button
                      type="danger"
                      size="mini"
                      icon="el-icon-delete"
                      >删除</el-button
                    >
                  </div>
                  <div v-else>
                    <el-button
                      size="mini"
                      icon="el-icon-edit"
                      @click="handleUpdateChild(row)"
                      >查看/修改</el-button
                    >
                    <el-button
                      type="danger"
                      size="mini"
                      icon="el-icon-delete"
                      >删除</el-button
                    >
                  </div>
                </template>
              </el-table-column>
            </el-table>

            <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

            <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
              <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
                <el-form-item label="章节名称" prop="type">
                  <el-input v-model="temp.title" />
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">
                  取消
                </el-button>
                <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
                  确认
                </el-button>
              </div>
            </el-dialog>

            <el-dialog :title="textMapChild[dialogStatus]" :visible.sync="dialogFormVisibleChild">
              <el-form ref="dataForm" :rules="rulesChild" :model="tempChild" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
                <el-form-item label="小节名称" prop="type">
                  <el-input v-model="tempChild.tempChildTitle" />
                </el-form-item>
                <el-form-item label="课程视频" prop="type">
                  <div class="upload_box">
                    <div class="upload_input" style="width:270px;">
                      <uploadVideoBsb @uploadVideo="uploadVideo"></uploadVideoBsb>
                    </div>
                    <div class="upload-add grey-light-bg cursor" style="width:270px;">
                      <i class="el-icon-upload"></i>
                      <span class="upload_span">点击上传视频</span>
                    </div>
                    <span
                      >支持avi, .wma, .rmvb, .rm, .flash,.mp4,.mid, 3GP, .mov, .ogg,
                      .wmv格式文件，且大小不超过500M</span
                    >
                  </div>
                  <div
                    class="upload_list"
                    style="float: left;margin: 10px 0;"
                    v-if="tempChild.tempChildVideo !== ''"
                  >
                    <span>{{ tempChild.tempChildVideo }}</span>
                    <div class="upload_close">
                      <i class="el-icon-circle-close" @click="reduceVideo()"></i>
                    </div>
                  </div>
                </el-form-item>
                <el-form-item label="课程课件" prop="type">
                  <div class="upload_box" style="align-items: baseline;">
                    <div
                      class="upload_input"
                      style="height: 40px;width: 100px;position: relative;"
                    >
                      <el-button type="primary">上传文件</el-button>
                      <upLoadFile
                        name="tempChildCourse"
                        @uploadFile="uploadFile"
                      ></upLoadFile>
                    </div>
                    <div class="upload_list" v-if="tempChild.tempChildCourse !== ''">
                      <span>{{ tempChild.tempChildCourse }}</span>
                      <div class="upload_close">
                        <i class="el-icon-circle-close" @click="reduceResource()"></i>
                      </div>
                    </div>
                  </div>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleChild = false">
                  取消
                </el-button>
                <el-button type="primary" @click="dialogStatus==='create'?createDataChild():updateDataChild()">
                  确认
                </el-button>
              </div>
            </el-dialog>
          </div>
        </div>
      </div>
			<div class="footer">
				<el-button @click="cancelForm('temp')">取消</el-button>
        <el-button
          @click="stepSave()"
          type="primary"
          >保存</el-button
        >
			</div>
		</div>
	</div>

</template>
<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import uploadVideoBsb from "@/components/uploadVideoBsb/index.vue";
import upLoadFile from "@/components/uploadFile/index.vue";

export default {
  name: 'stepTwo',
  components: { Pagination, uploadVideoBsb, upLoadFile },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
      },
      temp: {
        title: '',
      },
      tempChild: {
        tempChildTitle: '',
        tempChildVideo: '',
        tempChildCourse: ''
      },

      dialogFormVisible: false,
      dialogFormVisibleChild: false,
      dialogStatus: '',
      textMap: {
        update: '编辑章',
        create: '新增章'
      },
      textMapChild: {
        update: '编辑小节',
        create: '新增小节'
      },
      rules: {
        title: [{ required: true, message: '请输入课程名称', trigger: 'change' }]
      },
      rulesChild: {
        title: [{ required: true, message: '请输入课程名称', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      
      const response = {
        data: {
          items: [
            {
              id: 1,
              createPerson: 'zs',
              createTime: '2021-4-3',
              name: '第一章',
              children: [{
                id: 31,
                name: '第一节',
                createPerson: 'zs',
                createTime: '2021-4-3',
                tempChildTitle: '',
                tempChildVideo: '',
                tempChildCourse: ''
              }, {
                id: 32,
                name: '第二节',
                createPerson: 'zs',
                createTime: '2021-4-3',
                tempChildTitle: '',
                tempChildVideo: '',
                tempChildCourse: ''
              }]
            }
          ],
          total: 20
        }
      }

      this.list = response.data.items
      this.total = response.data.total
      this.listLoading = false
      // fetchList(this.listQuery).then(response => {
      //   this.list = response.data.items
      //   this.total = response.data.total

      //   // Just to simulate the time of the request
      //   setTimeout(() => {
      //     this.listLoading = false
      //   }, 1.5 * 1000)
      // })
    },
    resetTemp() {
      this.temp = {
        title: '',
      }
    },
    resetTempChild() {
      this.tempChild = {
        tempChildTitle: '',
        tempChildVideo: '',
        tempChildCourse: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      // this.$nextTick(() => {
      //   this.$refs['dataForm'].clearValidate()
      // })
    },
    handleCreateChild() {
      this.resetTempChild()
      this.dialogStatus = 'create'
      this.dialogFormVisibleChild = true
      // this.$nextTick(() => {
      //   this.$refs['dataForm'].clearValidate()
      // })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          // createArticle(this.temp).then(() => {
          //   this.list.unshift(this.temp)
          //   this.dialogFormVisible = false
          //   this.$notify({
          //     title: '成功',
          //     message: '创建成功',
          //     type: 'success',
          //     duration: 2000
          //   })
          // })
        }
      })
    },
    createDataChild() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          // createArticle(this.temp).then(() => {
          //   this.list.unshift(this.temp)
          //   this.dialogFormVisible = false
          //   this.$notify({
          //     title: '成功',
          //     message: '创建成功',
          //     type: 'success',
          //     duration: 2000
          //   })
          // })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdateChild(row) {
      this.tempChild = Object.assign({}, row) // copy obj
      // this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisibleChild = true
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          // updateArticle(tempData).then(() => {
          //   const index = this.list.findIndex(v => v.id === this.temp.id)
          //   this.list.splice(index, 1, this.temp)
          //   this.dialogFormVisible = false
          //   this.$notify({
          //     title: '成功',
          //     message: '更新成功',
          //     type: 'success',
          //     duration: 2000
          //   })
          // })
        }
      })
    },
    updateDataChild() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          // updateArticle(tempData).then(() => {
          //   const index = this.list.findIndex(v => v.id === this.temp.id)
          //   this.list.splice(index, 1, this.temp)
          //   this.dialogFormVisible = false
          //   this.$notify({
          //     title: '成功',
          //     message: '更新成功',
          //     type: 'success',
          //     duration: 2000
          //   })
          // })
        }
      })
    },
    handleDelete(row, index) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    uploadVideo(url) {
      this.tempChild.tempChildVideo = url;
    },
    reduceVideo() {
      this.tempChild.tempChildVideo = "";
    },

    uploadFile(url) {
      this.tempChild.tempChildCourse = url;
    },
    reduceResource() {
      this.tempChild.tempChildCourse = "";
    },

    cancelForm(){
       this.$router.replace({ path: '/authentication' })
		},
    stepContinu(){
      this.$router.push({ path:'/outlineCourse', query: { id: 1} })
    },
    stepSave(){
      this.$router.replace({ path: '/authentication' })
    }
  }
}
</script>

<style lang="less" scoped>
.sections {
  margin: 18px 0;
  background: #fff;
  // padding: 26px;
  position: absolute;
  top: 41px;
  bottom: 0px;
  right: 0;
  left: 0;
  overflow: scroll;
  .step{
    background: white;
    height: 80px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    /deep/ .el-steps{
      width: 80%;
    }
  }
  .contain{
    margin: 20px 0;
    background: white;
    padding: 20px 0;
    border-radius: 10px;
    min-height: 600px;
  }
  .footer{
    display: flex;
    justify-content: center;
  }
}
.course_outline{
  padding: 0 20px;
}
.upload_box {
  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;
  .upload-add {
    height: 210px;
    background: #e8e8e8;
    width: 160px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #999999;
    font-size: 56px;
    font-family: PingFangSC-Thin, PingFang SC;
    font-weight: 100;
    display: flex;
    flex-direction: column;
    .upload_span {
      color: #666666;
      font-size: 12px;
      line-height: 12px;
      margin-top: 10px;
    }
  }
  .upload_input {
    height: 210px;
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
    width: 160px;
  }
  .upload-video {
    height: 210px;
    width: 400px;
  }
  .upload-img {
    width: 160px;
    height: 210px;
  }
  .upload-detail-img {
    width: 440px;
    height: 140px;
  }
  > span {
    color: #666666;
    line-height: 20px;
    margin-left: 40px;
  }
}
.upload_list {
  background: #f2f2f2;
  padding: 10px 60px 10px 20px;
  line-height: 20px;
  margin: 0 10px;
  border-radius: 4px;
  position: relative;
  margin-bottom: 20px;
}
.upload_close {
  position: absolute;
  right: 10px;
  line-height: 14px;
  top: 14px;
}
</style>
