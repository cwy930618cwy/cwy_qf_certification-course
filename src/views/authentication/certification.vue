<template>
	<div class="authentication">
		<el-breadcrumb separator="/">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item><a href="/">认证课管理</a></el-breadcrumb-item>
			<el-breadcrumb-item>添加课程</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="sections">
			<div class="step">
				<el-steps :active="1">
					<el-step title="课程基础信息" icon="el-icon-edit"></el-step>
					<el-step title="课程大纲" icon="el-icon-upload"></el-step>
					<el-step title="课程题库" icon="el-icon-picture"></el-step>
				</el-steps>
			</div>
			<el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
				<el-form-item label="课程名称" prop="courseNmae">
					<el-input v-model="temp.courseNmae" />
				</el-form-item>
				<el-form-item label="认证类型" prop="courseType">
					<el-select v-model="temp.courseType" class="filter-item" placeholder="请输入认证类型">
						<el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
					</el-select>
				</el-form-item>
				<el-form-item label="学费" prop="coursePrice">
					<el-input v-model="temp.coursePrice" />
				</el-form-item>
				<el-form-item label="讲师" prop="courseTeacher">
					<el-select v-model="temp.courseTeacher" class="filter-item" placeholder="请输入讲师">
						<el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
					</el-select>
				</el-form-item>
				<el-form-item label="助教" prop="courseHelp">
					<el-select v-model="temp.courseHelp" class="filter-item" placeholder="请输入助教">
						<el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
					</el-select>
				</el-form-item>
				<el-form-item label="班主任" prop="courseGuide">
					<el-select v-model="temp.courseGuide" class="filter-item" placeholder="请输入班主任">
						<el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
					</el-select>
				</el-form-item>
				<el-form-item label="QQ群" prop="courseGroup">
					<el-input v-model="temp.courseGroup" />
				</el-form-item>
				<el-form-item label="课程封面" prop="coursePic">

					<div class="upload_box">
						<div
							class="upload_input"
							:style="{
								width: temp.coursePic ? '440px' : '160px',
								height: temp.coursePic ? '140px' : '210px',
							}"
						>
							<qiniuUpload
								name="coursePic"
								@uploadPic="upLoadDetailUrl"
							></qiniuUpload>
						</div>
						<img
							v-if="temp.coursePic"
							:src="temp.coursePic"
							class="upload-detail-img"
							alt=""
						/>
						<div v-else class="upload-add grey-light-bg cursor">
							+
						</div>
						<span
							>支持png/jpg/jpeg/webp格式文件，且大小不超过2m，建议尺寸：1200*380px</span
						>
					</div>

				</el-form-item>
				<el-form-item label="课程简介" prop="courseIntro">
					<el-input v-model="temp.courseIntro" />
				</el-form-item>
			</el-form>
			<div class="but">
				<el-button @click="cancelForm('temp')">取消</el-button>
        <el-button
          type="primary"
          >保存</el-button
        >
				<el-button @click="cancelForm('temp')">下一步</el-button>
			</div>
		</div>
	</div>
</template>
<script>
// import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import { parseTime } from '@/utils'
import qiniuUpload from "@/components/upload/qiniuUpload.vue";
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination, qiniuUpload },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: undefined
      },
      importanceOptions: [1, 2, 3],

      sortOptions: [
        { 
          label: '全部', 
          key: 0 
        }, 
        { 
          label: '华为认证', 
          key: 1 
        }, 
        { 
          label: '类型2', 
          key: 2 
        }
      ],

      calendarTypeOptions: [
        { 
          label: '全部', 
          key: 0 
        }, 
        { 
          label: '已发布', 
          key: 1 
        }, 
        { 
          label: '未发布', 
          key: 2 
        }
      ],

      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        courseNmae: '',
        courseType: 0,
        coursePrice: '',
        courseTeacher: 0,
        courseHelp: 0,
        courseGuide: 0,
				courseGroup: '',
				coursePic: '',
				courseIntro: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        courseNmae: [{ required: true, message: '请输入课程名称', trigger: 'change' }],
        courseType: [{ required: true, message: '请输入认证类型', trigger: 'change' }],
        coursePrice: [{ required: true, message: '请输入学费', trigger: 'change' }],
        courseTeacher: [{ required: true, message: '请输入讲师', trigger: 'change' }],
        courseHelp: [{ required: true, message: '请输入助教', trigger: 'change' }],
        courseGuide: [{ required: true, message: '请输入班主任', trigger: 'change' }],
        courseGroup: [{ required: true, message: '请输入QQ群', trigger: 'change' }],
        coursePic: [{ required: true, message: '请输入课程封面', trigger: 'change' }],
        courseIntro: [{ required: true, message: '请输入课程简介', trigger: 'change' }]
      },
      downloadLoading: false
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
              id: 0,
              timestamp: 0,
              publich: true
            },
            {
              id: 1,
              timestamp: 1,
              publich: false
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
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
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
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
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
    handleDelete(row, index) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      // fetchPv(pv).then(response => {
      //   this.pvData = response.data.pvData
      //   this.dialogPvVisible = true
      // })
    },
    handleDownload() {
      this.downloadLoading = true
      // import('@/vendor/Export2Excel').then(excel => {
      //   const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
      //   const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
      //   const data = this.formatJson(filterVal)
      //   excel.export_json_to_excel({
      //     header: tHeader,
      //     data,
      //     filename: 'table-list'
      //   })
      //   this.downloadLoading = false
      // })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },

    // 发布状态按钮变更
    handlePublich(){

    },

		// 图片上传
		upLoadDetailUrl(url) {
      this.temp.detailUrl = url;
      // this.$refs.dataForm.fields.map((i) => {
      //   if (i.prop === "detailUrl") {
      //     i.clearValidate();
      //     return false;
      //   }
      // });
    },

		cancelForm(){

		}
  }
}
</script>

<style lang="less" scoped>
.sections {
  margin: 18px 0;
  background: #fff;
  padding: 26px;
  position: absolute;
  top: 41px;
  bottom: 0px;
  right: 0;
  left: 0;
  overflow: scroll;
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
