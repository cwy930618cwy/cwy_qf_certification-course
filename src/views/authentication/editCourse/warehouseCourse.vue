<template>
  <div class="authentication">
		<el-breadcrumb separator="/">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item><a href="/authentication">认证课管理</a></el-breadcrumb-item>
			<el-breadcrumb-item>课程题库</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="sections">
			<div class="contain">
        <div class="app-container">
          <div class="number">
            <span>题库说明：课程会随机在此题库内抽取试题，组成考试，请保证题库内试题数量充足</span>
            <span style="marginLeft: 80px;">设置每场考试抽取试题数量：</span>
            <el-input type="number" style="width: 100px;"></el-input>
          </div>
          <div class="filter-container">
            <el-input v-model="listQuery.title" placeholder="搜索题干" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
            <el-button class="filter-item" type="primary" icon="el-icon-search" style="marginLeft: 10px;" @click="handleFilter">
              搜索
            </el-button>
            <el-button class="filter-item" type="primary" icon="el-icon-refresh" @click="handleFilter">
              重置
            </el-button>
            <el-button class="filter-item" type="primary" icon="el-icon-circle-plus-outline" @click="handleCreate">
              新增试题
            </el-button>
            <el-button class="filter-item" type="primary" icon="el-icon-upload" @click="handleUpload">
              批量导入
            </el-button>
          </div>

          <el-table
            :key="tableKey"
            v-loading="listLoading"
            :data="list"
            border
            fit
            highlight-current-row
            style="width: 100%;"
            @sort-change="sortChange"
          >
            <el-table-column label="题干" width="150px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.timestamp }}</span>
              </template>
            </el-table-column>
            <el-table-column label="创建人" width="150px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.timestamp }}</span>
              </template>
            </el-table-column>
            <el-table-column label="创建时间" width="150px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.timestamp }}</span>
              </template>
            </el-table-column>
            
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
              <template slot-scope="{row}">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row)">
                  编辑
                </el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleUpdate(row)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

          <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
              <el-form-item label="题干" prop="title">
                <el-input v-model="temp.title" />
              </el-form-item>
              <el-form-item v-for="item in temp.checks" :key="item.title" :label="item.title" prop="title">
                <el-input v-model="item.name" />
              </el-form-item>
              <el-button @click="addCheck">
                添加选项
              </el-button>
              <el-button @click="deleteCheck">
                删除最后一项
              </el-button>
              <el-form-item label="答案解析" style="margin-top: 10px;" prop="title">
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

          <el-dialog title="批量导入" :visible.sync="dialogFormVisibleUpload">
            <div v-if="tempUpload.status === 'start'">
              没有文件
            </div>
            <div v-else-if="tempUpload.status === 'pendding'">
              <div class="upload_box" style="align-items: baseline;">
                <div class="upload_list">
                  <span>{{ tempUpload.file }}</span>
                  <div class="upload_close">
                    <i class="el-icon-circle-close" @click="reduceResource()"></i>
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              上传完毕
            </div>
            <div slot="footer" class="dialog-footer">
              <div
                v-if="tempUpload.status === 'start'"
                class="upload_input"
                style="height: 40px;width: 100px;position: relative;"
              >
                <el-button type="primary">上传文件</el-button>
                <upLoadFile
                  name="tempChildCourse"
                  @uploadFile="uploadFile"
                ></upLoadFile>
              </div>
              <el-button type="primary" v-if="tempUpload.status === 'pendding'" @click="leadFile">
                导入
              </el-button>
              <div
                v-if="tempUpload.status === 'pendding'"
                class="upload_input"
                style="height: 40px;width: 100px;position: relative;"
              >
                <el-button type="primary">重新选择</el-button>
                <upLoadFile
                  name="tempChildCourse"
                  @uploadFile="uploadFile"
                ></upLoadFile>
              </div>
              <el-button type="primary" v-if="tempUpload.status === 'final'" @click="dialogFormVisibleUpload = false">
                完成
              </el-button>
            </div>
          </el-dialog>
        </div>
      </div>
		</div>
	</div>

</template>

<script>
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' 
import upLoadFile from "@/components/uploadFile/index.vue";

export default {
  name: 'ComplexTable',
  components: { Pagination, upLoadFile },
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
      tempUpload: {
        file: '',
        status: 'start'
      },
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
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published',
        checks: []
      },
      dialogFormVisible: false,
      dialogFormVisibleUpload: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
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
              publich: true,
              checks: []
            },
            {
              id: 1,
              timestamp: 1,
              publich: false,
              checks: []
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
        type: '',
        checks: []
      }
    },
    resetTempUpload() {
      this.tempUpload = {
        file: '',
        status: 'start'
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
    handleUpload() {
      this.resetTempUpload()
      this.dialogFormVisibleUpload = true
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

    // 新增试题选项
    addCheck(){
      this.temp.checks.push(
        {
          title: '选项' + this.temp.checks.length,
          name: '',
          checked: false
        }
      )
    },
    deleteCheck(){
      this.temp.checks.pop()
    },

    // 导入文件
    uploadFile(url) {
      this.tempUpload.file = url;
      this.tempUpload.status = 'pendding'
    },
    reduceResource() {
      this.tempUpload.file = "";
    },
    leadFile() {
      this.tempUpload.status = 'final'
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
</style>
