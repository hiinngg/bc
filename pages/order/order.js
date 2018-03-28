var Zan = require('../../bower_components/zanui-weapp/dist/index');

Page(Object.assign({}, Zan.Switch, {
  data: {
    checked: false,
    showBottomPopup: false
  },

  onLoad() {
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
