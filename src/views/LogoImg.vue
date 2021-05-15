<template>

  <div style="background-color: #eeeeee"><br><br>
    <el-aside width="10%"></el-aside>
    <el-main>
      <el-table :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)" border style="width: 100%"
                :default-sort = "{prop: 'tableData', order: 'descending'}"
                :header-cell-style="thStyleFun" :cell-style="cellStyleFun">
        <el-table-column fixed prop="id" label="轮播图编号"  sortable>
        </el-table-column>

<!--        <el-table-column  fixed prop="losrc" label="轮播图" width="150">-->

<!--          <template slot-scope="scope">-->
<!--            <el-avatar :size="50" :src="scope.row.logoimg" class="el-avatar" shape="square"></el-avatar>-->
<!--          </template>-->

<!--        </el-table-column>-->
        <el-table-column fixed prop="logoimg" label="图片" >
          <template slot-scope="scope">
            <!--          <el-avatar :size="50" :src="scope.row.src" class="el-avatar" shape="square"></el-avatar>-->
            <el-upload
              class="avatar-uploader"
              action="http://localhost:8181/upload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              accept="image/*"
              name="picture"
              :data="{uploadType:'logoimg',id:scope.row.id}">
              <img v-if="scope.row.logoimg" :src="scope.row.logoimg" class="avatar" style="width: 250px;height: auto">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>

            </el-upload>
            <el-tooltip class="item" effect="dark" content="点击图片直接修改" placement="right">
              <el-button type="text" plain size="small" >提示</el-button></el-tooltip>

          </template>

        </el-table-column>

        <el-table-column  fixed label="操作"  >
          <template slot-scope="scope">
<!--            <el-button @click="edit(scope.row)" type="warning" size="small" plain>修改</el-button>-->
            <el-button @click="deleteBook(scope.row)" type="danger" size="small" >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="right"> <el-button type="primary" round plain @click="addform">添加行</el-button></div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[2, 4, 6, 8]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.length">
      </el-pagination>

      <!-- 修改的对话框 -->
      <el-dialog
        title="修改轮播图"
        :visible.sync="editDialogVisible"
        width="30%" @close="editDialogClosed">


        <el-upload
          class="avatar-uploader"
          action="http://localhost:8181/upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          accept="image/*"
          name="picture"
          :data="{uploadType:'logoimg',id:editForm.id}">
          <img v-if="editForm.logoimg" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>

        <el-form :model="editForm"  ref="editFormRef" label-width="70px">
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialog">更 新</el-button>
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
export default {
  name:'LogoImg',

  data() {
    return {
      currentPage:1, //初始页
      pagesize:4,    //    每页的数据
      imageUrl: './static/images/logo.png',
      // pageSize:'1',
      total:'11',
      tableData: [],
      editForm: {},
      circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      editDialogVisible: false,
      addForm:{
        id:'',
        logoimg:'',
      },
    }
  },

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
    addform(){

      axios.post('http://localhost:8181/losrc/saveAll',this.addForm).then((resp)=> {

        this.findAll()
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
    editDialog(){
      this.editDialogVisible = false
      // console.log(this.userid)
      this.editForm.admin=window.sessionStorage.getItem('admin')
      // axios.post('http://localhost:8181/losrc/updateAllById',this.editForm).then((resp)=>{
      //   if(resp!==null){
      //
      //   }
      // })

      this.$message.success({
        message:"修改成功",
        showClose:true
      });
      this.findAll()

    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    deleteBook(row){
      const _this = this
      // console.log(row.id)
      axios.delete('http://localhost:8181/losrc/deleteAllById/'+row.id).then(function(resp){
        _this.$alert('删除成功！', '消息', {
          confirmButtonText: '确定',
          callback: action => {
            window.location.reload()
          }
        })
        this.findAll()
      })
    },
    edit(row) {
      // this.$router.push({
      //   path: '/AdminPage',
      //   query:{
      //     id:row.id
      //   }
      // })
      this.editDialogVisible = true

      axios.post('http://localhost:8181/losrc/findAllById/'+row.id).then((resp)=>{
        this.editForm = resp.data
        this.imageUrl=resp.data.logoimg
        // console.log(this.editForm )
      })
    },
    findAll(){
      axios.get('http://localhost:8181/losrc/findAll/').then((resp)=>{
        // console.log()
        this.tableData = resp.data
        // this.pageSize = resp.data.size
        // this.total = resp.data.totalElements
        // console.log(resp.data)

        // this.editForm=resp.data
        // this.imageUrl=resp.data.logoimg


      })

    }
    // page(currentPage){
    //   const _this = this
    //   axios.get('http://localhost:8181/losrc/findAll/'+(currentPage-1)+'/6').then(function(resp){
    //     console.log(resp)
    //     _this.tableData = resp.data.content
    //     _this.pageSize = resp.data.size
    //     _this.total = resp.data.totalElements
    //   })
    // }
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
  width: 78px;
  height: 78px;
  line-height: 78px;
  text-align: center;
}
.avatar {
  width: 78px;
  height: 78px;
  display: block;
}
</style>
