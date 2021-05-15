<template>

  <div style="background-color: #eeeeee"><br><br>

    <el-table :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)" border style="width: 100%"
              :default-sort = "{prop: 'tableData', order: 'descending'}"
              :header-cell-style="thStyleFun" :cell-style="cellStyleFun">
      <el-table-column fixed prop="id" label="分类编号"  sortable>
      </el-table-column>
      <el-table-column prop="titlekey" label="类别"  >
      </el-table-column>

      <el-table-column  label="操作" >
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="warning" size="small" plain>修改</el-button>
          <el-button @click="deleteBook(scope.row)" type="danger" size="small" >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="right"> <el-button type="primary" round plain @click="addform">添加分类</el-button></div>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 10, 20, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="tableData.length">
    </el-pagination>

    <!--    <el-footer style="position: absolute">-->
    <!--      <el-pagination background layout="prev, pager, next" :page-size="pageSize" :total="total" @current-change="page">-->
    <!--      </el-pagination>-->
    <!--    </el-footer>-->
    <!-- 添加的对话框 -->
    <el-dialog
      title="添加类别"
      :visible.sync="addDialogVisible"
      width="30%" @close="addDialogClosed">
      <el-form :model="addForm"  ref="addForm" label-width="80px" class="center" :rules="rules">
        <el-form-item label="类别" prop="titlekey">
          <el-input v-model="addForm.titlekey" ></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDialog('addForm')">添 加</el-button>
      </span>
    </el-dialog>

    <!-- 修改的对话框 -->
    <el-dialog
      title="修改类别"
      :visible.sync="editDialogVisible"
      width="40%" @close="editDialogClosed">



      <el-form :model="editForm"  ref="editForm" label-width="100px" class="center" :rules="rules">
        <el-form-item label="类别" prop="titlekey">
          <el-input v-model="editForm.titlekey" ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialog('editForm')">修 改</el-button>
      </span>

    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'ClassifyList',
  methods: {
    thStyleFun() {
      return 'text-align:center'
    },
    cellStyleFun() {
      return 'text-align:center'
    },
    handleSizeChange: function (size) {
      this.pagesize = size;
      console.log(this.pagesize)  //每页下拉显示数据
    },
    handleCurrentChange: function(currentPage){
      this.currentPage = currentPage;
      console.log(this.currentPage)  //点击第几页
    },
    addDialog(addForm){
      this.$refs[addForm].validate((valid) => {
        if (valid) {
          this.addDialogVisible = false
          // this.addForm.userid=window.sessionStorage.getItem('userId')
          axios.post('http://localhost:8181/classify/saveAll',this.addForm).then((resp)=>{

            // console.log(this.addForm)
            if(resp!==null){
              this.$message.success({
                message:"添加成功",
                showClose:true
              });
              this.findAll()
            }
          })
        }
        else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    addform(){
      this.addDialogVisible = true

    },
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    deleteBook(row){
      // console.log(row)
      const _this = this
      axios.delete('http://localhost:8181/classify/deleteAllById/'+row.id).then(function(resp){
        _this.$alert(row.titlekey+'删除成功！', '消息', {
          confirmButtonText: '确定',
          callback: action => {
            window.location.reload()
          }
        })
        this.findAll()
      })
    },
    editDialog(editForm){
      this.$refs[editForm].validate((valid) => {
          if (valid) {
      this.editDialogVisible = false
      // console.log(this.userid)
      this.editForm.admin=window.sessionStorage.getItem('admin')
      axios.post('http://localhost:8181/classify/updateAllById',this.editForm).then((resp)=>{
        if(resp!==null){
          this.$message.success({
            message:"修改成功",
            showClose:true
          });
          this.findAll()
        }
      })
          }
          else {
            console.log('error submit!!');
            return false;
          }
      });


    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    edit(row) {
      // this.$router.push({
      //   path: '/AdminPage',
      //   query:{
      //     id:row.id
      //   }
      // })

      this.editDialogVisible = true

      axios.post('http://localhost:8181/classify/findById/'+row.id).then((resp)=>{
        this.editForm = resp.data
        // console.log(this.editForm )
      })

    },
    findAll(){
      const _this = this
      axios.get('http://localhost:8181/classify/findAll/').then(function(resp){
        // console.log(resp)
        _this.tableData = resp.data
        // _this.pageSize = resp.data.size
        // _this.total = resp.data.totalElements
      })
    },
    // page(currentPage){
    //   const _this = this
    //   axios.get('http://localhost:8181/classify/findAll/'+(currentPage-1)+'/6').then(function(resp){
    //     console.log(resp)
    //     _this.tableData = resp.data.content
    //     _this.pageSize = resp.data.size
    //     _this.total = resp.data.totalElements
    //   })
    // }
  },

  data() {
    return {
      editDialogVisible: false,
      editForm: {},
      currentPage:1, //初始页
      pagesize:5,    //    每页的数据
      addDialogVisible:false,
      addForm:{
        titlekey:'',
      },
      // pageSize:'1',
      total:'11',
      tableData: [],
      rules: {
        titlekey: [
          { required: true, message: '类别不能为空', trigger: 'blur' }
        ],
      }
    }
  },

  created() {
    this.findAll()
  },
  computed:{

  }
}
</script>
