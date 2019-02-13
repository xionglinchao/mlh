var app = getApp();
Page({
  data: {
    volunteerProClear: [],
    clubAddress: null,
    isClubAddress: true,
    isClubPerson: true,
    isCreateClub: true,
    isCreate: 0,
    clubName: null,
    isClub: 1,
    clubId: 0,
    isViewDisabled: true,
    isCreateClub: true,
    isNotClubPerson: true,
    modalAnimation:{},
    windowHeight: null,
    isLoading: false,
    isData: 0,
    region: ['','',]
  },
  onLoad: function (options) {
    var that = this;
    
      wx.getSystemInfo({
        success: function(res) {
          that.setData({
            windowHeight: res.windowHeight
          })
          
        },
      })
   
  },
  onShow: function () {
    var that = this;
    that.setData({
        isViewDisabled: true
      })

      that.getClubAuthorize();
      that.getVolunteerDataClear();
  },
  bindMultiPickerChange:function(e){
    var that = this;
    var item = e.detail.value;

    that.setData({
      region: item
    })
    wx.request({
      url: app.globalData.urlApi.getClubAddress,
      data:{
        openid: app.globalData.openId,
        province: item[0],
        city: item[1],
        area: item[2]
      },
      success:function(res){
        console.log(res);

        if(res.data.code == 2){

          that.setData({
            clubName: res.data.data.recitation.name + '阅读小站',
            isClub: 2,
            clubId: res.data.data.recitation.id
          })
        }else if(res.data.code == 1){
          that.setData({
            clubName: res.data.data.recitation.name + '阅读小站',
            isClub: 1,
            clubId: res.data.data.recitation.id
          })
        }
      }
    })
  },
  btn_create_club:function(){
    var that  =this;
    var isCreate = that.data.isCreate;

    wx.request({
      url: app.globalData.urlApi.getClubAuthorize,
      data: {
        openid: app.globalData.openId
      },
      success: function (res) {
        console.log(res);

        if (res.data.code == 1) {
          //可创建读书会
          that.setData({
            isCreate: 1,
            isData: res.data.data
          })

          that.setData({

            isClubAddress: false,
            isCreateClub: false,
          })
        } else if (res.data.code == 2) {
          //已有读书会
          that.setData({
            isCreate: 2,
            isData: res.data.data
          })

          that.setData({
            isNotClubPerson: false,
            isCreateClub: false,
          })

        } else if (res.data.code == 3) {
          //已有读书会
          that.setData({
            isCreate: 3,
            isData: res.data.data
          })

          that.setData({

            isClubAddress: false,
            isCreateClub: false,
          })

        } else if (res.data.code == -1) {
          //不是义工
          that.setData({
            isCreate: -1
          })

          that.setData({

            isClubAddress: false,
            isCreateClub: false,
          })
        }
      }
    })
    

  },
  getClubAuthorize:function(){
    var that = this;

    wx.request({
      url: app.globalData.urlApi.getClubAuthorize,
      data:{
        openid: app.globalData.openId
      },
      success:function(res){
        console.log(res);

        if(res.data.code == 1){
          //可创建读书会
          that.setData({
            isCreate: 1,
            isData: res.data.data
          })
        } else if (res.data.code == 2){
          //已有读书会
          that.setData({
            isCreate: 2,
            isData: res.data.data
          })

        } else if (res.data.code == 3) {
          //已有读书会
          that.setData({
            isCreate: 3,
            isData: res.data.data
          })

        } else if (res.data.code == -1){
          //不是义工
          that.setData({
            isCreate: -1
          })
        }
      }
    })
  },
  btn_create:function(){

    var that =this;

    var isClub = that.data.isClub;
    var clubId = that.data.clubId;

    if (isClub == 2 ){

      that.setData({
        isClubPerson: false,
        isClubAddress: true,
        isCreateClub: false,
      })
    }else{

    
      wx.navigateTo({
        url: '../createReadyClub/createReadyClub?clubId=' + clubId,
      })

      that.setData({
        isClubAddress: true,
        isCreateClub: true
      })
    }
  },
  club_go:function(){
    var that = this;

    var clubId = that.data.clubId;

    
    wx.navigateTo({
      url: '../joinMeeting/joinMeeting?type=1&id=' + that.data.clubId,
    })
    that.setData({
      isViewDisabled: true,
      isClubPerson: true,
      isClubAddress: true,
      isCreateClub: true,
    })
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

        that.setData({
          isLoading: true
        })

        if (res.data.code == 1) {
          if (res.data.data.book.length > 0){
            that.setData({
              volunteerProClear: res.data.data.book,

            })
          }else{
            that.setData({
              volunteerProClear: null,

            })
          }
          
        } else {
          that.setData({
            volunteerProClear: null,
            
          })
        }
      }
    })
  },
  club_Not:function(){
    var that  =this;

    that.setData({
      isNotClubPerson: true,
      isCreateClub: true,
    })
  },
  go_page:function(e){
    var that = this;
    var item = e.currentTarget.dataset.item;
    if (item.self == 0){
      wx.navigateTo({
        url: '../readingMeeting/readingMeeting?id=' + item.id,
      })
    }else{
      wx.navigateTo({
        url: '../readyClubInfo/readyClubInfo?id=' +item.id,
      })
    }
  },
  btn_cancel_model:function(){
    this.setData({
      isClubPerson: true,
      isClubAddress: true,
      isCreateClub: true,
      isNotClubPerson: true,
    })
  },
  btn_delete_club:function(){
    // var that = this;
    // var parameterStrng = {
    //   openid: app.globalData.openId
    // }
    // app.requestPost(that, app.globalData.urlApi.delBookClub, function (res) {
    //   if (res.data.code == 1) {
    //     wx.showToast({
    //       title: '退出成功',
    //       duration: 2000
    //     })
    //     that.getClubAuthorize();
    //     that.getVolunteerDataClear();
    //   }
    // })

    var that = this;
    var parameterStrng = {
      openid: app.globalData.openId
    }
    app.requestPost(that, app.globalData.urlApi.delBookClub, parameterStrng, function (res) {
      if (res.data.code == 1) {
        wx.showToast({
          title: '退出成功',
          duration: 2000
        })
        that.getClubAuthorize();
        that.getVolunteerDataClear();
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  }
})