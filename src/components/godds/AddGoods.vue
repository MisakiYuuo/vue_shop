<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品创建</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-alert title="商品创建区域" :closable="false" type="info" show-icon>
      </el-alert>
      <!--  -->
      <!-- 步骤条 -->
      <el-steps :active="active - 0" finish-status="success" align-center>
        <el-step title="商品信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab栏 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          :tab-position="tabPosition"
          v-model="active"
          :before-leave="beforeTabLeave"
          @tab-click="tabClick"
        >
          <el-tab-pane name="0" label="商品信息">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input
                v-model="addForm.goods_name"
                placeholder="请输入商品名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input
                v-model="addForm.goods_price"
                placeholder="请输入商品价格"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input
                v-model="addForm.goods_weight"
                placeholder="请输入商品重量"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input
                v-model="addForm.goods_number"
                placeholder="请输入商品数量"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                :options="cateList"
                :props="cateProps"
                v-model="addForm.goods_cat"
                @change="handleChange"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="1" label="商品参数">
            <el-form-item
              :label="item.attr_name"
              v-for="item in cateListSC"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  border
                  :label="item2"
                  v-for="(item2, index2) in item.attr_vals"
                  :key="index2"
                ></el-checkbox
              ></el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="2" label="商品属性">
            <el-form-item
              :label="item.attr_name"
              v-for="item in cateOnlyListSC"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="3" label="商品图片">
            <!--action:图片后台的地址  -->
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture"
              :headers="headersOBJ"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane name="4" label="商品内容">
            <quill-editor
              ref="myQuillEditor"
              v-model="addForm.goods_introduce"
            />
            <!-- 添加商品的按钮 -->
            <el-button type="primary" class="btncls" @click="add"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog
      title="图片预览"
      :visible.sync="previewDialogVisible"
      width="60%"
    >
      <img :src="previewPath" />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'add-',
  data () {
    return {
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      headersOBJ: {
        Authorization: sessionStorage.getItem('token')
      },
      previewPath: '',
      previewDialogVisible: false,
      cateList: [],
      // 静态属性
      cateOnlyListSC: [],
      active: '0',
      tabPosition: 'left',
      //   动态参数列表数据
      cateListSC: [],
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        pics: [],
        // 商品所属的分类
        goods_cat: [],
        attrs: [],
        goods_introduce: ''
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      //   级联选择器
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      }
    }
  },
  created () {
    this.getCateList()
  },

  methods: {
    async getCateList () {
      const { data: res } = await this.$axios.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.cateList = res.data
      return this.$message.success(res.meta.msg)
    },
    // 级联选择器的函数
    handleChange () {
      //   console.log(this.addForm.goods_cat)
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
        return this.$message.info('只能选择三级商品')
      }
    },
    // beforeTabLeave
    beforeTabLeave (activeName, oldActiveName) {
      //   console.log('即将离开的标签页' + oldActiveName)
      //   console.log('即将进入的标签页' + activeName)
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请选择商品分类')
        return false
      }
    },
    async tabClick () {
      //   console.log(this.active)
      if (this.active === '1') {
        const { data: res } = await this.$axios.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'many' }
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        //
        res.data.forEach((element) => {
          element.attr_vals =
            element.attr_vals.length === 0 ? [] : element.attr_vals.split(',')
        })
        this.cateListSC = res.data
        // console.log(this.cateListSC)
        return this.$message.success(res.meta.msg)
      } else if (this.active === '2') {
        const { data: res } = await this.$axios.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'only' }
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        //
        // res.data.forEach((element) => {
        //   element.attr_vals =
        //     element.attr_vals.length === 0 ? [] : element.attr_vals.split(',')
        // })
        this.cateOnlyListSC = res.data
        // console.log(this.cateOnlyListSC)
        return this.$message.success(res.meta.msg)
      }
    },
    // 图片预览
    handlePreview (file) {
      console.log(file)
      this.previewPath = file.response.data.url
      this.previewDialogVisible = true
    },
    // 图片移除
    handleRemove (file) {
      //   console.log(file)
      const index = file.response.data.tmp_path
      this.addForm.pics.findIndex((x) => {
        return x.pic === index
      })
      this.addForm.pics.splice(index, 1)
      //   console.log(this.addForm)
    },
    // 图片上传成功
    handleSuccess (response) {
      //   console.log(response)
      const ppp = { pic: response.data.tmp_path }
      this.addForm.pics.push(ppp)
      //   console.log(this.addForm.pics)
    },
    // 添加
    add () {
      this.$refs.addFormRef.validate(async (v) => {
        if (!v) {
          return this.$message.error('请填写必要的内容')
        }
        // 执行添加的业务
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        // 动态参数处理
        this.cateListSC.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(',')
          }
          this.addForm.attrs.push(newInfo)
        })
        // 静态属性处理
        this.cateOnlyListSC.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        // 发起添加商品的请求 商品名字必须唯一
        const { data: res } = await this.$axios.post('goods', form)
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        console.log(form)
        this.$router.push('/goods')
        return this.$message.success(res.meta.msg)
      })
    }
  },
  computed: {
    cateId () {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
.btncls {
  margin: 15px;
}
</style>
