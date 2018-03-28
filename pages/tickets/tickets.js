const app = getApp();

Page({

  data: {
    dayTran: ['日', '一', '二', '三', '四', '五', '六'],
    trans: ["今天", "明天", "后天"],
    is_today: true
  },


  //下单
  order: function () {
    wx / wx.navigateTo({
      url: '../order/order',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })

  },

  //比较日期，添加desc
  compdate: function (date) {
    var that = this
    var _date = new Date();
    _date.setHours(0, 0, 0, 0)

    return Math.floor((date - _date) / 86400000);
  },

  //搜索日期
  navtodate: function () {
    var date = this.data.date
    wx.navigateTo({
      url: '../calendar/calendar?year=' + date.year + '&month=' + date.month + '&date=' + date.date,
    })

  },

  //后一天
  dateInc: function () {
    var that = this
    var date = this.data.date;
    var _date = new Date(date.year, date.month - 1, date.date);
    _date.setDate(parseInt(date.date) + 1);

    this.setData({
      date: { year: _date.getFullYear(), month: _date.getMonth() + 1, date: _date.getDate(), day: _date.getDay(), desc: that.data.trans[that.compdate(_date)] || "" },
      is_today: that.compdate(_date) == 0 ? true : false
    })
  },

  //前一天
  dateDec: function () {
    var that = this
    var date = this.data.date;
    var _date = new Date(date.year, date.month - 1, date.date);
    _date.setDate(parseInt(date.date) - 1);
    this.setData({
      date: { year: _date.getFullYear(), month: _date.getMonth() + 1, date: _date.getDate(), day: _date.getDay(), desc: that.data.trans[that.compdate(_date)] || "" },
      is_today: that.compdate(_date) == 0 ? true : false
    })
  },

  //调用查询接口
  search: function () {

    wx.request({
      url: app.globalData.domain +"/BanChe/BanChiList",
      data:{
        StarPlace:departure,
        EndPoint:arrival,
    
      },
    })        


  },



  onLoad: function () {
 



    this.setData({
      date: indexPage.data.date,
      curDate: new Date()
    })


  },
  onShow: function () {
    //如果当前页面栈出错则重定向
    var pages = getCurrentPages();
    if (pages.length < 2) {
      wx.reLaunch({
        url: '../index/index',
      })
    }
    //获取上一页的实例
    var indexPage = pages[pages.length - 2];
    
    var date = this.data.date;
    if (this.compdate(new Date(date.year, date.month - 1, date.date)) != 0) {
      this.setData({
        is_today: false
      })
    }


  }


})