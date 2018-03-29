//app.js
App({
  onLaunch: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
       
        if(res.data){
          that.globalData.userInfo =  res.data
          wx.hideLoading()
        }
      },
      fail: function () {
      //木有缓存用户信息
       that.mylogin()
      }
    })
  },

  mylogin: function () {

    var that = this
    // 登录
    wx.login({
      success: res => {

        that.mygetset(res.code)
      }
    })
    // 获取用户信息

  },


  mygetset: function (code) {
    var that = this
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框 
          that.myuserinfo(code)

        } else {
          wx.authorize({
            scope: 'scope.userInfo',
            success() {
              that.myuserinfo(code)
            }
          })
        }
      }
    })

  },

  myuserinfo: function (mycode) {
    var that = this
    wx.getUserInfo({
      success: res => {
        wx.request({
          url: that.globalData.domain + "/WeiXin/GetOpenid",
          method: "POST",
          data: JSON.stringify({
            code: mycode,
            iv: res.iv,
            encryptedData: res.encryptedData
          }),
          success: function (res) {
            wx.setStorageSync('userInfo', res.data.Result)
            that.globalData.userInfo = res.data.Result

          }, complete: function () {
            wx.hideLoading()
          }
        })
      }
    })

  },

  globalData: {
    location: null,
    userInfo: null,
    domain: "https://api.jcjq.com.cn"
  }
})