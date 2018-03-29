var Zan = require('../../bower_components/zanui-weapp/dist/index');

Page(Object.assign({}, Zan.Switch, {
  data: {
    checked: false,
    showBottomPopup: false
  },

  onLoad(query) {
    //如果当前页面栈出错则重定向
    var pages = getCurrentPages();
    if (pages.length < 2) {
      wx.reLaunch({
        url: '../index/index',
      })
    }
    //获取上一页实例
    var ticketsPage = pages[pages.length - 2]; 
    this.setData({
      banci: ticketsPage.data.bancheList[query.banciidx],
      luxian: ticketsPage.data.bancheList[query.banciidx].banchiLuXian[query.luxianidx],
      departure: ticketsPage.data.departure,
      arrival: ticketsPage.data.arrival,
      date: ticketsPage.data.date,
      total:0
    })

    console.log(ticketsPage.data.bancheList[query.banciidx])
    console.log(ticketsPage.data.bancheList[query.banciidx].banchiLuXian[query.luxianidx])


  },

  onShow() {
  },
  toggleBottomPopup() {
    this.setData({
      showBottomPopup: !this.data.showBottomPopup
    });
  },
  toggleClientCheck: function () {

  },
  preventD: function () {

  },
  checkchange:function(e){
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
  }
}));
