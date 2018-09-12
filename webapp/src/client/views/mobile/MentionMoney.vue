<template>
  <div class="mention">
    <h1>
      <i class="iconfont icon-down"></i>
      <span>提款/币</span>
      <span>提币说明</span>
    </h1>
    <div class="mention_address">
      <p>
        <span>提币地址</span><span  class="list_label" >{{ list[1].label }}</span><br>
        <span  v-show="!show_num">请输入提币地址</span>
        <span v-show="show_num">{{ list[0].address }}</span>
      </p>
      <i class="iconfont icon-jiahaocu" v-show="!show_num"  @click.self="on_address_bounced(on)"></i>
      <i class="iconfont icon-open" v-show="show_num" @click="openlist()"></i>
      <i class="iconfont icon-wodedingdan23" ></i>
    </div>
    <div class="mention_address cover" @click.self="reveal(open)" v-if="open==1">
      <div :key="it.id" v-for="it in address" class="more_address">
        <p>
          <span>提币地址</span>
          <span class="list_label">{{ it.label }}</span>
        </p>
        <p>{{ it.address }}</p>
      </div>
      <div class="add" @click.self="on_address_bounced(on)">
        <i class="iconfont icon-jiahaocu"></i>添加地址
      </div>
    </div>
    <!-- 添加地址弹框 -->
    <!-- <div class="add_address"  @click.self="off_address_bounced(on)" v-show="on">
      <div  class="bgStyle">
        <h2><span @click.self="off_address_bounced(on)" class="close">X</span> 添加地址</h2>
        <p class="input_border">
          <input type="text">
          <i class="iconfont icon-wodedingdan23"></i>
        </p>
        <p class="input_border">
          <input type="text" placeholder="请输入地址标签">
        </p>
        <p>验证码发送至手机</p>
        <label for="validation">
          <ul>
            <li :key="index" v-for="(item,index) in 4">
              <span> {{ value[index] || placeholder }}</span>
            </li>
          </ul>
        </label>
        <input type="text" id="validation" v-model="value" maxlength="4" ref="input" @keyup="handleInput($event)">
        <p class="send">已发送45</p>
      </div>
    </div> -->
    <!-- 未绑定手机时的验证 -->
    <!-- <div class="add_address unbounded" @click.self="off_address_bounced(on)" v-show="on">
      <div class="bgStyle">
        <h2>
          <span @click.self="off_address_bounced(on)">X</span>
          <p>
            <span>手机验证</span>
            <span>邮箱验证</span>
          </p>
        </h2>
          <p class="fontWeight">
            1EJREtu65jVsiWXawuJAw4Tw3otfghfghfgfgfjjhsjdfhjsfhsjf
          </p>
          <p class="fontWeight">您还未绑定手机，同时绑定</p>
          <div class="inputPhone">
            <input type="text" placeholder="请输入手机号">
            <button>获取验证码</button>
          </div>
          <label for="validation">
            <ul>
              <li :key="index" v-for="(item,index) in 4">
                <span> {{ value[index] || placeholder }}</span>
              </li>
            </ul>
          </label>
          <input type="text" id="validation" v-model="value" maxlength="4" ref="input" @keyup="handleInput($event)">
          <p class="sendinfo">已发送45</p>
      </div>
    </div> -->
    <!-- 手机验证 -->
    <div class="validation">
      <div class="add_address unbounded" @click.self="off_address_bounced(on)" v-show="on">
        <div class="bgStyle">
          <h2>
            <span @click.self="off_address_bounced(on)">X</span>
            <p>
              <span>手机验证</span>
              <span>邮箱验证</span>
            </p>
          </h2>
            <p class="fontWeight">
              1EJREtu65jVsiWXawuJAw4Tw3otfghfghfgfgfjjhsjdfhjsfhsjf
            </p>
            <p class="fontWeight">验证码发送至手机123****1234</p>
            <label for="validation">
              <ul class="">
                <li :key="index" v-for="(item,index) in 4">
                  <span> {{ value[index] || placeholder }}</span>
                </li>
              </ul>
            </label>
            <input type="text" id="validation" v-model="value" maxlength="4" ref="input" @keyup="handleInput($event)">
            <p class="sendinfo">已发送45</p>
        </div>
      </div>
    </div>
    <!-- 提交成功 -->
    <!-- <div class="submitSuccess">
       <div class="add_address unbounded" @click.self="off_address_bounced(on)" v-show="on">
        <div class="bgStyle">
          <h2>
            <span @click.self="off_address_bounced(on)">X</span>
            <p>
              <span>手机验证</span>
              <span>邮箱验证</span>
            </p>
          </h2>
            <p class="fontWeight">
              1EJREtu65jVsiWXawuJAw4Tw3otfghfghfgfgfjjhsjdfhjsfhsjf
            </p>
            <p class="fontWeight">验证码发送至手机123****1234</p>
            <label for="validation">
              <ul class="">
                <li :key="index" v-for="(item,index) in 6">
                  <span> {{ value[index] || placeholder }}</span>
                </li>
              </ul>
            </label>
            <input type="text" id="validation" v-model="value" maxlength="4" ref="input" @keyup="handleInput($event)">
            <p class="sendinfo">已发送45</p>
        </div>
      </div>
    </div> -->
    <div class="mention_num">
      <p class="input_num">
        <span>提币数量</span>
        <input type="text">
      </p>
      <p class="carry_num">
        <span>可提余币</span>
        <span>555 </span> BTY
        <button>全部提取</button>
      </p>
    </div>
    <div class="select">
      <span>矿工费</span>
      <el-select v-model="minersFee" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    <button class="submit">提交</button>
    <div class="list">
      <p>提款记录</p>
      <div :key="item.id" v-for="item in list">
        <p>
          <span class="list_num">{{ item.money }}</span>
          <span class="list_state">{{ item.state }}</span>
          <span class="list_label">{{ item.label }}</span>
          <span class="list_time">{{ item.time }}</span>
          <span class="list_date">{{ item.date }}</span>
        </p>
        <p class="list_address">{{ item.address }}</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      show_num: '',
      open: 0,
      options: [
        {
          value: '选项1',
          label: '0.001'
        }, {
          value: '选项2',
          label: '0.002'
        }, {
          value: '选项3',
          label: '0.003'
        }, {
          value: '选项4',
          label: '0.004'
        }, {
          value: '选项5',
          label: '0.005'
        }
      ],
      list: [
        {
          money: '-5000',
          state: '申请中',
          label: '云币网',
          date: '07-18',
          time: '11:45',
          address: '1EJREtu65jVsiWXawuJAw4Tw3otJRGEB1'
        },
        {
          money: '-500000',
          state: '申请中',
          label: '云币网',
          date: '07-18',
          time: '11:45',
          address: '1EJREtu65jVsiWXawuJAw4Tw3otJRGEB1'
        },
        {
          money: '-500',
          state: '申请中',
          label: '云币网',
          date: '07-18',
          time: '11:45',
          address: '1EJREtu65jVsiWXawuJAw4Tw3otJRGEB1'
        }
      ],
      address: [],
      placeholder: '    ',
      value: '',
      minersFee: '',
      on: false
    }
  },
  methods: {
    show () {
      if (this.list.length >= 2) {
        this.show_num = true
        this.address = this.list.slice(1)
      } else {
        this.show_num = false
      }
    },
    openlist () {
      if (this.open === 0) {
        this.open = 1
      } else {
        this.open = 0
      }
    },
    reveal () {
      this.open = 0
    },
    on_address_bounced () {
      this.on = true
    },
    off_address_bounced () {
      this.on = false
    },
    hideKeyboard () {
      document.activeElement.blur()
      this.$refs.input.blur()
    },
    handleSubmit () {
      this.$emit('input', this.value)
    },
    handleInput (e) {
      this.$refs.input.value = this.value
      if (this.value.length >= 4) {
        this.hideKeyboard()
      }
      this.handleSubmit()
    }
    // 提币
    // handleWithDraw (data) {
    //   // let userId = this.$store.state.User.userId
    //   console.log('确认提币时拿到的参数', data.form)
    //   // data.form.address
    //   // data.form.area      +86
    //   // data.form.code   123123
    //   // data.form.coin    BTY
    //   // data.form.email
    //   // data.form.fee  旷工费
    //   // data.form.num   提币数量
    //   // data.form.tel
    //   // data.form.type
    //   // 请求函数
    //   // this.myFetch({
    //   //   apinName: 'addUserWithMoney',
    //   //   postdata: {
    //   //     currencyId: this.withDrawDialog.currencyId,
    //   //     userId: userId,
    //   //     type: data.form.type,
    //   //     phone: data.form.tel,
    //   //     number: data.form.num,
    //   //     adrr: data.form.address,
    //   //     verificationType:
    //   //   },
    //   //   success: () => {
    //   //     this.$notify({
    //   //       title: '提示',
    //   //       message: '提币成功',
    //   //       type: 'success'
    //   //     })
    //   //     this.handleWithDrawDialogClose()
    //   //   }
    //   // })
    // },
    // // 获取提币地址
    // getWithDrawAddress () {
    //   this.myFetch({
    //     apiName: 'getuserAdrs',
    //     postdata: {
    //       userId: this.$store.state.User.userId,
    //       currencyId: this.withDrawDialog.currencyId
    //     },
    //     success: (address) => {
    //       this.withDrawDialog.addressForm = address
    //       console.log('拿到的提币地址', address)
    //     }
    //   })
    // },
    // // 打开 提币窗口
    // showWithDrawDialog (data) {
    //   console.log('打开提币窗口showWithDrawDialog', data)
    //   this.withDrawDialog.coinName = data.currency
    //   this.withDrawDialog.currencyId = data.currencyId
    //   this.withDrawDialog.show = true
    //   this.getWithDrawAddress()
    //   // 获取 提币窗口信息
    //   this.myFetch({
    //     apiName: 'getUserwithdrawMoney',
    //     postdata: {
    //       userId: this.$store.state.User.userId,
    //       currencyId: data.currencyId
    //     },
    //     success: (res) => {
    //       this.withDrawDialog.feeForm = res.minerMoneys
    //       this.withDrawDialog.usable_amount = res.usable_amount
    //       this.withDrawDialog.freeze_amount = res.freeze_amount
    //       this.withDrawDialog.contactPhone = res.contactPhone
    //       this.withDrawDialog.contactEmail = res.contactEmail
    //     }
    //   })
    // },
    // // 关闭 提币窗口
    // handleWithDrawDialogClose () {
    //   this.withDrawDialog.show = false
    // },
    // // 提币窗口  => 唤起添加地址窗口
    // handleAddressAdd () {
    //   console.log('弹出了')
    //   this.walletAddressDialog.show = true
    // },
    // // 关闭添加地址窗口
    // handleCloseWalletAddressDialog () {
    //   this.walletAddressDialog.show = false
    // },
    // // 确认添加地址
    // handleSubmitWalletAddress (data) {
    //   // userId ,adrr, currencyId, addrrLabel, verificationType, code
    //   // 请求的函数
    //   this.myFetch({
    //     apiName: 'addUserPurseAddress',
    //     postdata: {
    //       userId: this.$store.state.User.userId,
    //       adrr: data.purseAdr,
    //       adrrLabel: data.adrrLabel,
    //       verificationType: data.verificationType,
    //       code: data.code,
    //       currencyId: this.withDrawDialog.currencyId
    //     },
    //     success: (res) => {
    //       // console.log("打印一下结果",res)
    //       this.$notify({
    //         title: '提示',
    //         message: '成功添加地址',
    //         type: 'success'
    //       })
    //       this.getWithDrawAddress()
    //       this.handleCloseWalletAddressDialog()
    //     }
    //   })
    // },
  },
  mounted () {
    this.show()
  }
}
</script>
<style lang="scss">
.mention{
  h1{
    width: 100%;
    height: 10.7vw;
    display: flex;
    justify-content: space-between;
    background: #fff;
    padding: 0 3.1vw;
    line-height: 10.7vw;
    font-size: 4.5vw;
    i{
      font-size: 5.3vw;
    }
    span:nth-of-type(1){
      font-weight: 500;
    }
    span:nth-of-type(2){
      font-size: 3.9vw;
      color: #72bcc3;
    }
  }
  .mention_address{
    margin-top: 1.3vw;
    width: 100%;
    padding: 3.5vw 4vw;
    z-index: 120;
    background: #fff;
    position: relative;
    p{
      display: inline-block;
      width: 70.1vw;
      span{
        line-height: 6vw;
      }
      span:nth-of-type(1){
        font-size: 3.7vw;
        color: #000;
        font-weight: 500;
      }
      span:nth-of-type(2){
        font-size: 3.5vw;
        color: #8d8d8d;
      }
    }
    .iconfont{
      display: inline-block;
      font-size: 7.3vw;
      color: #C8D3DE;
    }
    .icon-jiahaocu,.icon-open{
      position: absolute;
      top: 5.9vw;
      right: 14.2vw;
      font-size: 6.2vw;
    }
    .icon-wodedingdan23{
      position: absolute;
      top: 5.6vw;
      right: 3.2vw;
    }
  }
  .mention_num{
    margin-top: 1.3vw;
    width: 100%;
    background: #fff;
    p{
      padding: 0 3.5vw;
      line-height: 10.7vw;
      span{
        display: inline-block;
      }
      span:nth-of-type(1){
        font-size: 3.7vw;
        color: #000;
        font-weight: 500;
      }
    }
    .input_num{
      display: flex;
      align-items: center;
      input{
        margin-left: 3.1vw;
        border: none;
        font-size: 5.9vw;
        color: #ff3b3b;
        font-weight: 500;
      }
    }
    .carry_num{
      color: #8d8d8d;
      font-size: 3.7vw;
      span:nth-of-type(2){
        margin-left: 3.1vw;
        color: #000;
        font-weight: 500;
      }
      button{
        margin-left: 45vw;
        color: #1CB2E3;
        font-size: 3.7vw;
        border: none;
        background: none;
      }
    }
  }
  .select{
    margin-top: 1.3vw;
    width: 100%;
    padding: 0 3.7vw;
    background: #fff;
    font-size: 3.7vw;
    color: #000;
    span{
      font-weight: 500;
    }
    .el-select{
      margin-left: 7.5vw;
      width: 79%;
      .el-input__inner{
        border: none;
      }
    }
  }
  .submit{
    margin-left: 2.8vw;
    margin-top: 2.9vw;
    width: 94.5vw;
    height: 11.1vw;
    border-radius:10px;
    border: none;
    background: #72bcc3;
    text-align: center;
    line-height: 11.1vw;
    font-size: 4.4vw;
    color: #fff;
  }

  .list{
    width: 100%;
    padding: 5.2vw 2.9vw;
    p{
      font-size: 3.2vw;
      color: #8a97a5;
      // line-height: 6vw;
    }
    div{
      margin-bottom: 2.7vw;
      width: 94.3vw;
      height: 13.4vw;
      padding: 2.4vw 3.6vw;
      background: #fff;
      p{
        line-height: 4.5vw;
        span{
          display: inline-block;
        }
        .list_num{
          width: 17.9vw;
          font-size: 4.3vw;
          color: #000;
          font-weight: 500;
        }
        .list_state{
          margin-left: 1.5vw;
          line-height: 5vw;
          font-size: 3.2vw;
          color: #000;
          font-weight: 500;
        }

        .list_date,.list_time{
          font-size: 3.2vw;
          color: #8a97a5;
          float: right;
        }
        .list_time{
          margin-left: 2vw;
        }
      }
    }
  }
  .list_label{
    margin-left: 2.1vw;
    display: inline-block;
    padding: 0.5vw 3.3vw;
    border: 1px solid #72bcc3;
    border-radius: 4px;
    font-size: 2.9vw !important;
    color: #72bcc3 !important;
    line-height: 4vw !important;
  }
  .cover{
    position: absolute;
    top: 12.4vw;
    left:0;
    width: 100%;
    height: 92%;
    z-index: 100;
    padding: 0 !important;
    padding-top: 16.7vw !important;
    background: rgba(153,153,153,0.4);
    .more_address{
      // margin-top: 9.7vw;
      padding: 3.5vw 4vw;
      background: #fff;
    }
    .add{
      width: 100%;
      height: 13.6vw;
      line-height: 13.6vw;
      border-top: 1px solid #d7d7d7;
      text-align: center;
      background: #fff;
      font-size: 4.4vw;
      color: #72bcc3;
      font-weight: 500;
      .icon-jiahaocu{
        position: static;
        margin-right: 3.7vw;
        display: inline-block;
        color: #72bcc3;
      }
    }
  }
  .add_address{
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: rgba(153,153,153,0.4);
    z-index: 200;
    .bgStyle{
      margin: 0 auto;
      margin-top: 21.3vw;
      width: 89.3vw;
      height: 72.7vw;
      padding: 4.9vw 8.7vw;
      background: #72BCC3;
      border-radius: 10px;
      h2{
        margin-bottom: 4.9vw;
        font-size: 4.5vw;
        color: #fff;
        .close{
          display: inline-block;
          margin-right: 22.4vw;
        }
      }
      .input_border{
        width: 72.2vw;
        height: 10.7vw;
        padding: 1.1vw 3.2vw;
        border: 1px solid #A2E2E8;
        border-radius: 10px;
        input{
          margin-right: 6vw;
          height: 100%;
          width: 53.5vw;
          border: none;
          background: #72BCC3;
        }
        i{
          height: 100%;
          // padding-top: 0.5vw;
          display: inline-block;
          // padding-top: 0.5vw;
          color: #fff;
          font-size: 5.75vw;
          // line-height: 10.7vw;
        }
      }
      .input_border:nth-of-type(2){
        margin-top: 2.7vw;
        input::-webkit-input-placeholder{
          color: #fff;
          font-size: 3.7vw;
        }
      }
      p:nth-of-type(3){
        color: #fff;
        font-size: 3.2vw;
        line-height: 8vw;
      }
      ul{
        border: 1px solid #A2E2E8;
        border-radius: 10px;
        height: 10.7vw;
        width: 55.6vw;
        li{
          float: left;
          width: 25%;
          height: 10.5vw;
          line-height: 10.5vw;
          text-align: center;
          border-right: 1px solid #A2E2E8;
          color: #fff;
          font-size: 3.7vw;
        }
        li:nth-of-type(4){
          border: none;
        }
      }
      #validation{
        position: absolute;
        top: -9999px;
        left: -9999px;
      }
      .send{
        float: right;
        margin-top: -7vw;
        color: #fff;
        font-size: 3.2vw;
      }
    }
  }
  .unbounded{
    h2{
      display: flex;
      border-bottom: 1px solid rgba(162,226,232,1);
      padding-bottom: 3.6vw;
      span{
        margin-right: 9.9vw;
      }
      p{
        display: flex;
      }
    }
    .fontWeight{
      width: 100%;
      text-align: left;
      color: #fff;
      font-size: 3.2vw;
      word-break:break-all;
    }
    .fontWeight:nth-of-type(1){
      margin-top: 5.9vw;
      margin-bottom: 3.1vw;
    }
    .fontWeight:nth-of-type(2){
      margin-bottom: 2.7vw;
    }
    .inputPhone{
      margin-bottom: 2.3vw;
      input{
        width: 43.1vw;
        height: 10.7vw;
        line-height: 10.7vw;
        background: none;
        border:1px solid rgba(162,226,232,1);
        border-radius:10px;
        text-align: center;
        color: #fff;
        font-size: 3.7vw;
      }
      input::-webkit-input-placeholder{
        color: #fff;
        font-size: 3.7vw;
      }
      button{
        margin-left: 1.3vw;
        width:26.7vw;
        height:10.7vw;
        background:rgba(255,255,255,1);
        border-radius:10px;
        border: none;
        color:rgba(114,188,195,1);
        font-size: 3.7vw;
        line-height: 10.7vw;
      }
    }
    ul{
      width: 100% !important;

    }
    .sendinfo{
      display: block;
      width: 104%;
      text-align: right;
      float: none !important;
      margin: 0 !important;
    }
  }
  .validation{
    .add_address{
      ul{
        li{
          width: 17%;
        }
      }
      .sendinfo{
        clear: float;
        // display: block;
        // width: 100%;
        // text-align: right;
        // float: none !important;
        // padding-right: 5vw;
      }
    }

  }
}
</style>
