// pages/giveBook/giveBook.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lon: 0,
    lat: 0,
    markers: [],
    markers_1: [],
    isShadow: true,
    isContact: true,
    addressNum: 0,
    id: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {

        console.log(res);

        that.setData({
          lon: res.longitude,
          lat: res.latitude,
          id: options.id
        })
      },
    })

    that.getAddressData();
  },
  onShow: function () {

  },
  btn_marker: function (e) {
    var that = this;
    var markers = that.data.markers;

    var nPro = [];
    var mObj = {};
    console.log(markers);
    for (var i = 0; i < markers.length; i++) {

      if (e.markerId.indexOf("h") > -1) {
        var strAboce = that.strAboce(e.markerId);
        var strAfter = that.strAfter(e.markerId);
        var parameterStrng = '?id=' + strAfter + '&orderId=' + that.data.id;
        app.navigateWx(that, '../giveBookT/giveBookT', parameterStrng);

        return;

      } else {
        if (that.strAboce(markers[i].id) == e.markerId) {
          if (e.markerId == markers[i].id) {
            if (markers[i].isHidden == true) {
              nPro = markers[i].bookPro;
              markers[i].isHidden = false;

            } else {
              markers[i].isHidden = true;
            }
          } else {
            markers.splice(i--, 1);

          }

        }
      }

    }

    for (var j = 0; j < nPro.length; j++) {

      var mObj = {};
      mObj['iconPath'] = '../../images/readingstation/d.png';
      mObj['id'] = e.markerId + 'h' + nPro[j].id;
      mObj['latitude'] = nPro[j].lat;
      mObj['longitude'] = nPro[j].lng;
      mObj['width'] = 40;
      mObj['height'] = 40;
      markers.push(mObj);
    }


    that.setData({
      markers: markers,
    })

    if (i == markers.length) {
      console.log(markers);
      that.setData({
        markers: markers
      })
    }



  },
  getAddressData: function () {

    var that = this;

    wx.request({
      url: app.globalData.urlApi.getReadStation,
      data: {},
      success: function (res) {
        console.log(res);

        if (res.data.code == 1) {

          var marker = that.data.markers;
          var item = res.data.data;

          for (var i = 0; i < item.length; i++) {
            var mObj = {};
            mObj['iconPath'] = '../../images/l.png';
            mObj['id'] = item[i].id;
            mObj['latitude'] = item[i].lat;
            mObj['longitude'] = item[i].lng;
            mObj['width'] = 20;
            mObj['height'] = 50;
            mObj['bookPro'] = item[i].book;
            mObj['isHidden'] = true;
            marker.push(mObj);
          }

          that.setData({
            markers: marker,
            markers_1: marker
          })

        }
      }
    })
  },
  strAfter: function (str) {
    var i = str.indexOf("h");
    if (i > -1) {
      return str.substring(i + 1, str.length);
    }
    return str;

  },
  strAboce: function (str) {
    var i = str.indexOf("h");

    if (i > -1) {
      console.log(str.substring(0, i));
      return str.substring(0, i);
    }
    return str;

  }
})