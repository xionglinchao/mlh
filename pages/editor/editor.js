// pages/addressRevise/addressRevise.js
var app = getApp();
const isPhone = require('../../utils/isPhone.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeAdress: 1,
    phone: '',
    name: '',
    capital: '',
    city: '',
    district: '',
    address: '',
    citys: [],
    topNum: 0,
    typeNum: 1,
    id: '',
    isShowToast: true,
    toastData: '',
    region:['','','']
  },
  onLoad: function (options) {
    console.log(options);
    var that = this;
    var dataItem = JSON.parse(options.item);

    if (dataItem.capital) {
      var region = [dataItem.capital, dataItem.city, dataItem.district];

      that.setData({
        typeAdress: options.info,
        name: dataItem.name,
        phone: dataItem.phone,
        region: region,
        address: dataItem.address,
        id: dataItem.id,
      })
    } else {
      that.setData({
        typeAdress: options.info,
      })
    }
  },
  onShow: function () {

  },
  btn_city: function (e) {
    console.log(e);
    var that = this;
    var item = e.detail.value;

    that.setData({
      region: item
    })
  },
  
  formSubmit: function (e) {
    console.log(e);
    var that = this;
    var id = that.data.id;
    var region = that.data.region;
    var item = e.detail.value;

    if (!item.name) {
      if (item.address == '') {
        that.setData({
          isShowToast: false,
          toastData: '请输入收货人地址',
        })

        setTimeout(function () {
          that.setData({
            isShowToast: true,
          })

        }, 2000)
      } else if (region[0] == '') {
        that.setData({
          isShowToast: false,
          toastData: '请选择省/市/区',
        })

        setTimeout(function () {
          that.setData({
            isShowToast: true,
          })

        }, 2000)
      }else {

        item['capital'] = region[0];
        item['city'] = region[1];
        item['district'] = region[2];

        console.log(item);

        app.globalData.addressObj = item;

        wx.navigateBack({
          delta: 1
        })

      }
    } else {
      
      if (item.name == '') {
        that.setData({
          isShowToast: false,
          toastData: '请输入收货人姓名',
        })

        setTimeout(function () {
          that.setData({
            isShowToast: true,
          })


        }, 2000)
      } else if (item.phone == '') {
        that.setData({
          isShowToast: false,
          toastData: '请输入收货人电话',
        })

        setTimeout(function () {
          that.setData({
            isShowToast: true,
          })

        }, 2000)
      } else if (item.address == '') {
        that.setData({
          isShowToast: false,
          toastData: '请输入收货人地址',
        })

        setTimeout(function () {
          that.setData({
            isShowToast: true,
          })

        }, 2000)
      } else if (region[0] == '') {
        that.setData({
          isShowToast: false,
          toastData: '请选择省/市/区',
        })

        setTimeout(function () {
          that.setData({
            isShowToast: true,
          })

        }, 2000)
      } else if (!isPhone.phone(item.phone)) {
        that.setData({
          isShowToast: false,
          toastData: '收货人号码格式错误',
        })

        setTimeout(function () {
          that.setData({
            isShowToast: true,
          })

        }, 2000)
      } else {

        item['capital'] = region[0];
        item['city'] = region[1];
        item['district'] = region[2];

        console.log(item);

        app.globalData.addressObj1 = item;

        wx.navigateBack({
          delta: 1
        })

      }
    }

  },
  confirm: function () {
    var that = this;
    var id = that.data.id;

    wx.request({
      url: app.globalData.urlApi.deleteAddress,
      data: {
        id: id
      },
      success: function (res) {
        console.log(res);

        if (res.data.code == 1) {
          that.setData({
            isShowToast: false,
            toastData: '删除成功',
          })

          setTimeout(function () {
            that.setData({
              isShowToast: true,
              isLoading: true
            })

            wx.navigateBack({
              delta: 1
            })

          }, 2000)
        } else {
          that.setData({
            isShadow1: true,
            hidden: true
          })
        }
      }
    })
  },
  cancel: function () {
    var that = this;

    that.setData({
      isShadow1: true,
      hidden: true
    })
  }
})