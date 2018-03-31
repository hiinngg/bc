var Zan = require('../../bower_components/zanui-weapp/dist/index');
const app = getApp();

Page(Object.assign({}, Zan.Select, Zan.Switch, {

  data: {
    dayTran: ['日', '一', '二', '三', '四', '五', '六'],
    trans: ["今天", "明天", "后天"],
    is_today: true,
    toggleSpPopup: false,
    items: [
      {
        padding: 0,
        value: '1',
        name: '选项一',
      },
      {
        padding: 0,
        value: '2',
        name: '选项二',
      },
    ],

    checked: {
      base: -1,
      color: -1,
      form: -1
    },

    activeColor: '#5F9df1'
  },

  toggleSpPopup: function () {
    this.setData({
      toggleSpPopup: !this.data.toggleSpPopup
    });
  },



  //下单
  order: function (e) {
    var _dataset = e.currentTarget.dataset
    wx / wx.navigateTo({
      url: '../order/order?banciidx=' + _dataset.bancino + '&luxianidx=' + _dataset.luxianidx,
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
    }, function () {
      that.search();
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
    }, function () {
      that.search();
    })
  },


  //调用查询接口
  search: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.domain + "/BanChe/BanChiList",
      method: "POST",
      data: JSON.stringify({
        StarPoint: that.data.departure,
        EndPoint: that.data.arrival,
        Date: that.data.date.year + "-" + that.data.date.month + "-" + that.data.date.date
      }),
      success: function (res) {
        //data.Code状态码：405 木有班次
        // 400 传入时间小于当前时间!
        // 0   有结果

        if (res.data.Code == 0) {
          that.setData({
            bancheList: res.data.Result.bancheList
          })
        } else {
          that.setData({
            bancheList: []
          })
        }
      }, complete: function () {
        wx.hideLoading()
      }
    })


  },

  datediff: function (date) {  
    //将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式   
    return date.replace(/\-/g, "/");  
  
  }, 

  onLoad: function (query) {
    var that = this

    //如参数未传递则跳到首页
    if (!query || JSON.stringify(query) == "{}") {
      wx.reLaunch({
        url: '../index/index',
      })
    }
    var _date = new Date(this.datediff(query.date));
    //渲染数据
    this.setData({
      departure: query.departure,
      arrival: query.arrival,
      date: { year: _date.getFullYear(), month: _date.getMonth() + 1, date: _date.getDate(), day: _date.getDay(), desc: that.data.trans[that.compdate(_date)] || "" },
    })
  },


  onShow: function () {
  var that = this
    var date = this.data.date;
    if (this.compdate(new Date(date.year, date.month - 1, date.date)) != 0) {
      this.setData({
        is_today: false
      }, function () {
        that.search();
      })
    }
    that.search();

  },

  onReady: function () {


  }


}))