// pages/volunteerManager/volunteerManager.js
var app = getApp();
Page({
  data: {
    tabs: ["义工审核", "义工管理"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    volunteerPro: [],
    allNum: 0,
    isShadow: true,
    hidden: true,
    voPro: {},
    tNum: 1,
    pNum: 1,
    isShowToast: true,
    toastData: '',
    status: 1,
    volunteerProClear: [],
    yid: '',
    hidden1: true,
  },
  onLoad: function(options) {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        console.log(res);
        that.setData({
          sliderLeft: res.windowWidth - (that.data.tabs.length - 0) * res.windowWidth / that.data.tabs.length,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    that.getVolunteerData();
  },
  onShow: function() {

  },
  // 义工审核、管理点击事件
  tabClick: function(e) {
    var activeIndex = e.currentTarget.id;
    if (activeIndex == 0) {
      this.getVolunteerData();
    } else {
      this.getVolunteerDataClear();
    }
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  // 义工审核页面
  getVolunteerData: function() {
    var that = this;
    wx.request({
      url: app.globalData.urlApi.volunteerJoin,
      data: {
        openid: app.globalData.openId
      },
      success: function(res) {
        if (res.data.code == 1) {
          var voPro = res.data.data;
          for (var i = 0; i < voPro.length; i++) {
            voPro[i]['isTrue'] = false
          }
          that.setData({
            volunteerPro: voPro
          })
        } else {
          that.setData({
            volunteerPro: []
          })
        }
      }
    })
  },
  // 义工申请管理
  btn_image: function(e) {
    console.log(e);
    var that = this;
    var volunteerPro = that.data.volunteerPro;
    var item = e.target.dataset.item;
    var voPro = that.data.voPro;
    for (var i = 0; i < volunteerPro.length; i++) {
      if (volunteerPro[i].id == item.id) {
        if (volunteerPro[i].isTrue) {
          volunteerPro[i].isTrue = false;
          delete(voPro['id' + volunteerPro[i].id]);
        } else {
          volunteerPro[i].isTrue = true;
          voPro['id' + volunteerPro[i].id] = volunteerPro[i].id;
        }
      }
    }
    console.log(voPro);
    that.setData({
      volunteerPro: volunteerPro,
      voPro: voPro
    })
  },
  // 义工申请全选操作
  btn_all_image: function() {
    var that = this;
    var volunteerPro = that.data.volunteerPro;
    var allNum = that.data.allNum;
    var voPro = that.data.voPro;
    if (allNum == 1) {
      allNum = 0;
      for (var i = 0; i < volunteerPro.length; i++) {
        volunteerPro[i]['isTrue'] = false;
      }
      voPro = {};
    } else {
      allNum = 1
      for (var i = 0; i < volunteerPro.length; i++) {
        volunteerPro[i]['isTrue'] = true;
        voPro['id' + volunteerPro[i].id] = volunteerPro[i].id
      }
    }
    that.setData({
      volunteerPro: volunteerPro,
      allNum: allNum,
      voPro: voPro
    })
  },
  // 义工申请通过操作
  btn_tongguo: function() {
    var that = this;
    var voPro = that.data.voPro;
    that.setData({
      isShadow: false,
      hidden: false,
      pNum: 2,
      status: 1,
    })
  },
  // 取消当前操作
  cancel: function() {
    var that = this;
    that.setData({
      isShadow: true,
      hidden: true,
      pNum: 1,
      tNum: 1
    })
  },
  // 义工申请未通过操作
  btn_no_tongguo: function() {
    var that = this;
    that.setData({
      isShadow: false,
      hidden: false,
      tNum: 2,
      status: 0,
    })
  },
  // 继续执行当前操作
  confirm: function() {
    var that = this;
    var voPro = that.data.voPro;
    var id = '';
    var status = that.data.status;
    console.log(voPro);
    for (var i in voPro) {
      if (voPro[i]) {
        id += voPro[i] + ',';
      }
    }
    console.log(id);
    id = id.substring(0, id.length - 1);
    console.log(id);
    if (id == '') {
      that.setData({
        isShowToast: false,
        toastData: '没有选择义工',
      })
      setTimeout(function() {
        that.setData({
          isShowToast: true,
          isShadow: true,
          hidden: true,
          pNum: 1,
          tNum: 1
        })
      }, 2000)
    } else {
      wx.request({
        url: app.globalData.urlApi.volunteerReview,
        data: {
          id: id,
          status: status
        },
        success: function(res) {
          if (res.data.code == 1) {
            that.setData({
              isShowToast: false,
              toastData: res.data.msg,
              isShadow: true,
              hidden: true,
            })
            setTimeout(function() {
              that.setData({
                isShowToast: true,
                pNum: 1,
                tNum: 1
              })
              that.getVolunteerData();
            }, 2000)
          } else {
            that.setData({
              isShowToast: false,
              toastData: res.data.msg,
            })
            setTimeout(function() {
              that.setData({
                isShowToast: true,
                isShadow: true,
                hidden: true,
                pNum: 1,
                tNum: 1
              })
            }, 2000)
          }
        }
      })
    }
  },
  // 义工管理事件
  getVolunteerDataClear: function() {
    var that = this;
    wx.request({
      url: app.globalData.urlApi.volunteerManagement,
      data: {
        openid: app.globalData.openId
      },
      success: function(res) {
        if (res.data.code == 1) {
          that.setData({
            volunteerProClear: res.data.data
          })
        } else {
          that.setData({
            volunteerProClear: []
          })
        }
      }
    })
  },
  // 移除义工
  btn_clear: function(e) {
    var that = this;
    that.setData({
      yid: e.target.dataset.id,
      isShadow: false,
      hidden1: false,
    })
  },
  confirm1: function() {
    var that = this;
    var yid = that.data.yid;
    wx.request({
      url: app.globalData.urlApi.deleteVolunteer,
      data: {
        id: yid
      },
      success: function(res) {
        if (res.data.code == 1) {
          that.setData({
            isShowToast: false,
            toastData: res.data.msg,
            hidden1: true,
          })
          setTimeout(function() {
            that.setData({
              isShowToast: true,
              isShadow: true,
            })
            that.getVolunteerDataClear();
          }, 2000)
        } else {
          that.setData({
            isShowToast: false,
            toastData: res.data.msg,
          })
          setTimeout(function() {
            that.setData({
              isShowToast: true,
              isShadow: true,
              hidden1: true,
            })
          }, 2000)
        }
      }
    })
  },
  cancel1: function() {
    this.setData({
      isShadow: true,
      hidden1: true,
    })
  }
})