<template>
  <div class="authentication">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>认证课管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="sections">
      <div class="app-container">
        <div class="filter-container">
          <el-input v-model="listQuery.courseName" placeholder="课程名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-select v-model="listQuery.courseType" placeholder="认证类型" clearable style="width: 140px;marginLeft: 10px;" class="filter-item" @change="handleFilter">
            <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
          </el-select>
           <el-select v-model="listQuery.courseStatus" placeholder="发布状态" clearable class="filter-item" style="width: 130px;marginLeft: 10px;" @change="handleFilter">
            <el-option v-for="item in courseTypeOptions" :key="item.key" :label="item.label" :value="item.key" />
          </el-select>
          <el-button class="filter-item" type="primary" icon="el-icon-search" style="marginLeft: 10px;" @click="handleFilter">
            搜索
          </el-button>
          <el-button class="filter-item" type="primary" icon="el-icon-refresh" @click="handleReset">
            重置
          </el-button>
          <el-button class="filter-item" type="primary" icon="el-icon-circle-plus-outline" @click="$router.push({ path: '/basicsCourse' })">
            新增课程
          </el-button>
        </div>

        <el-table
          v-loading="listLoading"
          :data="list"
          border
          fit
          highlight-current-row
          style="width: 100%;"
        >
          <el-table-column label="课程id" prop="id" align="center" width="80">
            <template slot-scope="{row}">
              <span>{{ row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column label="课程名称" width="150px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.timestamp }}</span>
            </template>
          </el-table-column>
          <el-table-column label="认证类型" width="150px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.timestamp }}</span>
            </template>
          </el-table-column>
          <el-table-column label="学费" width="150px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.timestamp }}</span>
            </template>
          </el-table-column>
          <el-table-column label="学员人数" width="150px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.timestamp }}</span>
            </template>
          </el-table-column>
          <el-table-column label="讲师" width="150px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.timestamp }}</span>
            </template>
          </el-table-column>
          <el-table-column label="助教" width="150px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.timestamp }}</span>
            </template>
          </el-table-column>
          <el-table-column label="班主任" width="150px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.timestamp }}</span>
            </template>
          </el-table-column>
          <el-table-column label="qq群" width="150px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.timestamp }}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" width="150px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.timestamp }}</span>
            </template>
          </el-table-column>

          <el-table-column label="发布状态" width="150px" align="center">
            <template slot-scope="{row}">
              <el-switch
                @change="handlePublich(row)"
                v-model="row.publich"
                active-color="#13ce66"
                inactive-color="#ff4949">
              </el-switch>
            </template>
          </el-table-column>
          
          <el-table-column label="操作" align="center" width="400" class-name="small-padding fixed-width">
            <template slot-scope="{row}">
              <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row, '/basicsCourse')">
                编辑
              </el-button>
              <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row, '/outlineCourse')">
                大纲
              </el-button>
              <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row, '/warehouseCourse')">
                题库
              </el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDelete(row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

      </div>
    </div>
  </div>
</template>

<script>
// import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        courseName: '',
        courseType: '',
        courseStatus: ''
      },

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

      courseTypeOptions: [
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
      ]
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
    handleReset() {
      this.listQuery = {
        page: 1,
        limit: 20,
        courseName: '',
        courseType: '',
        courseStatus: ''
      }
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleUpdate(row, route) {
      this.$router.push({ 
        path: route, 
        query: {
          id: row.id
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
    // 发布状态按钮变更
    handlePublich(){

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
