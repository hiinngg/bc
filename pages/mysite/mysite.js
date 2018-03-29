var  app = getApp();

Page({

  data: {
    userInfo:app.globalData.userInfo
  },
orderlist:function(){
  wx.navigateTo({
    url: '../list/list',
  })

},
onLoad:function(){
  if (app.globalData.userInfo) {
    this.setData({
      userInfo: app.globalData.userInfo,

    })
  }

}
})