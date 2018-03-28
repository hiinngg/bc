// pages/place/place.js
const config = require("../../utils/config.js");
const cityObjs = require('../../utils/city.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputValue: "",
    type: "",
    typeTran: { 'arrival': "到达的城市", 'departure': "出发的城市" }
  },
  choose: function () {
    wx.navigateBack({})
  },
  getLocation: function () {
    console.log("正在定位城市");
    this.setData({
      county: ''
    })
    const that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        let latitude = res.latitude
        let longitude = res.longitude
        wx.request({
          url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=${config.key}`,
          success: res => {
            // console.log(res)
            // console.log(res.data.result.ad_info.city+res.data.result.ad_info.adcode);
            that.setData({
              city: res.data.result.ad_info.city,
              currentCityCode: res.data.result.ad_info.adcode,
            }, function () {
              app.globalData.location = {
                'city': res.data.result.ad_info.city,
                'citycode': res.data.result.ad_info.adcode
              }
            })

          }
        })
      }
    })
  },
  onLoad: function (query) {
    var _this = this
    this.setData({
      type: query['type']
    })
    //获取历史记录
    wx.getStorage({
      key: 'historyCity',
      success: function (res) {
        _this.setData({
          historyCity: res.data
        })
      },
      fail: function () {
        _this.setData({
          historyCity: []
        })
      }
    })


    //是否需要定位
    if (app.globalData.location) {
      var location = app.globalData.location
      this.setData({
        city: location.city,
        currentCityCode: location.citycode,
      })
    } else {
      this.getLocation();
    }

  },

  //选择城市
  bindCity: function (e) {
    const city = e.currentTarget.dataset.city;
    var type = this.data.type
    var data = {};
    data[type] = city;
    var hisCity = this.data.historyCity
    hisCity.push(city)
    wx.setStorage({
      key: 'historyCity',
      data: Array.from(new Set(hisCity)),
    })
    //如果当前页面栈出错则重定向
    var pages = getCurrentPages();
    if (pages.length < 2) {
      wx.reLaunch({
        url: '../index/index',
      })
    }
    var indexPage = pages[pages.length - 2];
    indexPage.setData(data, function () {
      wx.navigateBack({})
    })

  },

  clearInput: function () {
    this.setData({
      inputValue: ""
    });
  },
  autoSearch: function (e) {
    var _this = this;
    this.setData({
      inputValue: e.detail.value

    }, function () {
      //自动搜索
      _this.auto()
    });
  },


  //自动搜索
  auto: function () {
    let inputSd = this.data.inputValue.trim()
    let sd = inputSd.toLowerCase()
    let num = sd.length
    const cityList = cityObjs.cityObjs
    // console.log(cityList.length)
    let finalCityList = []

    let temp = cityList.filter(
      item => {
        let text = item.short.slice(0, num).toLowerCase()
        return (text && text == sd)
      }
    )
    //在城市数据中，添加简拼到“shorter”属性，就可以实现简拼搜索
    let tempShorter = cityList.filter(
      itemShorter => {
        if (itemShorter.shorter) {
          let textShorter = itemShorter.shorter.slice(0, num).toLowerCase()
          return (textShorter && textShorter == sd)
        }
        return
      }
    )

    let tempChinese = cityList.filter(
      itemChinese => {
        let textChinese = itemChinese.city.slice(0, num)
        return (textChinese && textChinese == sd)
      }
    )

    if (temp[0]) {
      temp.map(
        item => {
          let testObj = {};
          testObj.city = item.city
          testObj.code = item.code
          finalCityList.push(testObj)
        }
      )
      this.setData({
        completeList: finalCityList,
      })
    } else if (tempShorter[0]) {
      tempShorter.map(
        item => {
          let testObj = {};
          testObj.city = item.city
          testObj.code = item.code
          finalCityList.push(testObj)
        }
      );
      this.setData({
        completeList: finalCityList,
      })
    } else if (tempChinese[0]) {
      tempChinese.map(
        item => {
          let testObj = {};
          testObj.city = item.city
          testObj.code = item.code
          finalCityList.push(testObj)
        })
      this.setData({
        completeList: finalCityList,
      })
    } else {
      this.setData({
        completeList: [],
      })
      return
    }
  },

})