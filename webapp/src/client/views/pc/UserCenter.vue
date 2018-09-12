<template>
  <div class="UserCenter">
    <div class="UserCenter-account">
      <div class="UserCenter-account-top">
        <div class="UserCenter-account-tabs">
          <div @click="account = 'info'" :class="{'UserCenter-account-tab': true,'tab-active': (account === 'info')}">
            <span>账号信息</span>
          </div>
          <div @click="getMyAssetList()" :class="{'UserCenter-account-tab': true,'tab-active': (account === 'asset')}">
            <span>账号资产</span>
          </div>
        </div>
      </div>

      <div v-if="account == 'info'">
        <div v-if="userInfoLoading" class="UserCenter-account-loading">
          <loading></loading>
        </div>
        <div class="UserCenter-account-info" v-if="!userInfoLoading">
          <div class="UserOrder-account-info-row">
            <i class="iconfont icon-icon-test2"></i>
            <span>手机号码：</span>
            <span v-if="userInfo.userPhone">{{userInfo.userPhone}}</span>
            <!--未设置手机号码时-->
            <div class="notSet" v-if="!userInfo.userPhone">
              <i class="iconfont icon-gantanhao_icon"></i>
              <span>未设置</span>
            </div>
            <div class="UserOrder-account-info-add" v-if="!userInfo.userPhone">
              <span @click="phoneNumberSeen = true">添加</span>
            </div>

          </div>

          <div class="UserOrder-account-info-row">
            <i class="iconfont icon-icon-test1"></i>
            <span style="display:inline-block;width:61px;">邮<span style="float:right">箱：</span></span>
            <span v-if="userInfo.userEmail">{{userInfo.userEmail}}</span>
            <!--未设置邮箱时-->
            <div class="notSet" v-if="!userInfo.userEmail">
              <i class="iconfont icon-gantanhao_icon"></i>
              <span>未设置</span>
            </div>
            <div class="UserOrder-account-info-add" v-if="!userInfo.userEmail">
              <span @click="emailAddressDialogSeen = true">添加</span>
            </div>

          </div>

          <div class="UserOrder-account-info-row">
            <i class="iconfont icon-icon-test"></i>
            <span>登录密码：</span>
            <span class="password-strength-word">密码强度</span>
            <div class="password-strength low" v-if="userInfo.level === '弱'">
              <span>低</span>
            </div>
            <div class="password-strength middle" v-if="userInfo.level === '中'">
              <span>中</span>
            </div>
            <div class="password-strength hight" v-if="userInfo.level === '强'">
              <span>高</span>
            </div>
            <span class="changeDense" @click="changePasswordDialogSeen = true">去修改</span>
          </div>
        </div>

      </div>
      <!--个人资产-->
      <div class="UserCenter-account-asset" v-if="account == 'asset'">
        <div class="UserCenter-account-asset-cnotent">
          <div class="UserCenter-account-asset-cnotentSearch">
            <input type="text" v-model="searchAsset.assetsname" placeholder="币种搜索">
            <el-button @click="searchMyAssetList">搜索</el-button>
          </div>
          <div class="UserCenter-account-asset-cnotentSwitch">
            <span>隐藏资产数量为0的币种</span>
            <el-switch
              v-model="value2"
              @change = "searchMyAssetList"
              active-color="#13ce66"
              inactive-color="#9fa1a5">
            </el-switch>
          </div>
          <el-table
            v-loading="loadingAssetList"
            :data="assetList"
            stripe
            style="width: 100%">
            <el-table-column
              prop="currencyname"
              label="币种"
              width="180">
            </el-table-column>
            <el-table-column
              prop="usable_amount"
              label="可用数量"
              width="180">
            </el-table-column>
            <el-table-column
              prop="freeze_amount"
              label="冻结数量">
            </el-table-column>
            <el-table-column
              label="操作">
              <template slot-scope="scope">
                <el-button v-if="scope.row.type === 1" type="text" @click="showWalletDialog(scope.row)">钱包地址</el-button>
                <span v-if="scope.row.type === 1" class="UserCenter-account-asset-line"></span>
                <el-button type="text" :class="{'UserCenter-account-asset-active': scope.row.type === 1}" :disabled="scope.row.type === 1" @click="showDepositDialog(scope.row)">充币</el-button>
                <span class="UserCenter-account-asset-line"></span>
                <el-button type="text" :class="{'UserCenter-account-asset-active': scope.row.type === 1}" :disabled="scope.row.type === 1" @click="showWithDrawDialog(scope.row)">提币</el-button>
              </template>
            </el-table-column>
          </el-table>

          <p class="recordTitle">充提记录</p>
          <el-table
            :data="userTransfers">
            <el-table-column
              prop="transferTime"
              label="时间">
            </el-table-column>
            <el-table-column
              prop="transferType"
              label="类型">
            </el-table-column>
            <el-table-column
              prop="transferAddress"
              width="450"
              label="地址">
            </el-table-column>
            <el-table-column
              prop="transferNum"
              label="数量">
            </el-table-column>
            <el-table-column
              prop="transferState"
              label="状态">
            </el-table-column>
          </el-table>
        </div>
      </div>

    </div>

    <div class="UserCenter-address" v-if="account == 'info'">
      <span class="UserCenter-address-title">管理地址</span>
      <el-button type="text" class="addAddressBtn" @click="addReceiveAddressVisibel = true">+添加新的收货地址</el-button>

      <!--已存在地址页面-->
      <el-table ref="addressData" :data="addressData" style="width: 100%" v-if="addressSeen == true">
        <el-table-column  label="选择" width="150" type="index">
          <template slot-scope="scope">
            <div :class="{'UserCenter-address-square':true, 'square-active': tableIndex === scope.$index && isAddressDeault}" @click="defaultAdress(scope)">
              <i class="iconfont icon-bt_duigou_B" v-if="(tableIndex === scope.$index) && isAddressDeault"></i>
            </div>
            <span :class="{'word-active': (tableIndex === scope.$index) && isAddressDeault}">【默认地址】</span>
          </template>
        </el-table-column>
        <el-table-column property="harvestName" label="姓名" width="180">
        </el-table-column>
        <el-table-column label="地址">
          <template slot-scope="scope">
            <span>{{scope.row.showAddress}} {{scope.row.addressDetails}}</span>
          </template>
        </el-table-column>
        <el-table-column property="phone" label="电话" width="180">
        </el-table-column>
        <el-table-column  label="操作" width="180">
          <template slot-scope="scope">
            <el-button @click="editReceiveAddress(scope.row)">编辑</el-button>
            <el-button :disabled="deleteReceiveAddressLoading" @click="deleteAddress(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 不存在收货地址页面-->
      <div class="notSet notSetAdress" v-if="addressSeen == false">
        <i class="iconfont icon-gantanhao_icon"></i>
        <span>你还未添加收货地址</span>
        <span id="notSetAdress-add">新增</span>
      </div>

    </div>

    <!-- 修改密码弹框 -->
    <div class="changePassword">
      <el-dialog
        :visible.sync = "changePasswordDialogSeen"
        @close="closeChangePassword">
        <div class="openDialog-form">
          <span class="openDialog-form-title">修改密码</span>
          <el-form :model="changePassword" status-icon :rules="changePasswordRules" ref="changePassword" label-width="75px">
            <el-form-item label="原密码: " prop="oldPassword">
              <el-input type="password" v-model="changePassword.oldPassword" class="passwordInput"></el-input>
            </el-form-item>
            <el-form-item label="新密码: " prop="newPassword">
              <el-input type="password" v-model="changePassword.newPassword" class="passwordInput"></el-input>
            </el-form-item>
            <el-form-item label="重复密码: " prop="repeatPassword">
              <el-input type="password" v-model="changePassword.repeatPassword" class="passwordInput"></el-input>
            </el-form-item>
          </el-form>
          <div class="openDialog-form-bottom">
            <el-button class="openDialog-form-cancel" @click="closeChangePassword">取消</el-button>
            <el-button class="whiteColor-blueBackground" @click="comfirmChangePassword" :loading="changePasswordLoading">提交</el-button>
          </div>
        </div>
      </el-dialog>
    </div>

    <!-- 手机号码设置弹框-->
    <div class="set-info-dialog">
      <el-dialog
        :visible.sync = "phoneNumberSeen"
        @close="closeSetPhoneDialog">
        <div class="openDialog-form">
          <span class="openDialog-form-title">手机号码设置</span>
          <el-form :model="phoneNumberSet" :rules="phoneNumberSetRules" ref="phoneNumberSet" label-width="75px">
            <el-form-item label="手机号码: " prop="number">
              <el-input class="input-set-info" v-model="phoneNumberSet.number"></el-input>
            </el-form-item>
            <el-form-item label="验证码: " prop="code">
              <el-input class="input-send-code" v-model="phoneNumberSet.code"></el-input>
              <el-button class="whiteColor-blueBackground" @click="getPhoneCode" v-if="!sentPhoneCodeSeen">获取验证码</el-button>
              <el-button class="whiteColor-blueBackground" title="不可以频繁操作"  v-if="sentPhoneCodeSeen" :disabled="true">{{time}}秒后获取</el-button>
            </el-form-item>
          </el-form>
          <div class="openDialog-form-bottom">
            <el-button class="openDialog-form-cancel" @click="closeSetPhoneDialog">取消</el-button>
            <el-button class="whiteColor-blueBackground" @click="comfirmSetPhoneNumber" :loading="comfirmSetPhoneLoading">提交</el-button>
          </div>
        </div>
      </el-dialog>
    </div>

    <!-- 邮箱设置弹框-->
    <div class="set-info-dialog">
      <el-dialog
        :visible.sync="emailAddressDialogSeen"
        @close="closeSetEmail">
        <div class="openDialog-form">
          <span class="openDialog-form-title">邮箱设置</span>
          <el-form :model="emailAddressSet" :rules="emailAddressSetRules" ref="emailAddressSet" label-width="75px">
            <el-form-item label="邮箱地址: " prop="address">
              <el-input class="input-set-info" v-model="emailAddressSet.address"></el-input>
            </el-form-item>
            <el-form-item label="验证码: " prop="code">
              <el-input class="input-send-code" v-model="emailAddressSet.code"></el-input>
              <el-button class="whiteColor-blueBackground" @click="getEmailCode" v-if="!sentEmailCodeSeen">获取验证码</el-button>
              <el-button class="whiteColor-blueBackground" title="不可以频繁操作" v-if="sentEmailCodeSeen" :disabled="true">{{time}}秒后获取</el-button>
            </el-form-item>
          </el-form>
          <div class="openDialog-form-bottom">
            <el-button class="openDialog-form-cancel" @click="closeSetEmail">取消</el-button>
            <el-button class="whiteColor-blueBackground" @click="comfirmSetEmail" :loading="comfirmSetEmailLoading">提交</el-button>
          </div>
        </div>
      </el-dialog>
    </div>

    <div class="forTextAlignLeft">
      <!-- 充币弹框-->
    <deposit-dialog :coinName="depositDialog.coinName"
                    :address="depositDialog.addressName"
                    :imgPath="depositDialog.qrcodeImg"
                    @onClose="handleDepositClose"
                    :dialogVisible="depositDialog.show"/>
    <!-- 提币弹框-->
    <withdraw :dialogVisible="withDrawDialog.show"
              :coinName="withDrawDialog.coinName"
              :addressForm="withDrawDialog.addressForm"
              :feeForm="withDrawDialog.feeForm"
              :maxNum="(withDrawDialog.usable_amount+withDrawDialog.freeze_amount)"
              :extractableNum="withDrawDialog.usable_amount"
              :tel="withDrawDialog.contactPhone"
              :email="withDrawDialog.contactEmail"
              @addressAdd="handleAddressAdd"
              @sendCode = "sendWithDrawCode"
              @submit="handleWithDraw"
              @ToSet = "toSetInfo"
              @onClose="handleWithDrawDialogClose"/>
    <!-- 添加钱包地址弹框-->
    <add-address :dialogVisible="walletAddressDialog.show"
              :email = "userInfo.userEmail"
              :tel = "userInfo.userPhone"
              @getCode = "getPurseAdressCode"
              @onClose="handleCloseWalletAddressDialog"
              @submit="handleSubmitWalletAddress"></add-address>
    </div>
    <!--编辑收货地址 -->
        <edit-address
          @close="colseEditAddress"
          @submit="comfirmEditAddress"
          :existAddress= "existAddress"
          :visibleSeen = "editReceiveAddressVisibel"
          :loading = "editReceiveAddressLoading">
        </edit-address>

    <!--添加收货地址-->
        <edit-address
          @close="colseAddAddress"
          :visibleSeen = "addReceiveAddressVisibel"
          :loading = "addReceiveAddressLoadding"
          :resetForm = "addAddressReset"
          @submit="comfirmAddAddress">
        </edit-address>

    <!--钱包地址 弹框-->
    <div class="purseAddressDialog">
      <el-dialog
        :visible.sync = "purseAddressDialog"
        title="钱包地址"
        width="35%">
        <p>
          <span class="tips">您的钱包地址为: </span>
          <el-button class="handleCopy" @click = "handleCopy" :data-clipboard-text="purseAddress">复制钱包地址</el-button>
        </p>
        <p class="purseAddress">{{purseAddress}}</p>
        <div class="clear"></div>
      </el-dialog>
    </div>

  </div>
</template>

<script>
import Deposit from '@/common/components/Deposit.vue'
import WithDraw from '@/common/components/WithDraw.vue'
import AddAddress from '@/common/components/AddAdress.vue'
import editAddress from '@/common/components/editAddress.vue'
import LoadingComponent from '@/common/components/LoadingComponent.vue'
import Clipboard from 'clipboard'
export default {
  components: {
    'deposit-dialog': Deposit,
    'withdraw': WithDraw,
    'add-address': AddAddress,
    'edit-address': editAddress,
    'loading': LoadingComponent
  },
  data () {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入手机号码'))
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('请输入正确的手机号'))
        }
      }
    }
    var checkEmail = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入邮箱地址'))
      } else {
        callback()
      }
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.changePassword.repeatPassword !== '') {
          this.$refs.changePassword.validateField('repeatPassword')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.changePassword.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      isAddressDeault: false,
      addAddressReset: false,
      loadingAssetList: false,
      sentPhoneCodeSeen: false,
      sentEmailCodeSeen: false,
      comfirmSetEmailLoading: false,
      comfirmSetPhoneLoading: false,
      changePasswordLoading: false,
      userInfoLoading: true,
      time: 60,
      purseAddress: '',
      editReceiveAddressVisibel: false,
      addReceiveAddressVisibel: false,
      account: 'info', // 默认打开账号信息
      postEditAddressId: '',
      existAddress: {},
      addAddressSeen: false,
      addReceiveAddressLoadding: false,
      editReceiveAddressLoading: false,
      deleteReceiveAddressLoading: false,
      userTransfers: [],
      userInfo: {},
      infoExit: true, // 默认用户信息已存在
      addressSeen: true, // 默认已存在管理地址
      propsAddress: {
        addressDetails: '',
        harvestName: '',
        phone: ''
      },
      phoneNumberSet: {
        number: '',
        code: ''
      },
      emailAddressSet: {
        address: '',
        code: ''
      },
      changePassword: {
        oldPassword: '',
        newPassword: '',
        repeatPassword: ''
      },
      input: '',
      purseAddressDialog: false,
      value2: false,
      changePasswordDialogSeen: false,
      phoneNumberSeen: false,
      emailAddressDialogSeen: false,
      depositDialog: {
        coinName: '',
        addressName: '',
        qrcodeImg: '',
        show: false
      },
      withDrawDialog: {
        show: false,
        coinName: 'BTY',
        addressForm: [{address: 1, purseAdr: 'adasdasdasda'}, {address: 1, purseAdr: 'dddfwewfqewqfq'}],
        feeForm: [
          {currencyId: 1, minerMoney: 0.0007},
          {currencyId: 1, minerMoney: 0.0027},
          {currencyId: 1, minerMoney: 0.0037}
        ],
        usable_amount: 40,
        freeze_amount: 20,
        contactEmail: '203423412@qq.com',
        contactPhone: 13211114444,
        currencyId: 1
      },
      walletAddressDialog: {
        show: false
      },
      addressData: [],
      assetList: [],
      searchAsset: {
        userId: '',
        type: '',
        assetsname: ''
      },
      currentRow: null,
      tableIndex: 0,
      emailAddressSetRules: {
        address: [
          {validator: checkEmail, trigger: 'change'},
          {validator: checkEmail, trigger: 'blur'}
        ]
      },
      phoneNumberSetRules: {
        number: [
          {validator: checkPhone, trigger: 'change'},
          {validator: checkPhone, trigger: 'blur'}
        ]
      },
      changePasswordRules: {
        oldPassword: [
        ],
        newPassword: [
          { validator: validatePass, trigger: 'blur' }
        ],
        repeatPassword: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    console.log('user here')
    this.getMyAddress()
    this.getMyInfo()
  },
  methods: {
    // 获取 个人资产
    getMyAssetList () {
      this.account = 'asset'
      this.loadingAssetList = true
      this.searchAsset.userId = this.$store.state.User.userId
      this.myFetch({
        apiName: 'getMyAssetList',
        postdata: this.searchAsset,
        success: ({userAssets, userTransfers}) => {
          this.assetList = userAssets
          this.userTransfers = userTransfers
        },
        complete: () => {
          this.loadingAssetList = false
        }
      })
    },
    // 获取 个人信息
    getMyInfo () {
      this.userInfoLoading = true
      this.myFetch({
        apiName: 'getUserInfo',
        postdata: {id: this.$store.state.User.userId},
        success: (userInfo) => {
          this.userInfo = userInfo
          console.log('打印一下this.userInfo', this.userInfo)
        },
        complete: () => {
          this.userInfoLoading = false
        }
      })
    },
    // 手机号码设置  => 获取验证码
    getPhoneCode () {
      // this.phoneNumberSet.number  手机号码
      this.$refs['phoneNumberSet'].validate((valid) => {
        if (valid) {
          this.sentPhoneCodeSeen = true
          let interval = window.setInterval(() => {
            if ((this.time--) <= 0) {
              this.time = 60
              this.sentPhoneCodeSeen = false
              window.clearInterval(interval)
            }
          }, 1000)
          this.myFetch({
            apiName: 'getVerifyCode',
            postdata: {
              name: this.phoneNumberSet.number,
              verificationType: '29',
              code: ''
            },
            success: (res) => {
              console.log('手机成功获取了验证码', res)
            }
          })
        } else {
          return false
        }
      })
    },
    // 手机号码设置  => 点击确定
    comfirmSetPhoneNumber () {
      this.$refs['phoneNumberSet'].validate((valid) => {
        if (valid) {
          this.comfirmSetPhoneLoading = true
          console.log('进来了')
          this.myFetch({
            apiName: 'setUserInfo',
            postdata: {
              id: this.$store.state.User.userId,
              type: 0,
              phone: this.phoneNumberSet.number,
              verificationType: '29',
              code: this.phoneNumberSet.code
            },
            success: (res) => {
              console.log(res)
              this.$notify({
                title: '提示',
                message: '设置成功',
                type: 'success'
              })
              this.closeSetPhoneDialog()
              this.getMyInfo()
            },
            complete: () => {
              this.comfirmSetPhoneLoading = false
            }
          })
        } else {
          return false
        }
      })
    },
    // 关闭 设置手机号码弹框
    closeSetPhoneDialog () {
      this.phoneNumberSeen = false
      this.$refs['phoneNumberSet'].resetFields()
    },
    // 邮箱设置 => 获取验证码
    getEmailCode () {
      // this.emailAddressSet.address
      this.$refs['emailAddressSet'].validate((valid) => {
        if (valid) {
          this.sentEmailCodeSeen = true
          let interval = window.setInterval(() => {
            if ((this.time--) <= 0) {
              this.time = 60
              this.sentEmailCodeSeen = false
              window.clearInterval(interval)
            }
          }, 1000)
          this.myFetch({
            apiName: 'getVerifyCode',
            postdata: {
              name: this.emailAddressSet.address,
              verificationType: '30',
              code: ''
            },
            success: (res) => {
              console.log('成功发送了邮箱验证码', res)
            }
          })
        } else {
          return false
        }
      })
    },
    // 邮箱设置 => 点击确定
    comfirmSetEmail () {
      this.$refs['emailAddressSet'].validate((valid) => {
        if (valid) {
          this.comfirmSetEmailLoading = true
          this.myFetch({
            apiName: 'setUserInfo',
            postdata: {
              id: this.$store.state.User.userId,
              type: 1,
              email: this.emailAddressSet.address,
              verificationType: '30',
              code: this.emailAddressSet.code
            },
            success: (res) => {
              console.log(res)
              this.$notify({
                title: '提示',
                message: '设置成功',
                type: 'success'
              })
              this.closeSetEmail()
              this.getMyInfo()
            },
            complete: () => {
              this.comfirmSetEmailLoading = false
            }
          })
        } else {
          return false
        }
      })
    },
    // 关闭邮箱设置
    closeSetEmail () {
      this.emailAddressDialogSeen = false
      this.$refs['emailAddressSet'].resetFields()
    },
    // 修改密码 => 点击确定
    comfirmChangePassword () {
      this.changePasswordLoading = true
      this.$refs['changePassword'].validate((valid) => {
        if (valid) {
          this.myFetch({
            apiName: 'modifypassword',
            postdata: {
              userId: this.$store.state.User.userId,
              oldpassword: this.changePassword.oldPassword,
              newpassword: this.changePassword.newPassword,
              resetpasswords: this.changePassword.repeatPassword,
              ruled: 1 // 识别是用户操作
            },
            success: (res) => {
              console.log(res)
              this.$notify({
                title: '提示',
                message: '密码修改成功!',
                type: 'success'
              })
              this.closeChangePassword()
            },
            complete: () => {
              this.changePasswordLoading = false
            }
          })
        } else {
          return false
        }
      })
    },
    // 关闭 修改密码弹窗
    closeChangePassword () {
      this.changePasswordDialogSeen = false
      this.$refs['changePassword'].resetFields()
    },
    // 搜索  个人资产
    searchMyAssetList () {
      console.log(this.value2)
      if (this.value2 === false) {
        this.searchAsset.type = ''
      }
      if (this.value2 === true) {
        this.searchAsset.type = 1
      }
      this.getMyAssetList()
    },
    // 获取 用户收货地址
    getMyAddress () {
      this.myFetch({
        apiName: 'selectReceivingAddress',
        postdata: {userId: this.$store.state.User.userId},
        success: (addressData) => {
          console.log('打印一下拿到的地址', addressData)
          if (addressData.find(item => item.isdefault === 0)) {
            this.isAddressDeault = true
          } else {
            this.isAddressDeault = false
          }
          for (let i = 0; i < addressData.length; i++) {
            addressData[i].showAddress = this.transAddress(addressData[i].address)
          }
          this.addressData = addressData
        }
      })
    },
    transAddress (address) {
      if (address.split('-').length === 2) {
        return address.split('-')[0] + address.split('-')[1]
      } else if (address.split('-').length === 3) {
        return address.split('-')[0] + address.split('-')[1] + address.split('-')[2]
      }
    },
    // 关闭  添加收货地址弹框
    colseAddAddress () {
      this.addReceiveAddressVisibel = false
    },
    //  设置 默认地址
    defaultAdress (val) {
      if (val.$index !== this.tableIndex) {
        this.myFetch({
          apiName: 'updateIsdefaultAddress',
          postdata: {
            userId: this.$store.state.User.userId,
            addressId: val.row.addressId
          },
          success: () => {
            console.log('成功设置了默认地址')
            this.tableIndex = val.$index
            this.$notify({
              title: '提示',
              message: '默认地址已更改',
              type: 'success'
            })
            this.isAddressDeault = true
          }
        })
      }
    },
    // 打开编辑收货地址
    editReceiveAddress (data) {
      let {address, addressDetails, harvestName, addressId, phone} = data
      this.existAddress = {
        address,
        addressDetails,
        harvestName,
        phone
      }
      console.log('打一下传过来的值', this.existAddress)
      this.postEditAddressId = addressId
      this.editReceiveAddressVisibel = true
    },
    // 确认 编辑地址
    comfirmEditAddress (postdata) {
      postdata.addressId = this.postEditAddressId
      this.editReceiveAddressLoading = true
      this.myFetch({
        apiName: 'updateUserAddressByAddressId',
        postdata: postdata,
        success: (res) => {
          this.editAddressSeen = false
          this.$notify({
            title: '提示',
            message: '编辑成功',
            type: 'success'
          })
          this.editReceiveAddressVisibel = false
          this.getMyAddress()
        },
        complete: () => {
          this.editReceiveAddressLoading = false
        }
      })
    },
    // 关闭  编辑地址窗口
    colseEditAddress () {
      this.editReceiveAddressVisibel = false
    },
    // 删除 用户地址
    deleteAddress ({addressId}) {
      this.deleteReceiveAddressLoading = true
      this.myFetch({
        apiName: 'deleteReceivingAddressByAddressId',
        postdata: {addressId: addressId},
        success: (res) => {
          this.$notify({
            title: '提示',
            message: '删除成功',
            type: 'success'
          })
          this.getMyAddress()
        },
        complete: () => {
          this.deleteReceiveAddressLoading = false
        }
      })
    },
    // 打开 添加收货地址弹框

    // 确认 添加收货地址
    comfirmAddAddress (postAddressData) {
      postAddressData.userId = this.$store.state.User.userId
      this.addReceiveAddressLoadding = true
      this.addAddressReset = false
      this.myFetch({
        apiName: 'insertReceivingAddress',
        postdata: postAddressData,
        success: (res) => {
          this.$notify({
            title: '提示',
            message: '成功添加地址',
            type: 'success'
          })
          this.addReceiveAddressVisibel = false
          this.getMyAddress()
          this.addAddressReset = true
        },
        complete: () => {
          this.addReceiveAddressLoadding = false
        }
      })
    },
    sendWithDrawCode (type) {
      if (type === 'tel' && this.withDrawDialog.contactPhone) {
        this.myFetch({
          apiName: 'getVerifyCode',
          postdata: {
            name: this.withDrawDialog.contactPhone,
            verificationType: '29',
            code: ''
          },
          success: (res) => {
            console.log('手机成功获取了验证码', res)
          }
        })
      } else if (type === 'email' && this.withDrawDialog.contactEmail) {
        this.myFetch({
          apiName: 'getVerifyCode',
          postdata: {
            name: this.withDrawDialog.contactEmail,
            verificationType: '30',
            code: ''
          },
          success: (res) => {
            console.log('邮箱成功获取了验证码', res)
          }
        })
      }
    },
    // 提币
    handleWithDraw (data) {
      let userId = this.$store.state.User.userId
      console.log('确认提币时拿到的参数', data)
      let phone
      let email
      if (data.type === '1') {
        data.verificationType = '29'
        phone = this.withDrawDialog.contactPhone
        email = ''
      } else if (data.type === '2') {
        data.verificationType = '30'
        email = this.withDrawDialog.contactEmail
        phone = ''
      }
      // 请求函数
      this.myFetch({
        apiName: 'addUserWithMoney',
        postdata: {
          currencyId: this.withDrawDialog.currencyId,
          userId: userId,
          type: data.type,
          phone: phone,
          email: email,
          number: data.num,
          adrr: data.address,
          code: data.code,
          minermoney: String(data.fee),
          verificationType: data.verificationType
        },
        success: () => {
          this.$notify({
            title: '提示',
            message: '提币成功',
            type: 'success'
          })
          this.getMyAssetList()
          this.handleWithDrawDialogClose()
        }
      })
    },
    toSetInfo (type) {
      console.log('打印一下type', type)
    },
    // 获取提币地址
    getWithDrawAddress () {
      this.myFetch({
        apiName: 'getuserAdrs',
        postdata: {
          userId: this.$store.state.User.userId,
          currencyId: this.withDrawDialog.currencyId
        },
        success: (address) => {
          this.withDrawDialog.addressForm = address
          console.log('拿到的提币地址', address)
        }
      })
    },
    // 打开 提币窗口
    showWithDrawDialog (data) {
      console.log('打开提币窗口showWithDrawDialog', data)
      this.withDrawDialog.coinName = data.currency
      this.withDrawDialog.currencyId = data.currencyId
      this.withDrawDialog.show = true
      this.getWithDrawAddress()
      // 获取 提币窗口信息
      this.myFetch({
        apiName: 'getUserwithdrawMoney',
        postdata: {
          userId: this.$store.state.User.userId,
          currencyId: data.currencyId
        },
        success: (res) => {
          console.log('打印一下拿到的信息111', res)
          this.withDrawDialog.feeForm = res.minerMoneys
          this.withDrawDialog.usable_amount = res.usable_amount
          this.withDrawDialog.freeze_amount = res.freeze_amount
          this.withDrawDialog.contactPhone = res.contactPhone
          this.withDrawDialog.contactEmail = res.contactEmail
        }
      })
    },
    // 关闭 提币窗口
    handleWithDrawDialogClose () {
      this.withDrawDialog.show = false
    },
    // 提币窗口  => 唤起添加地址窗口
    handleAddressAdd () {
      console.log('弹出了')
      this.walletAddressDialog.show = true
    },
    getPurseAdressCode (type) {
      console.log('打印一下type', type)
      if (type === 1) {
        console.log('获取手机验证码')
        this.myFetch({
          apiName: 'getVerifyCode',
          postdata: {
            name: this.withDrawDialog.contactPhone,
            verificationType: '29',
            code: ''
          },
          success: (res) => {
            console.log('手机成功获取了验证码', res)
          }
        })
      } else if (type === 2) {
        console.log('获取邮箱验证码')
        this.myFetch({
          apiName: 'getVerifyCode',
          postdata: {
            name: this.withDrawDialog.contactEmail,
            verificationType: '30',
            code: ''
          },
          success: (res) => {
            console.log('邮箱成功获取了验证码', res)
          }
        })
      }
    },
    // 关闭添加地址窗口
    handleCloseWalletAddressDialog () {
      this.walletAddressDialog.show = false
    },
    // 确认添加地址
    handleSubmitWalletAddress (data) {
      // userId ,adrr, currencyId, addrrLabel, verificationType, code
      if (data.verificationType === '29') {
        data.type = 0
        data.phone = this.withDrawDialog.contactPhone
        data.email = ''
      } else if (data.verificationType === '30') {
        data.type = 1
        data.email = this.withDrawDialog.contactEmail
        data.phone = ''
      }
      console.log('打印一下传出来的地址', data)
      // 请求的函数
      this.myFetch({
        apiName: 'addUserPurseAddress',
        postdata: {
          userId: this.$store.state.User.userId,
          adrr: data.purseAdr,
          type: data.type,
          phone: data.phone,
          email: data.email,
          adrrLabel: data.adrrLabel,
          verificationType: data.verificationType,
          code: data.code,
          currencyId: this.withDrawDialog.currencyId
        },
        success: (res) => {
          // console.log("打印一下结果",res)
          this.$notify({
            title: '提示',
            message: '成功添加地址',
            type: 'success'
          })
          this.getWithDrawAddress()
          this.handleCloseWalletAddressDialog()
        }
      })
    },
    // 充币
    showDepositDialog (data) {
      console.log('传入的data', data)
      var reader = new FileReader()
      console.log(reader)
      this.myFetch({
        apiName: 'getUserAdrr',
        postdata: {
          userId: this.$store.state.User.userId,
          currencyId: data.currencyId
        },
        success: ({adrr, base64}) => {
          this.depositDialog.coinName = data.currencyname
          this.depositDialog.addressName = adrr
          this.depositDialog.qrcodeImg = base64
          this.depositDialog.show = true
        }
      })
    },
    // 关闭 充币弹框
    handleDepositClose () {
      this.depositDialog.show = false
    },
    handleCurrentChange (val) {
      this.currentRow = val
      console.log(this.currentRow)
    },
    // 打开钱包地址
    showWalletDialog (data) {
      console.log('获取打开钱包地址数据', data)
      this.purseAddressDialog = true
    },
    // 复制钱包地址
    handleCopy (e) {
      var clipboard = new Clipboard('.handleCopy')
      clipboard.on('success', e => {
        this.$notify({
          title: '提示',
          message: '地址复制成功',
          type: 'success'
        })
        clipboard.destroy()
      })
      clipboard.on('error', e => {
        // 不支持复制
        this.$notify({
          title: '提示',
          message: '地址复制失败,该浏览器不支持自动复制,请手动复制',
          type: 'error'
        })
        // 释放内存
        clipboard.destroy()
      })
    }
  }
}
</script>

<style scoped lang="scss">
.UserCenter{
  text-align: center;
  min-height: calc( 100vh - 294px);
  background: $client_bg_light_grey;
  overflow: hidden;
}
.UserCenter .forTextAlignLeft{
  text-align: left;
}
.UserCenter-account{
  margin: 14px auto 14px auto;
  width: 1201px;
  background: $client_bg_white;
}
.UserCenter-account-top{
  height: 43px;
  background: rgba(216,216,216,1);
  opacity: 0.63;
}
.UserCenter-account-tabs{
  float: left;
  margin: 8px 0px 0px 11px;
  height: 35px;
}
.UserCenter-account-tab{
  float:left;
  width: 128px;
  height: 35px;
  line-height: 35px;
  background: rgba(216,216,216,1);
  color: $font_deeper_blue;
  font-weight: $YH_big;
  font-size: 14px;
  border-radius: 4px 4px 0 0;
}
.UserCenter-account-tab:hover{
  cursor: pointer;
}
.tab-active{
  background: $font_light_white;
  color: $font_deep_black;
}
.UserCenter-account-loading{
  position: relative;
  height: 234px;
}
.UserCenter-account-info{
  padding: 33px 30px;
}
.UserOrder-account-info-row{
  margin: 21px 31px 21px 11px;
  text-align: left;
  height: 28px;
  line-height: 28px;
  color: $font_deeper_grey;
}
.UserOrder-account-info-row i{
  margin-right: 19px;
  vertical-align: middle;
  font-size: 28px;
  color: $font_lighter_grey;
}
.password-strength-word{
  color: $font_deep_black;
}
.notSet{
  display: inline-block;
  margin-left: 64px;
}
.notSet i{
  font-size: 15px;
  color: $font_light_yellow;
  margin-right: 0px;
}
.notSet span{
  font-family: $PF_Regular;
  font-size: 14px;
  margin-left: 11px;
  color: $font_light_grey;
}
.UserOrder-account-info-add{
  float: right;
  font-size: 14px;
  font-family: $PF_Regular;
  color: $font_deeper_blue;
  cursor: pointer;
}
.password-strength{
  display: inline-block;
  margin-left: 30px;
  text-align: center;
  width: 25px;
  height: 21px;
  line-height: 21px;
  border-radius: 3px;
  font-size: 14px;
  color: $font_light_white;
}
.low{
  background: $font_light_red;
}
.middle{
  background: $font_deeper_blue;
}
.hight{
  background: $client_border_green;
}
.UserOrder-account-info-row .changeDense{
  margin-left: 61px;
  color: $font_deeper_blue;
  font-size: 14px;
  font-family: $PF_Regular;
  text-decoration: none;
  cursor: pointer;
}
.UserCenter-address{
  text-align: left;
  box-sizing: border-box;
  padding: 23px;
  margin: 14px auto 97px auto;
  width: 1201px;
  background: $font_light_white;
  .addAddressBtn{
    float: right;
    margin-right: 20px;
    padding: 0px;
    color: $font_deeper_blue;
  }
}
.UserCenter-address-title{
  margin-left: 5px;
  color: $font_deep_black;
  font-size: 16px;
  font-family: $PF_Regular;
  font-weight: $YH_big;
}
.UserCenter-address-square{
  display: inline-block;
  float: left;
  margin: 2px 0px 0px 2px;
  width: 20px;
  height: 20px;
  border: 2px solid $client_border_grey;
  border-radius: 2px;
}
.square-active{
  color: $font_deeper_blue;
  border: 2px solid $font_deeper_blue;
}
.word-active{
  color: $font_deeper_blue;
}
.UserCenter-address-square:hover{
  cursor: pointer;
}
.notSetAdress{
  display: block;
  margin: 32px 0px 39px 0px;
}
#notSetAdress-add{
  margin-right: 38px;
  float: right;
  font-size: 14px;
  font-family: $PF_Regular;
  color: $font_deeper_blue;
  cursor: pointer;
}
.UserCenter-account-asset{
  padding: 33px 30px;
  .recordTitle{
    margin: 20px 0px;
    text-align: left;
    font-size: 14px;
    font-weight: 500;
  }
}
.UserCenter-account-asset-cnotent{
  width:100%;
  margin-bottom: 20px;
}
.UserCenter-account-asset-cnotentSearch{
  float: left;
  margin-bottom: 13px;
}
.UserCenter-account-asset-cnotentSearch input{
  margin-right: 5px;
  padding-left: 25px;
  width: 150px;
  height: 25px;
  line-height: 21px;
  border-radius: 3px;
  border: 1px solid $client_border_Lightgrey;
}
.UserCenter-account-asset-cnotentSearch input::-webkit-input-placeholder { /* WebKit browsers */
  font-family: $PF_Regular;
  font-size: 12px;
  color: $font_light_grey;
}
.UserCenter-account-asset-cnotentSearch input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
  font-family: $PF_Regular;
  font-size: 12px;
  color: $font_light_grey;
}
.UserCenter-account-asset-cnotentSearch input::-moz-placeholder { /* Mozilla Firefox 19+ */
  font-family: $PF_Regular;
  font-size: 12px;
  color: $font_light_grey;
}
.UserCenter-account-asset-cnotentSearch input:-ms-input-placeholder { /* Internet Explorer 10+ */
  font-family: $PF_Regular;
  font-size: 12px;
  color: $font_light_grey;
}
.UserCenter-account-asset-cnotentSwitch{
  display: inline-block;
  float:right;
  font-family: $PF_Regular;
  font-size: 14px;
  color: $client_tab_content_cord;
}
.UserCenter-account-asset-line{
  display: inline-block;
  margin:0px 10px;
  height: 15px;
  border-right: 2px solid $client_border_grey;
  vertical-align: middle;
}
.UserCenter-account-asset-active{
  color: $font_deeper_grey
}
.openDialog{
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  background:  rgba(0,0,0,0.3);
}
.openDialog-form{
  box-sizing: border-box;
  padding: 34px 0px 42px 62px;
  width: 467px;
  text-align: left;
  background: $font_light_white;
  border-radius: 4px;
}
.openDialog-form-title{
  display: inline-block;
  margin-bottom: 12px;
  color: $font_deep_black;
  font-family: $PF_Light;
  font-size: 16px;
  font-weight: $YH_big;
}
.openDialog-form-hint{
  float: right;
  margin-right: 107px;
  margin-bottom: 15px;
  font-family: $PF_Regular;
  font-size: 12px;
  color: $client_border_grey;
}
.openDialog-form-bottom{
  margin-top: 20px;
}
.openDialog-form-cancel{
  border: 1px solid $client_border_Lightgrey;
  color: $client_border_grey;
  font-family: $PF_Light;
  font-size: 14px;
}
.openDialog-form-phoneAdress-row input{
  display: inline-block;
  margin-left: 27px;
  width: 162px;
  height: 29px;
  border-radius: 4px;
  border: 1px solid $client_border_Lightgrey;
}
.openDialog-form-phoneAdress-row label{
  font-family: $PF_Light;
  font-size: 14px;
  font-weight: $YH_bold;
}
</style>
<style lang="scss">
.UserCenter-address .el-table{
  margin-top: 21px;
  text-align: center;
}
.UserCenter-address .el-table::before{
  width: 0px;
}
.UserCenter-address .el-table th > .cell{
  text-align: center;
  font-size: 14px;
  color: $font_deep_black;
  font-family: $PF_Regular;
  font-weight: $YH_bold;
  line-height: 25px;
}
.UserCenter-address .el-table th{
  height: 40px;
  background: $client_bg_light_grey;
  padding: 0px;
  border: none;
}
.UserCenter-address .el-table--enable-row-transition .el-table__body td{
  height: 72px;
  font-size: 14px;
  font-family: $PF_Regular;
  color: $font_deep_black;
}
.UserCenter-address table tbody tr:nth-child(even){
  background: $client_bg_light_grey
}
.UserCenter-address .el-table{
  border: 1px solid $client_border_Lightgrey;
}
.UserCenter-address .cell .el-button{
  width: 62px;
  height: 22px;
  line-height: 12px;
  border: 1px solid $font_deeper_blue;
  padding: 0px;
  font-size: 12px;
  color: $font_deeper_blue;
}
.UserCenter .UserCenter-account-asset-cnotentSearch .el-button{
  padding: 0px;
  width: 69px;
  height: 25px;
  font-size: 12px;
  color: $font_light_white;
  background: $font_deeper_blue;
  border: 1px solid $font_deeper_blue;
}
.UserCenter .UserCenter-account-asset-cnotent .el-switch{
  margin-left: 18px;
}
.UserCenter .UserCenter-account-asset-cnotent .el-table th{
  text-align: center;
}
.UserCenter .UserCenter-account-asset-cnotent .el-table th{
  background: $client_bg_light_grey;
  font-family: $PF_Regular;
  font-size: 14px;
  color: $font_deep_black;
}
.UserCenter .UserCenter-account-asset-cnotent .el-table th, .el-table td{
  padding: 0px;
  border: none;
}
.UserCenter .UserCenter-account-asset-cnotent .el-table .cell{
  font-family: $PF_Regular;
  font-size: 14px;
  height:40px;
  line-height: 40px;
  color: $font_deeper_grey;
}
.UserCenter .openDialog-form-bottom .el-button{
  margin-right: 8px;
  width: 164px;
  height: 35px;
  line-height: 11px;
}
.UserCenter .openDialog-form-phoneAdress-row .el-button{
  float: right;
  margin-right: 60px;
  width: 92px;
  height: 29px;
  border-radius: 4px;
  font-family: $PF_Light;
  font-size: 12px;
  padding: 0px;
}
.UserCenter .UserCenter-address .el-table__header, .el-table__body, .el-table__footer{
  border-collapse: collapse;
}
.UserCenter .el-dialog__header{
  padding: 0px;
}
.UserCenter .el-dialog__body{
  padding: 0px;
}
.UserCenter .purseAddressDialog .el-dialog{
  .el-dialog__header{
    height: 60px;
    line-height: 60px;
    border-bottom: 1px solid $client_border_grey;
    .el-dialog__title{
      font-weight: 600;
    }
  }
  .el-dialog__body{
    margin-left: 60px;
    margin-right: 20px;
    padding-bottom: 40px;
    text-align: left;
    .tips{
      font-size: 14px;
      color: #888;
    }
    .handleCopy{
      margin: 20px 35px;
      width: 140px;
      height: 30px;
      line-height: 30px;
      padding: 0px;
      color: #00BCD4;
      border-color: #00BCD4;
    }
    .purseAddress{
      word-wrap: break-word;
      margin-bottom: 20px;
    }
    .clear{
      clear: both;
    }
  }
}
.UserCenter .set-info-dialog .el-dialog{
  width: 467px;
  .el-button:hover, .el-button:focus, .el-button.is-disabled{
    color: #fff;
    border-color: #59BFC6;
    background: #59BFC6;
  }
  .openDialog-form{
    .input-set-info{
      width: 260px;
      .el-input__inner{
        height: 29px;
        line-height: 29px;
      }
    }
    .input-send-code{
      width: 162px;
      .el-input__inner{
        height: 29px;
        line-height: 29px;
      }
    }
    .el-form-item__label{
      text-align: left;
    }
    .el-form-item__content .el-button{
      margin-left: 10px;
      width: 92px;
      height: 29px;
      line-height: 29px;
      padding:0px;
      font-size: 12px;
    }
    .el-form-item__error{
      left: auto;
      right: 75px;
      top: 10px;
    }
  }
}
.UserCenter .changePassword .el-dialog{
  width: 467px;
  .el-button:hover, .el-button:focus, .el-button.is-disabled{
    color: #fff;
    border-color: #59BFC6;
    background: #59BFC6;
  }
  .passwordInput{
    width: 260px;
    .el-input__inner{
      height: 29px;
      line-height: 29px;
    }
  }
  .el-form-item__label{
    text-align: left;
  }
}
</style>
