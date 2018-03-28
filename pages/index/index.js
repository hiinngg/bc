//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    dayTran: ['日', '一', '二', '三', '四', '五', '六'],
    departure: "中山市",
    arrival: "广州市"
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  //查询火车票
  search: function () {
    var that = this
    //拼接日期
    if (!this.date || JSON.stringify(this.date) == "{}") {  //假设用户没选择日期
      var date = new Date();
    } else {
      var date = new Date(this.date.year, this.date.month, this.date.date) ;
    }

    wx.navigateTo({
      url: '../tickets/tickets?departure='+that.data.departure+"&arrival="+that.data.arrival+"&date="+date,
    })
  },


//出发城市与到达城市互换
  myrotate: function () {
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: "ease",
      delay: 0
    })
    var trun = this.data.trun
    var _arrival = this.data.departure;
    var _departure = this.data.arrival
    if (trun) {
      animation.rotate(0).step()

    } else {
      animation.rotate(180).step()
    }
    this.setData({
      animationData: animation.export(),
      trun: !trun,
      arrival: _arrival,
      departure: _departure
    })
  },



  //搜索到达城市
  navtoarr: function () {
    wx.navigateTo({
      url: '../place/place?type=arrival',
    })
  },
  //搜索出发城市
  navtodep: function () {
    wx.navigateTo({
      url: '../place/place?type=departure',
    })
  },

  //搜索日期
  navtodate: function () {
    var date = this.data.date
    wx.navigateTo({
      url: '../calendar/calendar?year=' + date.year + '&month=' + date.month + '&date=' + date.date,
    })

  },


  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    //初始化日期
    var _date = new Date()
    var date = {
      year: _date.getFullYear(),
      month: _date.getMonth() + 1,
      date: _date.getDate(),
      day: _date.getDay(),
      desc: "今天"
    }
    this.setData({
      date
    })



  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
