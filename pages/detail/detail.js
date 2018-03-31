// pages/detail/detail.js
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
  onLoad: function (query) {
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
          url: app.globalData.domain + '/BanChe/BanChiOrder/OrderDetailed',
          data: {
            "Request": {
              "OpenId": res.data.Result.Openid,
              "OrderID":query.id
            },
            "T": "json"
          },
          method: "POST",
          success: function (res1) {
            if (res1.data.Code == 0) {
              var result = res1.data.Result
              result.Customers.map(function(v){      
               var a = v.ZhengJianHao.split('')   //将a字符串转换成数组
                a.splice(6, 8, 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x');
                v.ZhengJianHao = a.join('')
              })
              result['c_length'] = result.Customers.length

             var b=  result.ZhengJianHao.split('')
             b.splice(6, 8, 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x');
             result.ZhengJianHao = b.join('')
              that.setData({
                order: res1.data.Result
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