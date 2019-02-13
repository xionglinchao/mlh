// pages/volunteerManager/volunteerManager.js
var app = getApp();
var moveXList = [0, 0]//X轴移动的距离
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["读书会审核", "读书会管理"],
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
    isLoading: false,
    isGap1: false,
    isGap2: false,
    square_color: 0,
    startX: 0, //开始坐标
    startY: 0,
    isViewDisabled: true,
    isCreateClub: false,
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res);
        that.setData({
          sliderLeft: res.windowWidth - (that.data.tabs.length - 0) * res.windowWidth / that.data.tabs.length,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex,
          square_color: app.globalData.square_color
        });
      }
    });
    that.getVolunteerData();
    that.getVolunteerDataClear();
  },
  onShow: function () {
    var that = this;

    if (that.data.activeIndex == 0) {
      that.getVolunteerData();

    } else {
      that.getVolunteerDataClear();
    }

    that.setData({
      isViewDisabled: true
    })
  },
  tabClick: function (e) {
    var activeIndex = e.currentTarget.id;
    console.log(activeIndex);
    if (activeIndex == 0) {
      this.getVolunteerData();
    } else {
      this.getVolunteerDataClear();
    }
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
      isLoading: false
    });
  },
  getVolunteerData: function () {
    var that = this;


    wx.request({
      url: app.globalData.urlApi.getCheckReadClub,
      data: {
        openid: app.globalData.openId
      },
      success: function (res) {

        if (res.data.code == 1) {
          var voPro = res.data.data;
          for (var i = 0; i < voPro.length; i++) {
            voPro[i]['isTrue'] = false
          }
          that.setData({
            volunteerPro: voPro,
            isLoading: true,
            isGap2: false
          })
        } else {
          that.setData({
            volunteerPro: [],
            isLoading: true,
            isGap2: true
          })
        }
      }
    })
  },
  btn_image: function (e) {
    var that = this;
    var volunteerPro = that.data.volunteerPro;
    var item = e.target.dataset.item;
    var voPro = that.data.voPro;

    for (var i = 0; i < volunteerPro.length; i++) {
      if (volunteerPro[i].id == item.id) {
        if (volunteerPro[i].isTrue) {
          volunteerPro[i].isTrue = false;
          delete (voPro['id' + volunteerPro[i].id]);
        } else {
          volunteerPro[i].isTrue = true;
          voPro['id' + volunteerPro[i].id] = volunteerPro[i].id;
        }
      }
    }
    that.setData({
      volunteerPro: volunteerPro,
      voPro: voPro
    })

  },
  btn_all_image: function () {
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
  btn_tongguo: function () {
    var that = this;
    var voPro = that.data.voPro;



    that.setData({
      isShadow: false,
      hidden: false,
      pNum: 2,
      status: 1,
    })
  },
  cancel: function () {
    var that = this;

    that.setData({
      isShadow: true,
      hidden: true,
      pNum: 1,
      tNum: 1
    })
  },
  btn_no_tongguo: function () {
    var that = this;


    that.setData({
      isShadow: false,
      hidden: false,
      tNum: 2,
      status: 0,
    })
  },
  confirm: function () {
    var that = this;
    var voPro = that.data.voPro;
    var id = '';
    var status = that.data.status;
    for (var i in voPro) {
      if (voPro[i]) {
        id += voPro[i] + ',';
      }
    }
    id = id.substring(0, id.length - 1);

    if (id == '') {
      that.setData({
        isShowToast: false,
        toastData: '没有选择读书会',
      })

      setTimeout(function () {
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
        url: app.globalData.urlApi.auditingReadClub,
        data: {
          id: id,
          status: status
        },
        success: function (res) {
          console.log(res);

          if (res.data.code == 1) {
            that.setData({
              isShowToast: false,
              toastData: '操作成功',
            })

            setTimeout(function () {
              that.setData({
                isShowToast: true,
                isShadow: true,
                hidden: true,
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

            setTimeout(function () {
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
  getVolunteerDataClear: function () {
    var that = this;

    wx.request({
      url: app.globalData.urlApi.readClubManagerLib,
      data: {
        openid: app.globalData.openId
      },
      success: function (res) {
        console.log('=======');
        console.log(res);

        if (res.data.code == 1) {

          that.setData({
            volunteerProClear: res.data.data.book,
            isLoading: true,
            isGap1: false
          })
        } else {
          that.setData({
            volunteerProClear: [],
            isLoading: true,
            isGap1: true
          })
        }
      }
    })
  },
  btn_clear: function (e) {
    var that = this;

    that.setData({
      yid: e.target.dataset.id,
      isShadow: false,
      hidden1: false,
    })


  },
  confirm1: function () {
    var that = this;
    var yid = that.data.yid;
    wx.request({
      url: app.globalData.urlApi.deleteReadClub,
      data: {
        id: yid
      },
      success: function (res) {

        if (res.data.code == 1) {
          that.getVolunteerDataClear();
        }

        that.setData({
          isShowToast: false,
          toastData: res.data.msg,
          isShadow: true,
          hidden1: true,
        })

        setTimeout(function () {
          that.setData({
            isShowToast: true,
            isShadow: true,
            hidden1: true,

          })

        }, 2000)
      }
    })
  },
  cancel1: function () {
    this.setData({

      isShadow: true,
      hidden1: true,
    })

  },
  btn_create_ready_club: function () {
    var that = this;

    that.setData({
      isViewDisabled: false
    })

    wx.navigateTo({
      url: '../createReadyClub/createReadyClub',
    })
  },
  btn_infor: function (e) {
    var that = this;

    that.setData({
      isViewDisabled: false
    })
    wx.navigateTo({
      url: '../readyClubInfo/readyClubInfo?id=' + e.currentTarget.dataset.id,
    })
  },
  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.volunteerProClear.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      volunteerProClear: this.data.volunteerProClear
    })
  },
  //滑动事件处理
  touchmove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,//当前索引
      startX = that.data.startX,//开始X坐标
      startY = that.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    that.data.volunteerProClear.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      volunteerProClear: that.data.volunteerProClear
    })
  },
  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
})