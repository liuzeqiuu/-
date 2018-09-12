<template>
  <div class="product">
    <el-form label-width="100px" :rules="rules" :model="product" ref="ruleForm">
      <h1>产品信息</h1>
      <el-form-item label="产品名称:" class="inputBox" prop="productName">
        <el-input v-model="product.productName"></el-input>
      </el-form-item>
      <el-form-item class="auto" label="商家名称:" prop="businessName">
        <el-autocomplete
            v-model="product.businessName"
            :fetch-suggestions="querySearchAsync"
            @select="handleSelect"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item class="proportion" label="产品价格:" prop="productPrice">
        <el-input v-model.number="product.productPrice">
          <template slot="append">
          <span class="addr">{{ product.tokenName || '名称'}}</span>
          </template>
        </el-input>
        <div class="proportionShow" v-show="proportionShow">
          <p :key="index" v-for="(item,index) in proportion" v-show='item.id === product.businessId'>
            <span>=</span>
            <span> {{ item.value*product.productPrice }}</span> <span>{{item.token}}</span>
          </p>
        </div>
        <div class="proportionShow" v-show="!proportionShow">
          <p :key="index" v-for="(item,index) in proportion">
            <span>=</span>
            <span> {{ item.currencyValue }}</span> <span>{{item.currencyName}}</span>
          </p>
        </div>
      </el-form-item>
      <el-form-item class="proportion" label="定金:" prop="deposit">
        <el-input v-model.number="product.deposit">
          <template slot="append">
            <span class="addr">{{ product.tokenName || '名称'}}</span>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item class="time" label="预售时间:" required>
        <el-date-picker
          v-model="presell_time"
          type="daterange"
          align="right"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy 年 MM 月 dd 日"
          value-format="timestamp"
          @change = "presell(presell_time)"
          >
        </el-date-picker>
        <div class="sugest">
          <p v-show="!presell_show">预售时间选择范围建议为一个月,计算日期时间为选择结束日期当天的23:59:59</p>
          <p v-show="presell_show">开始时间为{{presell_start}} 00:00:00,结束时间为{{presell_end}} 23:59:59</p>
        </div>
      </el-form-item>
      <el-form-item class="time" label="提货时间:" required>
        <el-date-picker
          v-model="pick_time"
          type="daterange"
          align="right"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy 年 MM 月 dd 日"
          value-format="timestamp"
          @change = "pick(pick_time)"
          >
        </el-date-picker>
        <div class="sugest">
          <p v-show="!pick_show">提货时间选择范围建议为两个月,计算日期时间为选择结束日期当天的23:59:59<span v-show="presell_show">,开始时间应为{{pickStartTime}}</span></p>
          <p v-show="pick_show">开始时间为{{pick_start}} 00:00:00,结束时间为{{pick_end}} 23:59:59</p>
        </div>
      </el-form-item>
      <el-form-item class="recommened" label="是否推荐:">
        <div class="upload">
          <p>
            <span @click="pc" :class="{active:equipment==0}">pc</span>
            <span @click="phone" :class="{active:equipment==1}">手机</span>
          </p>
          <div class="upload-content" v-show="equipment==0">
            <el-radio v-model="pcrecommened" :label="1" @change="pcrecom(pcrecommened)">是</el-radio>
            <el-radio v-model="pcrecommened" :label="0" @change="pcrecom(pcrecommened)">否</el-radio>
            <el-upload
              class="upload-demo"
              :action="uploadAddress"
              :before-remove="beforeRemove"
              :on-remove="removeBanner"
              :on-error="onImgUploadError"
              :on-success="pcBannerUploadSuccess"
              :limit= "1"
              :on-exceed = "exceed"
              :file-list="pcfilelist"
              list-type="picture"
              multiple>
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip"></div>
            </el-upload>
          </div>
          <div class="upload-content" v-show="equipment==1">
            <el-radio v-model="mbrecommened" :label="1" @change="mbrecom(mbrecommened)">是</el-radio>
            <el-radio v-model="mbrecommened" :label="0" @change="mbrecom(mbrecommened)">否</el-radio>
            <el-upload
              class="upload-demo"
              :action="uploadAddress"
              :before-remove="beforeRemove"
              :on-remove="removeBanner"
              :on-error="onImgUploadError"
              :on-success="mobileBannerUploadSuccess"
              :limit = "1"
              :on-exceed = "exceed"
              :file-list="mbfilelist"
              list-type="picture"
              multiple>
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip"></div>
            </el-upload>
          </div>
        </div>
      </el-form-item>
      <el-form-item class="serial inputBox" label="展示序号:" prop="displaySort">
        <el-input v-model.number="product.displaySort" placeholder="请输入数字"></el-input>
      </el-form-item>
      <el-form-item class="online" label="是否上线:">
        <el-radio v-model="product.isonline" :label="1">是</el-radio>
        <el-radio v-model="product.isonline" :label="0">否</el-radio>
      </el-form-item>
      <h1>产品详情</h1>
      <el-form-item class="upload detail">
        <p>
          <span @click="photo()" :class="{active:details==1}">详情页展示图片</span>
          <span @click="intro()" :class="{active:details==2}">产品介绍</span>
          <span @click="breviary()" :class="{active:details==3}">产品缩略图</span>
        </p>
        <div class="upload-content" v-show="details==1">
          <el-upload
          class="upload-demo"
          :action="uploadAddress"
          :before-remove="beforeRemove"
          :on-remove="removembDetatil"
          :on-error="onImgUploadError"
          :file-list = "detailFile"
          list-type="picture"
          :on-success="detailsSuccess"
          multiple>
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip"></div>
          </el-upload>
        </div>
        <div class="editor" v-show="details==2">
          <vue-editor useCustomImageHandler
          @imageAdded="handleImageAdded" v-model="product.productDes"></vue-editor>
        </div>
        <div class="upload-content" v-show="details==3">
          <el-upload
            class="upload-demo"
            :action="uploadAddress"
            :before-remove="beforeRemove"
            :on-remove="removemBreviary"
            :on-error="onImgUploadError"
            :limit = "1"
            :on-exceed = "exceed"
            list-type="picture"
            :file-list="breviaryFile"
            :on-success="breviarySuccess"
            multiple>
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip"></div>
          </el-upload>
        </div>
      </el-form-item>
      <div class="button">
        <el-button type="submit" @click="submit" :disabled='isDisabled' >{{submitButtonName}}</el-button>
        <el-button type="info" @click="link">取消</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import { VueEditor } from 'vue2-editor'
import { productionsApiPrefix } from '@/common/cgi/apiPrefix.js'
import { SUCCESS_CODE } from '@/admin/config/api_verify.js'
import { formatTime } from '@/common/helper.js'

export default {
  components: {
    VueEditor
  },
  props: ['uuid'],
  data () {
    return {
      product: {
        productName: '',
        businessId: '',
        businessName: '',
        productPrice: '',
        tokenName: 'token',
        currencyValue: 20,
        currency: 'BTY',
        deposit: '',
        presaleStartTime: '',
        presaleEndTime: '',
        carrygoodsStartTime: '',
        carrygoodsEndTime: '',
        groomBannerList: [
          {
            purposeType: 0,
            isgroom: 0
          },
          {
            purposeType: 1,
            isgroom: 0
          }
        ],
        displaySort: '',
        isonline: 1,
        detailsPictureList: [],
        productDes: null,
        thumbnail: {},
        userId: ''
      },
      rules: {
        productName: [
          { required: true, message: '请输入产品名称', trigger: 'blur' }
        ],
        businessName: [
          { required: true, message: '请选择商家', trigger: 'change' }
        ],
        productPrice: [
          { required: true, message: '请输入产品价格', trigger: 'blur' },
          // { type: 'number', message: '价格必须为数字' }
          { pattern: /\d{1}/, message: '价格必须为数字' }
        ],
        deposit: [
          { required: true, message: '请输入产品定金', trigger: 'blur' },
          { pattern: /\d{1}/, message: '价格必须为数字' }
        ],
        displaySort: [
          { required: true, message: '请输入展示序号', trigger: 'blur' },
          { pattern: /\d{1}/, message: '价格必须为数字' }
        ]

      },
      id: '',
      presell_time: [],
      pick_time: [],
      content: '请输入内容',
      equipment: '0',
      pcrecommened: 0,
      mbrecommened: 0,
      detailImageUrl: '',
      breviaryImageUrl: '',
      pcImageUrl: '',
      mbImageUrl: '',
      input: '',
      filelist: [],
      pcfilelist: [],
      mbfilelist: [],
      detailFile: [],
      breviaryFile: [],
      details: 1,
      dialogVisible: false,
      options: [{
        value: 'BTY',
        label: 'BTY'
      }, {
        value: 'YCC',
        label: 'YCC'
      }, {
        value: 'ETH',
        label: 'ETH'
      }, {
        value: 'BTC',
        label: 'BTC'
      }, {
        value: 'DCR',
        label: 'DCR'
      }],
      uploadAddress: `${productionsApiPrefix}/fileUpload/uploadFile`,
      bussiness: '',
      presell_start: '',
      presell_end: '',
      pick_start: '',
      pick_end: '',
      pickStartTime: '',
      pick_show: false,
      presell_show: false,
      isDisabled: false,
      proportion: [],
      proportionShow: true
    }
  },
  computed: {
    submitButtonName () {
      return this.uuid ? '提交修改' : '创建'
    }
  },
  methods: {
    // 删除图片之前,确定图片是否删除
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    // 删除banner图的图片
    removeBanner (file, filelist) {
      let self = this
      this.deleteImgOnServer(file.name, () => {
        this.product.groomBannerList.forEach(function (currentValue, index, array) {
          if (currentValue.filePath === file.name) {
            array.splice(index, 1)
          }
        })
        self.$notify({
          title: '成功',
          message: '图片删除成功',
          type: 'success'
        })
      })
    },
    // 删除产品详情页图片
    removembDetatil (file, filelist) {
      let self = this
      this.deleteImgOnServer(file.name, () => {
        this.product.detailsPictureList.forEach(function (currentValue, index, array) {
          if (currentValue.filePath === file.name) {
            array.splice(index, 1)
          }
        })
        self.$notify({
          title: '成功',
          message: '图片删除成功',
          type: 'success'
        })
      })
    },
    // 删除缩略图时
    removemBreviary (file, filelist) {
      let self = this
      this.deleteImgOnServer(file.name, () => {
        self.$notify({
          title: '成功',
          message: '图片删除成功',
          type: 'success'
        })
      })
      this.product.thumbnail = ''
    },
    // 图片上传成功的处理
    onImgUploadSuccess (res, success, error) {
      if (res.code !== SUCCESS_CODE) {
        // 文件上传失败
        this.$notify.error({
          title: '错误',
          message: res.resultMsg
        })
        error && error()
        return
      }
      const { data = [] } = res
      if (data.length === 0) {
        this.onImgUploadError()
        error && error()
        return
      }

      success && success(data)
    },
    // pc，移动端的banner图片上传成功时，给product.groomBannerList添加元素,包括当前平台以及是否推荐
    pcBannerUploadSuccess (res) {
      let self = this
      this.onImgUploadSuccess(res, (data) => {
        if (this.product.groomBannerList.length !== 0) {
          this.product.groomBannerList.forEach(function (currentValue) {
            if (currentValue.purposeType === 0) {
              currentValue.isgroom = self.pcrecommened
              currentValue.filePath = data[0].path
              currentValue.fileUrl = data[0].url
            }
          })
        }
      })
    },
    mobileBannerUploadSuccess (res) {
      let self = this
      this.onImgUploadSuccess(res, (data) => {
        if (this.product.groomBannerList.length !== 0) {
          this.product.groomBannerList.forEach(function (currentValue) {
            if (currentValue.purposeType === 1) {
              currentValue.isgroom = self.mbrecommened
              currentValue.filePath = data[0].path
              currentValue.fileUrl = data[0].url
            }
          })
        }
      })
    },
    pcrecom (pcrecommened) {
      this.product.groomBannerList.forEach(function (currentValue, index, array) {
        if (currentValue.purposeType === 0) {
          currentValue.isgroom = pcrecommened
        }
      })
    },
    mbrecom (mbrecommened) {
      this.product.groomBannerList.forEach(function (currentValue, index, array) {
        if (currentValue.purposeType === 1) {
          currentValue.isgroom = mbrecommened
        }
      })
    },
    // 详情页图片上传成功时，给product.detailsPictureList添加元素
    detailsSuccess (res) {
      this.onImgUploadSuccess(res, (data) => {
        this.product.detailsPictureList.push({
          filePath: data[0].path,
          fileUrl: data[0].url
        })
      })
    },
    // 缩略图上传成功时，给product里的thumbnail赋值
    breviarySuccess (res) {
      this.onImgUploadSuccess(res, (data) => {
        this.product.thumbnail = {
          filePath: data[0].path,
          fileUrl: data[0].url
        }
      })
    },
    // 图片未上传成功时，出现报错
    onImgUploadError () {
      this.$notify({
        title: '错误',
        message: '图片上传未能成功',
        type: 'warning'
      })
    },
    // 删除图片
    deleteImgOnServer (filePath, success) {
      this.myFetch({
        apiName: 'deleteFile',
        postdata: {filePath},
        success: success
      })
    },
    // 图片数超出允许上传范围
    exceed () {
      this.$notify({
        type: 'warning',
        title: '提示',
        message: '只能上传一张图片'
      })
    },
    // 切换为pc
    pc () {
      this.equipment = 0
    },
    // 切换为移动端
    phone () {
      this.equipment = 1
    },
    // 详情展示图片显示
    photo () {
      this.details = 1
    },
    // 产品介绍显示
    intro () {
      this.details = 2
    },
    handleImageAdded: function (file, Editor, cursorLocation, resetUploader) {
      // 图片加入编辑器
      var formData = new FormData()
      formData.append('file', file)
      this.myFetch({
        apiName: 'fileupload',
        postdata: formData,
        success: (filelist = []) => {
          if (filelist.length === 0) {
            // 上传出错
            this.$notify({
              title: '错误',
              message: '图片上传未能成功',
              type: 'warning'
            })
          } else {
            filelist.forEach(item => {
              let maxWidth = '750px !important'
              Editor.insertEmbed(cursorLocation, 'image', item.url, maxWidth)
            })
          }
          resetUploader()
        }
      })
    },
    // 上传缩略图部分显示
    breviary () {
      this.details = 3
    },
    // 获取商家信息，在商家名称focus时，出现下拉框
    loadAll () {
      this.myFetch({
        apiName: `businessName`,
        success: (Content) => {
          const businessContent = Content.map(({ id, businessName, switchTokenVOS, tokenName }) => {
            return { id, value: businessName, switchTokenVOS, tokenName }
          })
          this.bussiness = businessContent
        }
      })
    },
    querySearchAsync (queryString, cb) {
      var bussiness = this.bussiness
      var results = bussiness
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        cb(results)
      }, 100 * Math.random())
    },
    createStateFilter (queryString) {
      return (state) => {
        return (state.id.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    // 商家被选中后，给产品的商家id赋值
    handleSelect (item) {
      if (this.product.businessId !== item.id) {
        this.proportionShow = true
        this.product.businessId = item.id
        this.product.tokenName = item.tokenName
        let self = this
        self.proportion = []
        let id = item.id
        item.switchTokenVOS.forEach(function (current) {
          let list = {
            id: '',
            currencyValue: '',
            currencyName: ''
          }
          list.id = id
          list.value = current.currencyValue / current.tokenValue
          list.token = current.currencyName
          self.proportion.push(list)
        })
      }
    },
    // 提货与预售时间只需要精确到日
    presell (presellTime) {
      if (presellTime.length === 2) {
        let time = presellTime[1] + 86400
        this.pickStartTime = formatTime(time, 'yyyy年MM月dd日')
        this.presell_show = true
        this.presell_start = formatTime(presellTime[0], 'yyyy-MM-dd')
        this.presell_end = formatTime(presellTime[1], 'yyyy-MM-dd')
        this.product.presaleStartTime = presellTime[0] / 1000
        this.product.presaleEndTime = presellTime[1] / 1000
      }
    },
    pick (pickTime) {
      if (pickTime.length === 2) {
        this.pick_show = true
        this.pick_start = formatTime(pickTime[0], 'yyyy-MM-dd')
        this.pick_end = formatTime(pickTime[1], 'yyyy-MM-dd')
        this.product.carrygoodsStartTime = pickTime[0] / 1000
        this.product.carrygoodsEndTime = pickTime[1] / 1000
      }
    },
    search () {
      let self = this
      console.log(this.product.userId)
      // 如果有产品id,需要获取产品信息
      if (this.$route.params.uuid !== undefined) {
        // 如果没有产品id 不需要获取产品信息
        if (!this.uuid) {
          // this.$router.replace('/404')
          return
        }
        this.myFetch({
          apiName: 'getGoods',
          postdata: {
            id: this.uuid
          },
          success (data) {
            self.proportionShow = false
            self.id = data.id
            self.product.productName = data.productName
            self.product.businessId = data.businessId
            self.product.businessName = data.businessName
            self.product.productPrice = data.productPrice
            self.product.tokenName = data.tokenName
            self.product.currencyValue = data.currencyValue
            self.product.currency = data.currency
            self.product.deposit = data.deposit

            // 对提货时间和预售时间进行一些处理
            self.presell_time.push(data.presaleStartTime * 1000, data.presaleEndTime * 1000)
            self.pick_time.push(data.carrygoodsStartTime * 1000, data.carrygoodsEndTime * 1000)
            self.presell(self.presell_time)
            self.pick(self.pick_time)

            self.proportion = data.switchTokenVOS
            console.log(self.proportion)
            self.product.displaySort = data.displaySort

            // 将产品在pc和移动端是否推荐的banner图显示在网页上
            self.product.groomBannerList = data.groomBannerList
            const filelist = data.groomBannerList
            filelist.forEach(function (currentValue, index) {
              if (currentValue.purposeType === 0) {
                // pc端是否推荐
                if (currentValue.isgroom === 1) {
                  self.pcrecommened = 1
                } else {
                  self.pcrecommened = 0
                }
                if (currentValue.fileUrl !== undefined) {
                  let pcfilelist = [{
                    url: '',
                    name: ''
                  }]
                  pcfilelist[0].url = currentValue.fileUrl
                  pcfilelist[0].name = currentValue.filePath
                  self.pcfilelist = pcfilelist
                }
                // pc端展示的banner图片
              } else {
                // 移动端是否推荐
                if (filelist[index].isgroom === 1) {
                  self.mbrecommened = 1
                } else {
                  self.mbrecommened = 0
                }
                // 移动端展示的banner图片
                if (currentValue.fileUrl !== undefined) {
                  let mbfilelist = [{
                    url: '',
                    name: ''
                  }]
                  mbfilelist[0].url = filelist[index].fileUrl
                  mbfilelist[0].name = filelist[index].filePath
                  self.mbfilelist = mbfilelist
                }
              }
            })
            // 产品是否上线
            if (data.isonline === 1) {
              self.product.isonline = 1
            } else {
              self.product.isonline = 0
            }
            // 将获取的详情页显示图片显示在网页上
            self.product.detailsPictureList = data.detailsPictureList
            const detail = data.detailsPictureList.map(({ fileUrl, filePath }) => {
              return { name: filePath, url: fileUrl }
            })
            self.detailFile = detail
            self.product.productDes = data.productDes
            self.product.thumbnail = data.thumbnailDTO

            // 将获取的产品缩略图显示在网页上
            let breviaryFile = {
              url: '',
              name: ''
            }
            breviaryFile.url = data.thumbnailDTO.fileUrl
            breviaryFile.name = data.thumbnailDTO.filePath
            self.breviaryFile.push(breviaryFile)
          }
        })
      }
    },
    checkDateField () {
      // 根据产品原型验证 预售时间和提货时间
      // 开始时间 不可以 大于等于 结束时间
      // 预售时间的结束时间 不可以 大于 提货时间的开始时间
      // 预售的时间默认是按照这一天的23:59:59起算
      // 预售周期至少为 30天
      // 提货周期至少为 60天
      const {presaleStartTime, presaleEndTime, carrygoodsStartTime, carrygoodsEndTime} = this.product
      if (!presaleStartTime || !presaleEndTime) {
        return '请选择预售时间'
      }
      if (!carrygoodsStartTime || !carrygoodsEndTime) {
        return '请选择提货时间'
      }
      if (presaleStartTime > presaleEndTime) {
        return '预售开始时间不可以大于结束时间'
      }
      if (carrygoodsStartTime > carrygoodsEndTime) {
        return '提货开始时间不可以大于结束时间'
      }
      if (presaleEndTime > carrygoodsStartTime) {
        return '提货开始时间不可以小于预售结束时间'
      }
      if (presaleEndTime + 86400 !== carrygoodsStartTime) {
        return '提货开始时间必须是预售结束时间的第二天'
      }
      return null
    },
    submit () {
      let self = this
      self.isDisabled = true
      let errmsg = this.checkDateField()
      if (errmsg) {
        self.isDisabled = false
        this.$notify.error({
          title: '错误',
          message: errmsg
        })
        return
      }
      // 如果没有产品id,点击确定，添加产品
      if (self.product.detailsPictureList.length === 0) {
        self.isDisabled = false
        self.$notify.error({
          title: '错误',
          message: '请上传产品详情图片'
        })
      } else if (self.product.thumbnail.filePath === undefined) {
        self.isDisabled = false
        self.$notify.error({
          title: '错误',
          message: '请上传产品缩略图'
        })
      } else {
        if (typeof (this.$route.params.uuid) === 'undefined') {
          this.myFetch({
            apiName: `savegoods`,
            postdata: this.product,
            error (res) {
              self.isDisabled = false
              self.$notify.error({
                title: '错误',
                message: res.resultMsg
              })
            },
            success (res) {
              self.isDisabled = true
              self.$notify({
                title: '成功',
                type: 'success',
                message: '产品添加成功'
              })
              window.setTimeout(function () {
                self.$router.push('/center/products')
              }, 3000)
            }
          })
        } else {
          // 如果有产品id,点击确定，编辑产品
          this.product.id = this.id
          this.myFetch({
            apiName: `updateGoods`,
            postdata: this.product,
            error (res) {
              self.isDisabled = false
              self.$notify.error({
                title: '错误',
                message: res.resultMsg
              })
            },
            success (res) {
              self.isDisabled = true
              self.$notify({
                title: '成功',
                type: 'success',
                message: '产品编辑成功'
              })
              window.setTimeout(function () {
                self.$router.push('/center/products')
              }, 3000)
            }
          })
        }
      }
    },
    link () {
      this.$router.push('/center/products')
    }
  },
  mounted () {
    this.product.userId = sessionStorage.getItem('userId')
    if (this.uuid) {
      this.search()
    }
    this.loadAll()
  }
}
</script>
<style lang="scss">
  .product{
    background: #fff;
    padding: 40px 80px;
    h1{
      margin-bottom: 20px;
      font-style: normal;
      font-size: 20px;
      font-weight: 400;
      color: #666666
    }
    .inputBox{
      .el-input__inner{
        width: 40%;
      }
    }
    .active{
      background: rgba(242, 242, 242, 1);
    }
    p{
      font-size: 14px;
      .el-input{
        width: 40%;
      }
    }
    .auto{
      margin-top: 20px;
      width: 100%;
      .el-autocomplete{
        width: 80%;
        .el-input{
          width: 50%;
        }
      }
    }
    span{
      display: inline-block;
      margin-right: 40px;
    }
    .price{
      margin: 20px 0;
      font-size: 14px;
      .price-content{
        position: relative;
        width: 50%;
        height: 100px;
        padding: 10px 0 10px 20px;
        border: 1px solid #dcdfe6;
        border-radius: 6px;
        display: inline-block;
        p{
          display: inline-block;
          margin-right: 20px;
          width: 18%;
          text-align: center;
          font-size: 12px;
          line-height: 30px;
          .el-input{
            width: 100%;
          }
          .el-select{
            width: 80%;
          }
        }
        p:nth-of-type(4){
          width: 18%;
          .el-input__suffix{
              right: -34px;
          }
        }
        span{
          margin-right: 20px;
        }
      }
    }
    .proportion{
      margin-top: 20px;
      span{
        width: 60px;
        text-align: right;
      }
      .el-input{
        width: 30%;
      }
      .el-input-group__append{
        background: none;
        padding: 0;
        text-align: center;
        width: 100px !important;
        span{
          margin: 0 !important;
          width: 100px !important;
          text-align: center !important;
        }
      }
      .proportionShow{
        span{
          margin: 0;
          padding: 0;
          padding-right: 10px;
          width: auto;
          text-align: center;
        }
      }
    }
    .time{
      font-size: 14px;
      .el-input__inner{
        .el-range-input:nth-of-type(2){
          margin-left: 10px;
        }
      }
      .sugest{
        margin-left: 20px;
        display: inline-block;
        font-size: 13px;
        color: #f00;
        p{
          display: inline-block;
        }
      }
    }
    .recommened{
      margin-top:20px;
      font-size: 14px;
      position: relative;
      .vetercial{
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    .upload{
      display: inline-block;
      p{
        span{
          width: 120px;
          height: 40px;
          margin:0;
          text-align: center;
          line-height: 40px;
          display: inline-block;
          border: 1px solid #dcdfe6;
          border-radius: 6px;
          cursor: pointer;
        }

      }
      .upload-content{
        width: 500px;
        border: 1px solid #dcdfe6;
        padding: 20px;
        border-radius: 6px;
        .el-button{
          margin-top: 10px;
          width: 80px;
        }
      }
      .editor{
        width: 700px;
        border-radius: 6px;
      }
    }
    .serial{
      margin-top: 20px;
    }
    .is-checked{
      .el-radio__inner{
        border-color: $admin_main_color;
        background: $admin_main_color;
      }
      .el-radio__label{
        color: $admin_main_color;
      }
    }
    .el-radio__inner,.el-radio__input,.el-radio__label{
      margin: 0px;
    }
    .online{
      margin: 20px 0;
    }
    .button{
      padding-left: 100px;
      .el-button{
        span{
          margin: 0;
        }
        .is-disabled{
          background: gray;
        }
      }
      margin: 40px 0;
    }
    .detail{
      .el-form-item__content{
        margin: 0 !important;
      }
    }
    .upload-content{
      ul{
        li{
          width: 80%;
          height: 140px;
          position: relative;
          img{
            max-height: 120px;
            min-height: 120px;
            width: auto;
          }
        }
      }
    }
    .ql-editor{
      img{
        max-width: 750px;
      }
    }
  }
</style>
