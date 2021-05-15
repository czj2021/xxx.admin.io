<template>

  <div style="background-color: #eeeeee"><br><br>
    <el-aside width="10%"></el-aside>
    <el-main>
      <el-table :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)" border style="width: 100%"
                :default-sort = "{prop: 'tableData', order: 'descending'}"
                :header-cell-style="thStyleFun" :cell-style="cellStyleFun">
        <el-table-column fixed prop="id" label="订单编号" width="120" sortable>
        </el-table-column>


        <el-table-column fixed prop="imgsrc" label="图片" width="100">

          <template slot-scope="scope">
            <el-avatar :size="50" :src="scope.row.imgsrc" class="el-avatar" shape="square"></el-avatar>
          </template>

        </el-table-column>

        <el-table-column fixed prop="bookname" label="书名" width="120">
        </el-table-column>

        <el-table-column fixed prop="num" label="数量" width="80" sortable>
        </el-table-column>
        <el-table-column fixed prop="price" label="价格" width="80">
        </el-table-column>
        <el-table-column fixed prop="userid" label="会员用户编号" width="130" sortable>
        </el-table-column>
        <el-table-column fixed prop="name" label="用户名" width="80">
        </el-table-column>
        <el-table-column fixed prop="address" label="收货地址" width="120">
        </el-table-column>
        <el-table-column fixed prop="phone" label="手机号" width="80">
        </el-table-column>
        <el-table-column fixed prop="ordertime" label="下单时间" width="120" sortable>
        </el-table-column>
        <el-table-column fixed prop="orderstate" label="订单状态" width="80">
        </el-table-column>


        <el-table-column  label="操作"  fixed>
          <template slot-scope="scope">
<!--            <el-button type="primary" size="small"   @click="tongz(scope.row)" plain>通知</el-button>-->
<!--            <el-button type="danger" size="small"  @click="cancel(scope.row)" plain>取消</el-button>-->
<!--            <el-button @click="edit(scope.row)" type="warning" size="small" plain>修改</el-button>-->
            <el-button @click="deleteBook(scope.row)" type="danger" size="small" >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

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
        title="修改首页书架图书"
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
          :data="{uploadType:'imgsrc',id:editForm.id}">
          <img v-if="editForm.imgsrc" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>

        <el-form :model="editForm"  ref="editFormRef" label-width="100px" class="center">
          <el-form-item label="书名" prop="bookname">
            <el-input v-model="editForm.bookname" ></el-input>
          </el-form-item>
          <el-form-item label="数量" prop="num">
            <el-input v-model="editForm.num" ></el-input>
          </el-form-item>
          <el-form-item label="价格" prop="price">
            <el-input v-model="editForm.price" ></el-input>
          </el-form-item>
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
  name:'Order',

  data() {
    return {
      orderstate:[],
      currentPage:1, //初始页
      pagesize:5,    //    每页的数据
      imageUrl: './static/images/logo.png',
      addimageUrl:'',
      // pageSize:'1',
      total:'11',
      tableData: [],
      editForm: {},
      circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      editDialogVisible: false,
    }
  },

  methods: {
    thStyleFun() {
      return 'text-align:center'
    },
    cellStyleFun() {
      return 'text-align:center'
    },
    orderstates(){
      let orderstate=[];
      this.tableData.forEach(function(item, index){
        if(item.orderstate==='0'){
          orderstate[index]='未支付'
          item.orderstate=orderstate[index]
        }
        if(item.orderstate==='1'){
          orderstate[index]='已支付'
          item.orderstate=orderstate[index]
        }
      })
      this.orderstate=orderstate

    },
    handleSizeChange: function (size) {
      this.pagesize = size;
      console.log(this.pagesize)  //每页下拉显示数据
    },
    handleCurrentChange: function(currentPage){
      this.currentPage = currentPage;
      console.log(this.currentPage)  //点击第几页
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
      axios.post('http://localhost:8181/userorder/updateAllById',this.editForm).then((resp)=>{
        if(resp!==null){
          this.$message.success({
            message:"修改成功",
            showClose:true
          });
          this.findAll()
        }
      })



    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    deleteBook(row){
      const _this = this
      // console.log(row.id)
      axios.delete('http://localhost:8181/userorder/deleteById/'+row.id).then(function(resp){
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

      axios.post('http://localhost:8181/userorder/findAllById/'+row.id).then((resp)=>{
        this.editForm = resp.data
        this.imageUrl=resp.data.imgsrc
        // console.log(this.editForm )
      })
    },
    findAll(){
      axios.get('http://localhost:8181/userorder/findAll/').then((resp)=>{
        // console.log()
        this.tableData = resp.data
        this.orderstates();
        this.tableData.orderstate=this.orderstate
        // this.pageSize = resp.data.size
        // this.total = resp.data.totalElements
        // console.log(resp.data)

        // this.editForm=resp.data
        // this.imageUrl=resp.data.logoimg


      })
    }
    // page(currentPage){
    //   const _this = this
    //   axios.get('http://localhost:8181/userorder/findAll/'+(currentPage-1)+'/6').then(function(resp){
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
