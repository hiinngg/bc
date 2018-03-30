// pages/passenger/passenger.js
const Zan = require('../../bower_components/zanui-weapp/dist/index');
const config = require('./config');
import WxValidate from '../../bower_components/wx-validate/WxValidate'
const { checkMod } = require('../../utils/util.js');
var app = getApp();
Page(Object.assign({}, Zan.Field, {

  data: {
    config,
    area: [{ show: "请选择类型", value: "none" },
     { show: "成人", value: "adult" },
     { show: "幼儿", value: "childZ" },
     { show: "儿童", value: "childNZ" },
     { show: "老人", value: "old" },],
    areaIndex: 0,
  },
  onLoad: function (options) {
    this.initValidate()
  },

  onAreaChange(e) {
    this.setData({
      areaIndex: e.detail.value
    });
  },


  showModal(error) {
    wx.showModal({
      content: error.msg,
      showCancel: false,
    })
  },
  formSubmit: function (e) {
  
    if (!this.WxValidate.checkForm(e)) {
      const error = this.WxValidate.errorList[0]
      this.showModal(error)
      return false
    }
     
    wx.showLoading({
      title: '保存中',
      mask:true
    })
    wx.request({
      url: app.globalData.domain + '/WeiXin/GetOpenid2',
      data: JSON.stringify({ Key: app.globalData.userInfo.Key }),
      method: "POST",
      success: function (res) {

        wx.request({
          url: app.globalData.domain + '/BanChe/Customer/AppInformation',
          data: {
            Request: {
              OpenId: res.data.Result.Openid,
              ID: "",
              KeRenName: e.detail.value.name,
              ZhengJianType: "身份证",
              ZhengJianHao:e.detail.value.idcard,
              ShouJi: e.detail.value.tel,
           
            },
            "T": "json"
          },
          method: "POST",
          success: function (res1) {
            wx.hideLoading();
            if(res1.data.Code==0){
              wx.showToast({
                title: '保存成功',
                icon: 'success',
                duration: 2000,
                success:function(){
                  wx.navigateBack({
                    delta: 1,
                  })
                }
              })
            }else{
              wx.showModal({
                title: '出错了',
                content: '请重新提交',
              })
            }
          },
        })


      }
    })


  },
  initValidate() {
    // 验证字段的规则
    const rules = {
      name: {
        required: true,
      },
      tel: {
        required: true,
        tel: true,
      },
      idcard: {
        required: true,
        assistance: true,
      },
      leixing:{
        mytype:true
      }
    }

    // 验证字段的提示信息，若不传则调用默认的信息
    const messages = {
      name: {
        required: '请填写姓名',
      },
      tel: {
        required: '请输入手机号码',
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

    this.WxValidate.addMethod('mytype', (value, param) => {
      return (value!="0")
    }, '请选择类型')
  },

}))