// pages/passenger/passenger.js
const Zan = require('../../bower_components/zanui-weapp/dist/index');
const config = require('./config');
import WxValidate from '../../bower_components/wx-validate/WxValidate'
const { checkMod } = require('../../utils/util.js');
Page(Object.assign({}, Zan.Field, {

  data: {
    config,
  },
  onLoad: function (options) {
    this.initValidate()
  },
  showModal(error) {
    wx.showModal({
      content: error.msg,
      showCancel: false,
    })
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)

    if (!this.WxValidate.checkForm(e)) {
      const error = this.WxValidate.errorList[0]
      this.showModal(error)
      return false
    }

    wx.navigateBack({
      delta: 1,
    })
  },
  initValidate() {
    // 验证字段的规则
    const rules = {
      name: {
        required: true,
      },
      tel: {
     
        tel: true,
      },
      idcard: {
        required: true,
        assistance: true,
      }
    }

    // 验证字段的提示信息，若不传则调用默认的信息
    const messages = {
      name: {
        required: '请填写姓名',
      },
      tel: {
        tel: '请输入正确的手机号',
      },
      idcard: {
        required: '请输入身份证号码',
        idcard: '请输入正确的身份证号码',
      },

    }

    // 创建实例对象
    this.WxValidate = new WxValidate(rules, messages)
    // 自定义验证规则
    this.WxValidate.addMethod('assistance', (value, param) => {
     return checkMod(value)
    }, '请输入正确的身份证号码')
  },

}))