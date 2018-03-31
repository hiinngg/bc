var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadlist()
  },

  cancel:function(e){
    var that = this
    var orderid = e.currentTarget.dataset.orderid
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: app.globalData.domain + '/WeiXin/GetOpenid2',
      data: JSON.stringify({ Key: app.globalData.userInfo.Key }),
      method: "POST",
      success: function (res) {
        var res = res
        wx.request({
          url: app.globalData.domain + '/BanChe/BanChiOrder/OrderCancel',
          data: {
            "Request": {
              "OrderID": orderid,
              "OpenId": res.data.Result.Openid
            },
            "T": "json"
          },
          method: "POST",
          success: function (res1) {
            if (res1.data.Code == 0) {
              wx.showToast({
                title: '取消成功',
                icon: 'success',
                duration: 2000
              })
            }else{
              wx.showToast({
                title: res1.data.Message,
                icon: 'none',
                duration: 2000
              })
            }
          },
          complete: function () {
            wx.hideLoading();
          }
        })


      }
    })

  },

  del:function(e){
    var that = this
    var orderid = e.currentTarget.dataset.orderid
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: app.globalData.domain + '/WeiXin/GetOpenid2',
      data: JSON.stringify({ Key: app.globalData.userInfo.Key }),
      method: "POST",
      success: function (res) {
        var res = res
        wx.request({
          url: app.globalData.domain + '/BanChe/BanChiOrder/OrderDelete',
          data: {
            "Request": {
              "OrderID": orderid,
              "OpenId": res.data.Result.Openid
            },
            "T": "json"
          },
          method: "POST",
          success: function (res1) {
            if (res1.data.Code == 0) {
              that.loadlist()
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 2000
              })
           
            } else {
              wx.showToast({
                title: res1.data.Message,
                icon: 'none',
                duration: 2000
              })
            }
          },
          complete: function () {
            wx.hideLoading();
          }
        })


      }
    })

  },

  loadlist:function(){
    var that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: app.globalData.domain + '/WeiXin/GetOpenid2',
      data: JSON.stringify({ Key: app.globalData.userInfo.Key }),
      method: "POST",
      success: function (res) {
        var res = res
        wx.request({
          url: app.globalData.domain+'/BanChe/BanChiOrder/OrderList',
          data: {
            "Request": {
              "OpenId":res.data.Result.Openid
            },
            "T": "json"
          },
          method: "POST",
          success: function (res1) {
            if(res1.data.Code==0){
              that.setData({
                orderlist: res1.data.Result.Orders
             })
            }
          },
          complete:function(){
            wx.hideLoading();
          }
        })


      }
    })

  },

detail:function(e){

  wx.navigateTo({
    url: '../detail/detail?id='+e.currentTarget.dataset.orderid,
  })
},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})