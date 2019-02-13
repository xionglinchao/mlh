// pages/readyClubBasic/readyClubBasic.js
var app = getApp();
const isPhone = require('../../utils/isPhone.js');
Page({
  data: {
    addressObj: {},
    logoImage: '',
    pics: [],
    dataProBasic: {},
    isShowToast: true,
    toastData: '',
    pics1: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var that = this;
    app.globalData.addressObj = {};

    that.getReadyData(options.id);
  },
  onShow: function () {
    var that = this;
    that.setData({
      addressObj: app.globalData.addressObj,

    })
  },
  btn_ready_club_address: function () {
    var that = this;

    wx.navigateTo({
      url: '../editor/editor?info=1&item=' + JSON.stringify(that.data.addressObj),
    })
  },
  btn_image: function () {
    var that = this;
    var logoImage = that.data.logoImage;

    wx.chooseImage({
      success: function (res) {
        logoImage = res.tempFilePaths[0];

        that.setData({
          logoImage: logoImage
        })
      },
    })
  },
  trimKong: function (s) {

    return JSON.parse(trim(s));

    function trim(str) {
      str = str.replace(/^(\s|\u00A0)+/, '');
      for (var i = str.length - 1; i >= 0; i--) {
        if (/\S/.test(str.charAt(i))) {
          str = str.substring(0, i + 1);
          break;
        }
      }
      return str;
    }
  },
  btn_images: function () {

    var that = this,
      pics = this.data.pics;

    wx.chooseImage({
      count: 9,
      success: function (res) {
        var imgsrc = res.tempFilePaths;
        pics = pics.concat(imgsrc);
        that.setData({
          pics: pics
        });

        // that.uploadimg(pics);
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  uploadimg: function () {//这里触发图片上传的方法
    var pics = this.data.pics;
    this.uploadimg1({
      url: app.globalData.urlApi.upLoadImage,//这里是你图片上传的接口
      path: pics//这里是选取的图片的地址数组
    });
  },
  uploadimg1: function (data) {
    var that = this,

      i = data.i ? data.i : 0,
      success = data.success ? data.success : 0,
      fail = data.fail ? data.fail : 0;
    var namePics = data.namePics ? data.namePics : [];
    console.log(data.path[i]);
    wx.uploadFile({
      url: data.url,
      filePath: data.path[i],
      name: 'file',//这里根据自己的实际情况改

      success: (resp) => {
        var dataName = JSON.parse(JSON.stringify(that.trimKong(resp.data)));

        if (dataName.code == 1) {
          success++;

          namePics.push(dataName.data);
          console.log(namePics);

          i++;
          if (i == data.path.length) {   //当图片传完时，停止调用          

            that.publishActivity(namePics);

          } else {//若图片还没有传完，则继续调用函数
            data.i = i;
            data.success = success;
            data.fail = fail;
            data.namePics = namePics;
            that.uploadimg1(data);
          }
        }
        //这里可能有BUG，失败也会执行这里,所以这里应该是后台返回过来的状态码为成功时，这里的success才+1
      },
      fail: (res) => {
        fail++;
      }
    });
  },
  btn_delete: function (e) {
    var that = this;
    var index = e.target.dataset.index;
    var pics = that.data.pics;

    for (var i = 0; i < pics.length; i++) {

      if (i == index) {
        pics.splice(i, 1);
        break;
      }
    }

    that.setData({
      pics: pics
    })


  },
  btn_submit: function (e) {
    var that = this;
    var item = e.detail.value;
    var pics = that.data.pics;
    var logoImage = that.data.logoImage;

    if (item.clubName == '') {
      that.setData({
        isShowToast: false,
        toastData: '请输入读书会名称',
      })

      setTimeout(function () {
        that.setData({
          isShowToast: true,
        })


      }, 2000)
    } else if (item.name == 0) {
      that.setData({
        isShowToast: false,
        toastData: '请输入您的名称',
      })

      setTimeout(function () {
        that.setData({
          isShowToast: true,
        })


      }, 2000)
    } else if (item.phone == 0) {
      that.setData({
        isShowToast: false,
        toastData: '请输入联系人电话',
      })

      setTimeout(function () {
        that.setData({
          isShowToast: true,
        })


      }, 2000)
    } else if (logoImage == '') {
      that.setData({
        isShowToast: false,
        toastData: '请上传logo图片',
      })

      setTimeout(function () {
        that.setData({
          isShowToast: true,
        })


      }, 2000)
    } else if (pics.length == 0) {
      that.setData({
        isShowToast: false,
        toastData: '请上传宣传图片',
      })

      setTimeout(function () {
        that.setData({
          isShowToast: true,
        })


      }, 2000)
    } else {
      that.setData({
        nameItem: item
      })


      console.log(pics);

      if (logoImage != app.globalData.urlApi.ossImageUrl + that.data.dataProBasic.logs) {
        pics.push(logoImage);
      }
      that.uploadimg(pics);

    }
  },
  publishActivity: function (namePics) {
    var that = this;
    var nameItem = that.data.nameItem;
    var dataProBasic = that.data.dataProBasic;
    var addressObj = that.data.addressObj;
    var logoImage = that.data.logoImage;
    var logos = '';
    if (logoImage == app.globalData.urlApi.ossImageUrl + dataProBasic.logs) {
      logos = dataProBasic.logs
    } else {
      logos = namePics[namePics.length - 1];
    }

    wx.request({
      url: app.globalData.urlApi.readyClubInfo,
      data: {
        id: dataProBasic.id,
        content: nameItem.name,
        litpic: JSON.stringify(namePics),
        name: nameItem.clubName,
        username: nameItem.name,
        phone: nameItem.phone,
        logo: logos,
        province: addressObj['capital'],
        city: addressObj['city'],
        area: addressObj['district'],
        address: addressObj['address'],
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: function (res) {

        if (res.data.code == 1) {
          that.setData({
            isShowToast: false,
            toastData: res.data.msg,
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
            toastData: res.data.msg,
          })

          setTimeout(function () {
            that.setData({
              isShowToast: true,
            })


          }, 2000)
        }
      }
    })
  },
  getReadyData: function (id) {
    var that = this;

    wx.request({
      url: app.globalData.urlApi.getReadyClubInfo,
      data: {
        id: id
      },
      success: function (res) {
        if (res.data.code == 1) {
          var dataProBasic = res.data.data;
          var addressObj = {
            'capital': dataProBasic.province,
            'city': dataProBasic.city,
            'district': dataProBasic.area,
            'address': dataProBasic.address
          }
          app.globalData.addressObj = addressObj;

          var napic = [];
          if (dataProBasic.litpic != '') {
            napic = dataProBasic.photo
          }

          that.setData({
            dataProBasic: dataProBasic,
            addressObj: addressObj,
            logoImage: app.globalData.urlApi.ossImageUrl + dataProBasic.logs,
            pics1: napic
          })
        }
      }
    })
  }
})