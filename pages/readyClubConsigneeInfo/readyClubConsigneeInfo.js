// pages/readyClubConsigneeInfo/readyClubConsigneeInfo.js
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
    isShadow: true,
    isShadow1: true,
    cityIndex: -1,
    areaIndex: -1,
    counry: -1,
    typeNum: 1,
    citys_1: [],
    citys_2: [],
    citys_0: [],
    id: '',
    isShowToast: true,
    toastData: '',
    hidden: true,
    dataProBasic: {},
    region: ['', '', '']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    that.getReadyData(options.id);
  },
  onShow: function () {

  },
  getReadyData: function (id) {
    var that = this;

    wx.request({
      url: app.globalData.urlApi.getReadyClubInfo,
      data: {
        id: id
      },
      success: function (res) {
        console.log(res);
        if (res.data.code == 1) {
          var dataProBasic = res.data.data;
          var cityIndex = -1;
          var areaIndex = -1;
          var counry = -1;
          if (dataProBasic.acceptance_province) {
            var region = [dataProBasic.acceptance_province, dataProBasic.acceptance_city, dataProBasic.acceptance_area];
            that.setData({
              name: dataProBasic.acceptance_name,
              phone: dataProBasic.acceptance_phone,
              region: region,
              address: dataProBasic.acceptance_address,
              id: dataProBasic.id,
              dataProBasic: dataProBasic,
            })
          }else{
            that.setData({
              name: dataProBasic.acceptance_name,
              phone: dataProBasic.acceptance_phone,
              address: dataProBasic.acceptance_address,
              id: dataProBasic.id,
              dataProBasic: dataProBasic,
            })
          }
        }
      }
    })
  },
  btn_city: function (e) {//选择省市区
    var that = this;
    var item = e.detail.value;

    that.setData({
      region: item
    })
  },
  btn_shadow: function () {
    var that = this;

    that.setData({
      isLib: true,
      isShadow: true,
      isShadow1: true,
      hidden: true
    })
  },
  formSubmit: function (e) {
    var that = this;
    var that = this;
    var id = that.data.id;
    var region = that.data.region;
    var item = e.detail.value;
    var dataProBasic = that.data.dataProBasic;


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
    } else if (region[0] == '') {
      that.setData({
        isShowToast: false,
        toastData: '请输入省/市/区',
      })

      setTimeout(function () {
        that.setData({
          isShowToast: true,
        })
      }, 2000)
    } else {
      wx.request({
        url: app.globalData.urlApi.editReadyClubNameAddress,
        data: {
          id: dataProBasic.id,
          acceptance_name: item.name,
          acceptance_phone: item.phone,
          acceptance_address: item.address,
          acceptance_province: region[0],
          acceptance_city: region[1],
          acceptance_area: region[2]
        },
        success: function (res) {
          if (res.data.code == 1) {
            that.setData({
              isShowToast: false,
              toastData: '修改成功',
            })

            setTimeout(function () {
              that.setData({
                isShowToast: true,
              })

              wx.navigateBack({
                delta: 1
              })

            }, 2000)
          } else {
            that.setData({
              isShowToast: false,
              toastData: '修改失败',
            })

            setTimeout(function () {
              that.setData({
                isShowToast: true,
              })

            }, 2000)
          }
        }
      })
    }
  }
})