<template>

  <div style="background-color: #eeeeee"><br><br>
    <el-aside width="10%"></el-aside>
    <el-main>
      <el-table :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)" border style="width: 100%"
                :default-sort = "{prop: 'tableData', order: 'descending'}"
                :header-cell-style="thStyleFun" :cell-style="cellStyleFun">
        <el-table-column fixed prop="id" label="管理员编号" sortable>
        </el-table-column>
        <el-table-column fixed prop="admin" label="管理员名" >
        </el-table-column>
        <el-table-column fixed prop="password" label="密码" >
        </el-table-column>

        <el-table-column fixed prop="avatar" label="头像" >

          <template slot-scope="scope">
            <el-avatar :size="50" :src="scope.row.adminavatar" class="el-avatar"></el-avatar>
          </template>

        </el-table-column>

        <el-table-column  label="操作"  fixed>
          <template slot-scope="scope">
            <el-button @click="edit(scope.row)" type="warning" size="small" plain>修改</el-button>
            <el-button @click="deleteBook(scope.row)" type="danger" size="small" >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="right"> <el-button type="primary" round plain @click="addform">添加管理员</el-button></div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 20, 40]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.length">
      </el-pagination>

      <!-- 修改的对话框 -->
      <el-dialog
        title="修改管理员信息"
        :visible.sync="editDialogVisible"
        width="40%" @close="editDialogClosed">


        <el-upload
          class="avatar-uploader"
          action="http://localhost:8181/upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          accept="image/*"
          name="picture"
          :data="{uploadType:'adminavatar',id:editForm.id}">
          <img v-if="editForm.adminavatar" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>

        <el-form :model="editForm"  ref="editForm" label-width="100px" class="center" :rules="rules">
          <el-form-item label="管理员名" prop="admin">
            <el-input v-model="editForm.admin" ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="editForm.password"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialog('editForm')">修 改</el-button>
      </span>

      </el-dialog>

      <!-- 添加的对话框 -->
      <el-dialog
        title="添加管理员"
        :visible.sync="addDialogVisible"
        width="30%" @close="addDialogClosed">
        <el-form :model="addForm"  ref="addForm" label-width="80px" class="center" :rules="rules">
          <el-form-item label="管理员名" prop="admin">
            <el-input v-model="addForm.admin" ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDialog('addForm')">添 加</el-button>
      </span>
      </el-dialog>
    </el-main>

    <!--    <el-footer style="position: absolute">-->
    <!--      <el-pagination background layout="prev, pager, next" :page-size="pageSize" :total="total" @current-change="page">-->
    <!--      </el-pagination>-->
    <!--    </el-footer>-->

  </div>
</template>

<script>
import md5 from 'js-md5';
export default {
  name: 'AdminList',
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
          axios.post('http://localhost:8181/admin/saveAll',this.addForm).then((resp)=>{

            // console.log(this.addForm)
            if(resp!==null){
              this.$message.success({
                message:"添加成功",
                showClose:true
              });
              this.findAll()
            }
          })
        } else {
          console.log('error submit!!');
          // console.log(this.ruleForm.status)
          // return false;
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
      const _this = this
      // console.log(row.id)
      axios.delete('http://localhost:8181/admin/deleteAllById/'+row.id).then(function(resp){
        _this.$alert('删除成功！', '消息', {
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
          // this.editForm.admin=window.sessionStorage.getItem('admin')
          axios.post('http://localhost:8181/admin/updateAllById',this.editForm).then((resp)=>{
            if(resp!==null){
              this.$message.success({
                message:"修改成功",
                showClose:true
              });
              this.findAll()
            }
          })
        } else {
          console.log('error submit!!');
          // console.log(this.ruleForm.status)
          // return false;
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

      axios.post('http://localhost:8181/admin/findById/'+row.id).then((resp)=>{
        this.editForm = resp.data
        this.imageUrl=resp.data.adminavatar
        // console.log(this.editForm )
      })

    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      // this.$router.push('/UserPage')
      console.log(this.imageUrl)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    findAll(){
      const _this = this
      axios.get('http://localhost:8181/admin/findAll/').then(function(resp){

        _this.tableData = resp.data
        // _this.pageSize = resp.data.size
        // _this.total = resp.data.totalElements
        // console.log(resp.data)


      })
    }
  },

  data() {

    return {
      editDialogVisible: false,
      editForm: {},
      currentPage:1, //初始页
      pagesize:5,    //    每页的数据
      // pageSize:'1',
      total:'11',
      tableData: [],
      circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      addDialogVisible:false,
      addForm:{
        name:'',
        address:'',
        phone:'',
        userid:'',
      },
      rules: {
        admin: [
          {required: true, message: '请输入管理员名', trigger: 'blur'},
          {min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码',trigger: 'blur'},
          // {min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur'}
        ],
      }
    }
  },


  created() {
    this.findAll()
  }
}
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
