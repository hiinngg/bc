var Zan = require('../../bower_components/zanui-weapp/dist/index');
const config = require('./config');
import WxValidate from '../../bower_components/wx-validate/WxValidate'
const { checkMod } = require('../../utils/util.js');
var WxParse = require('../../bower_components/wxParse/wxParse.js');
var app = getApp()
Page(Object.assign({}, Zan.Field, Zan.Switch, {
  data: {
    config,
    checked: false,
    showBottomPopup: false,
    other: false,
    keren: false,
    adultShu: 0,
    childZShu: 0,
    childNZShu: 0,
    oldShu: 0,
    name: "",
    idcard: "",
    tel: ""
  },
  other: function () {
    var config = this.data.config;

    this.setData({
      other: true,
      config: config,
      keren: false,
      name: "",
      idcard: "",
      tel: ""
    })
  },
  keren: function (e) {
    var id = e.currentTarget.dataset.id
    var value = this.data.my_passenger.find(function (v) {
      return v.ID = id
    })
    var config = this.data.config;
    this.setData({
      keren: e.currentTarget.dataset.id,
      config: config,
      other: false,
      name: value.KeRenName,
      idcard: value.ZhengJianHao,
      tel: value.ShouJi
    })
  },
  know:function(){
    wx.navigateTo({
      url: '../notice/notice',
    })

  },

  delpass: function (e) {
    var that = this
    var index = this.data.passenger.findIndex(function (v) {
      return v.ID == e.currentTarget.dataset.id
    })
    if (index == that.data.keren) {
      that.other()
    }
    var passenger = this.data.passenger
    passenger[index].is_checked = false;
    var total = this.data.total;
    total = total - that.priceType(passenger[index].LeiXing, -1)
    this.setData({
      passenger: passenger,
      total: total,
      mypassenger: passenger.filter(function (value) {
        return value.is_checked
      })
    })

  },

  onLoad(query) {
    //如果当前页面栈出错则重定向
     var pages = getCurrentPages();
      if (pages.length < 2) {
     wx.reLaunch({
        url: '../index/index',
      })
      }
    //获取上一页实例   ,
     var ticketsPage = pages[pages.length - 2];
    this.setData({
      banci: ticketsPage.data.bancheList[query.banciidx],
      luxian: ticketsPage.data.bancheList[query.banciidx].banchiLuXian[query.luxianidx],
      departure: ticketsPage.data.departure,
      arrival: ticketsPage.data.arrival,
      date: ticketsPage.data.date,
      total: 0
    })
  },

  onShow() {
  },
  toggleBottomPopup() {
    if (!this.data.showBottomPopup && !this.data.passenger) {
      var that = this
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: app.globalData.domain + '/WeiXin/GetOpenid2',
        data: JSON.stringify({ Key: app.globalData.userInfo.Key }),
        method: "POST",
        success: function (res) {

          wx.request({
            url: app.globalData.domain + '/BanChe/Customer/InformationList',
            data: {
              "Request": {
                "OpenId": res.data.Result.Openid
              },
              "T": "json"
            },
            method: "POST",
            success: function (res1) {
              wx.hideLoading();
              if (res1.data.Code == 0) {

                that.setData({
                  my_passenger: res1.data.Result.Information,
                  passenger: res1.data.Result.Information.map(function (v) {
                    //将身份证某些位设为*
                    //添加is_checked
                    var a = v.ZhengJianHao
                    a = a.split('')   //将a字符串转换成数组
                    a.splice(6, 8, 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x');
                    v['card'] = a.join('')
                    v['is_checked'] = false
                    v['is_active'] = false
                    return v;
                  })
                })
              } else {
                wx.showModal({
                  title: '出错了',
                  content: '请稍后再试',
                })
              }
            },
          })
        }
      })

    }

    this.setData({
      showBottomPopup: !this.data.showBottomPopup
    });
  },
  toggleClientCheck: function (e) {

    var index = this.data.passenger.findIndex(function (v) {
      return v.ID == e.currentTarget.dataset.id
    })
    var passenger = this.data.passenger
    passenger[index].is_checked = !passenger[index].is_checked;

    this.setData({
      passenger: passenger
    })

  },
  preventD: function () {

  },
  mypassenger: function () {
    var that = this
    var passenger = this.data.passenger
    var that = this
    var total = this.data.total;
    var mypassenger = passenger.filter(function (value) {
      return value.is_checked
    })
    mypassenger.map(function (v) {
      total += that.priceType(v.LeiXing, 1)

    })

    this.setData({
      showBottomPopup: !this.data.showBottomPopup,
      total: total,
      mypassenger: passenger.filter(function (value) {
        return value.is_checked
      })

    })

  },

  //判定票价类型
  priceType: function (leixing, field) {
    var that = this
    //LeiXing的字段，参数是成人: adult, 幼儿:childZ, 儿童不占床:childNZ, 老人:old
    //banchiPrice
    // adultPrice
    //childNZPrice
    // childZPrice
    // oldPrice
    //adultShu: 0,
    // childZShu: 0,
    //childNZShu: 0,
    //oldShu: 0
    var price = 0;
      var banchiPrice = this.data.banci.banchiPrice
    switch (leixing) {
      case 'adult':
        price = banchiPrice['adultPrice']
        that.setData({
          adultShu: that.data.adultShu + field
        })
        break;
      case 'childZ':
        price = banchiPrice['childZPrice']
        that.setData({
          childZShu: that.data.childZShu + field
        })
        break;
      case 'childNZ':
        price = banchiPrice['childNZPrice']
        that.setData({
          childNZShu: that.data.childNZShu + field
        })
        break;
      case 'old':
        price = banchiPrice['oldPrice']
        that.setData({
          oldShu: that.data.oldShu + field
        })
        break;
      default:
        price = banchiPrice['adultPrice']
        that.setData({
          adultShu: that.data.adultShu + field
        })
    }
    return price;

  },

  checkchange: function (e) {
    console.log(e.detail.value)
  },
  addclient: function () {
    wx.navigateTo({
      url: '../passenger/passenger',
    })
  },
  handleZanSwitchChange(e) {
    this.setData({
      checked: e.checked
    });
  },


  showModal(error) {
    wx.showModal({
      content: error,
      showCancel: false,
    })
  },
  nameinput: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  telinput: function (e) {
    this.setData({
      tel: e.detail.value
    })
  },
  idcardinput: function (e) {
    this.setData({
      idcard: e.detail.value
    })
  },

  //提交订单！！！！
  submit: function (e) {
    var that = this
    console.log(this.data.keren)

    var config = this.data.config;
    if (this.data.keren) {
      var value = this.data.my_passenger.find(function (v) {
        return v.ID == that.data.keren
      })
      config.base.idcard.value = value.ZhengJianHao
    }

    var _passenger = this.data.mypassenger.map(function (v) {
      return {
        "Name": v.KeRenName,
        "shouJi": v.ShouJi,
        "ZJLeiXing": "身份证",
        "zhengJianHao": v.ZhengJianHao,
        "piaoJiaLeiXing": v.LeiXing || "adult"
      }
    })


    if (this.data.name == "") {
      this.showModal("请填写姓名")
      return false
    }
    if (this.data.idcard == "") {
      this.showModal("请填写身份证号码")
      return false
    }

    if (this.data.tel == "") {
      this.showModal("请填写电话")
      return false
    }
    if (!checkMod(this.data.idcard)) {
      this.showModal("请填写正确的身份证号码")
      return false
    }
    if (! /^1[34578]\d{9}$/.test(this.data.tel)) {
      this.showModal("请填写正确的电话")
      return false
    }

    wx.showLoading({
      title: '保存中',
      mask: true
    })
    wx.request({
      url: app.globalData.domain + '/WeiXin/GetOpenid2',
      data: JSON.stringify({ Key: app.globalData.userInfo.Key }),
      method: "POST",
      success: function (res) {
        var res = res
        wx.request({
          url: app.globalData.domain + '/BanChe/BanChiOrder/Create',
          data: JSON.stringify({
            "Request": {
              "banchiPlanNO": that.data.banci.banchiPlanNO,
              "planNO": that.data.banci.planNO,
              "banchiLuXian": that.data.luxian,
              "banchiShu": {
                "adultShu": that.data.adultShu,
                "childZShu": that.data.childZShu,
                "childNZShu": that.data.childNZShu,
                "oldShu": that.data.oldShu
              },
              "custonerID": res.data.Result.Openid,
              "lianXiRen": that.data.name,
              "lianXiDianHua": that.data.tel,
              "ZJLeiXing": "身份证",
              "ZhengJianHao": that.data.idcard,
              "Customers": _passenger
            },
            "T": "json"
          }),
          method: "POST",
          success: function (res1) {
            wx.hideLoading();
            if (res1.data.Code == 0) {
              //调起微信支付
              wx.requestPayment({
                'timeStamp': res1.data.Result.XiaoChengXu.timeStamp,
                'nonceStr': res1.data.Result.XiaoChengXu.nonceStr,
                'package': 'prepay_id =' + res1.data.Result.XiaoChengXu.nonceStr,
                'signType': 'MD5',
                'paySign': res1.data.Result.XiaoChengXu.paySign,
                'success': function (res) {
                  wx.showToast({
                    title: '支付成功',
                    icon: 'success',
                  })
                  setTimeout(function () {
                    wx.redirectTo({
                      url: '../list/list'
                    })
                  }, 1500)
                },
                'fail': function (res) {
                  wx.showToast({
                    title: '支付失败',
                    icon: 'error',

                  })
                  setTimeout(function () {
                    wx.redirectTo({
                      url: '../list/list'
                    })
                  }, 1500)
                }
              })
            } else {
              wx.showToast({
                title: res1.data.Message,
                icon: 'none',

              })
              setTimeout(function () {
                wx.redirectTo({
                  url: '../list/list'
                })
              }, 1500)

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
      leixing: {
        mytype: true
      }
    }

    // 验证字段的提示信息，若不传则调用默认的信息
    const messages = {
      name: {
        required: '请填写取票人姓名',
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
      return (value != "0")
    }, '请选择类型')
  },




}));
