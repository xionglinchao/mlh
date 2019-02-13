// pages/libraryClass/bookLibraryInformation/bookLibraryInformation.js
var app = getApp();
var WxParse = require('../../../wxParse/wxParse.js');
let nowTime = require('../../../utils/nowTime.js');
var audioCtx;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    sw: 0,
    sliderOffset: 0,
    lineWidth: 0,
    isNewWork: true,
    libraryInformationPro: {},
    id: 0,
    bookIndex: 1,
    otherImageHeight: 0,
    isCreateComment: false,
    isCreateModel: true,
    animtionData: null,
    sliderCommentOffset: 0,
    commentBookPro: [],
    commentReadBookPro: [],
    bookCommentIndex: 1,
    isOhter: true,
    isLoad: true,
    isCollect: false,
    collectId: 0,
    notContentPro: {
      windowHeight2: '200px',
      isContent: true,
      image2: '../../../images/n.png'
    },
    toView: 'to_Titile'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      isLoad: false,
      id: options.id,

    })
    audioCtx = wx.createInnerAudioContext()

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sw: res.windowWidth,
          lineWidth: res.windowWidth * 0.2,
          otherImageHeight: (res.windowWidth - 8) * 0.33 - 6 //相关推荐图片高度
        })
      },
    })
  },
  onShow: function () {

    var that = this;
    var id = that.data.id;

    if (app.globalData.openId) {
      that.get_book_data(id);
      that.get_book_comment(id);
    } else {
      app.openIdReadyCallback = res => {
        app.globalData.openId = res;
        that.get_book_data(id);
        that.get_book_comment(id);
      }
    }
    if (that.data.isLoad) {

      that.setData({
        isCreateModel: true,
        isOhter: true,
        isCreateComment: false
      })
    }

  },
  onHide: function () {
    audioCtx.stop();
  },
  onUnload: function () {
    audioCtx.stop();
  },
  onShareAppMessage: function () {
    var that = this;
    var id = that.data.id;
    var libraryInformationPro = that.data.libraryInformationPro;

    return {
      title: libraryInformationPro.name,
      path: '/pages/libraryClass/bookLibraryInformation/bookLibraryInformation?id=' + id,
    }
  },
  btn_book_class: function (e) {

    if (!app.globalData.isNetwork) {
      wx.showModal({
        title: '提示',
        content: '当前网络状态不佳，请检查您的网络',
        showCancel: false,
        confirmText: '我知道了',
        success: function (res) {

        }
      })
      return;
    }

    var that = this;
    var sliderOffset = that.data.sliderOffset;
    var lineWidth = that.data.lineWidth;
    var libraryInformationPro = that.data.libraryInformationPro;
    var index = e.currentTarget.dataset.index;


    if (index != 3) {//数组前三项加载html界面
      var article = '';

      if (index == 0) {
        article = libraryInformationPro.text_story;
      } else if (index == 1) {
        article = libraryInformationPro.appreciation;
      } else if (index == 2) {
        article = libraryInformationPro.author;
      }

      WxParse.wxParse('article', 'html', article, that, 5);
    }

    that.setData({
      sliderOffset: index * lineWidth,
      bookIndex: index + 1
    })


  },
  get_book_data: function (id) {
    var that = this;

    wx.showLoading({
      title: '加载中',
    })
    var requestData = { id: id, openid: app.globalData.openId };
    app.requestPost(that, app.globalData.urlApi.getLibraryInformation, requestData, function (res) {

      if (res.data.code == 1) {

        wx.setNavigationBarTitle({
          title: res.data.data.name,
        })

        that.setData({
          libraryInformationPro: res.data.data,
          isNewWork: true,
          isLoad: true,
        })

        var article = res.data.data.text_story;
        WxParse.wxParse('article', 'html', article, that, 5);
      }

      wx.hideLoading();
    })
  },
  btn_refurbish: function () {
    var that = this;
    var id = that.data.id;
    that.get_book_data(id);
  },
  btn_create_comment: function () {
    var that = this;

    var isCreateComment = that.data.isCreateComment;
    var isCreateModel = that.data.isCreateModel;

    if (isCreateComment) {
      isCreateModel = false;
    } else {
      isCreateComment = true;
    }

    that.setData({
      isCreateComment: isCreateComment,
      isCreateModel: isCreateModel
    })
  },
  btn_create_comment_hide: function () {
    this.setData({
      isCreateComment: false,
    })
  },
  btn_create_model: function () {
    this.setData({
      isCreateModel: true,
      isOhter: true
    })
  },
  get_book_comment: function (id) {
    var that = this;
    var requestData = { id: id, openid: app.globalData.openId };
    app.requestPost(that, app.globalData.urlApi.getLibraryInformationComment, requestData, function (res) {

      if (res.data.code == 1) {
        var commentBookPro = [];
        var index = that.data.bookCommentIndex - 1;
        var item = res.data.data;
        var notContentPro = that.data.notContentPro;

        if (item[index].content) {
          if (item[index].sort == 2) {
            for (var i = 0; i < item[index].content.length; i++) {

              for (var j = 0; j < item[index].content[i].length; j++) {
                item[index].content[i][j]['sort'] = item[index].sort;
                item[index].content[i][j]['times'] = nowTime.timeNum(item[index].content[i][j].time);
                item[index].content[i][j]['isPlay'] = 0;
                commentBookPro.push(item[index].content[i][j]);
              }
            }
          } else {
            for (var i = 0; i < item[index].content.length; i++) {

              item[index].content[i]['sort'] = item[index].sort;
              item[index].content[i]['times'] = nowTime.timeNum(item[index].content[i].time);
              item[index].content[i]['isPlay'] = 0;
              commentBookPro.push(item[index].content[i]);
            }
          }
        }

        if (commentBookPro.length == 0) {
          notContentPro.isContent = false;
        } else {
          notContentPro.isContent = true;
        }

        that.setData({
          commentBookPro: commentBookPro,
          commentReadBookPro: item,
          notContentPro: notContentPro,
          isNewWork: true
        })

      } else {


        notContentPro.isContent = false;

        that.setData({
          notContentPro: notContentPro
        })
      }
    })
  },
  btn_book_comment_class: function (e) {
    var that = this;
    var sliderCommentOffset = that.data.sliderCommentOffset;
    var lineWidth = that.data.lineWidth;
    var index = e.currentTarget.dataset.index;
    var commentBookPro = [];
    var commentReadBookPro = that.data.commentReadBookPro;
    var notContentPro = that.data.notContentPro;

    if (commentReadBookPro[index].content) {
      if (commentReadBookPro[index].sort == 2) {
        for (var i = 0; i < commentReadBookPro[index].content.length; i++) {

          for (var j = 0; j < commentReadBookPro[index].content[i].length; j++) {
            commentReadBookPro[index].content[i][j]['sort'] = commentReadBookPro[index].sort;
            commentReadBookPro[index].content[i][j]['times'] = nowTime.timeNum(commentReadBookPro[index].content[i][j].time);
            commentReadBookPro[index].content[i][j]['isPlay'] = 0;
            commentBookPro.push(commentReadBookPro[index].content[i][j]);
          }
        }
      } else {
        for (var i = 0; i < commentReadBookPro[index].content.length; i++) {


          commentReadBookPro[index].content[i]['sort'] = commentReadBookPro[index].sort;
          commentReadBookPro[index].content[i]['times'] = nowTime.timeNum(commentReadBookPro[index].content[i].time);
          commentReadBookPro[index].content[i]['isPlay'] = 0;
          commentBookPro.push(commentReadBookPro[index].content[i]);
        }
      }
    }

    if (commentBookPro.length == 0) {
      notContentPro.isContent = false;
    } else {
      notContentPro.isContent = true;
    }

    that.setData({
      sliderCommentOffset: index * lineWidth,
      bookCommentIndex: index + 1,
      commentBookPro: commentBookPro,
      notContentPro: notContentPro
    })
  },
  btn_create_writing: function (e) {//点击创作评论

    var that = this;
    var info = e.currentTarget.dataset.info;
    var id = that.data.id;
    var libraryInformationPro = that.data.libraryInformationPro;

    var parameterStrng = '?typeNum=1&id=' + id + '&classId=' + info + '&name=' + libraryInformationPro.name;
    if (info == 1) {
      app.navigateWx(that, '../../posting/soundRecord/soundRecord', parameterStrng);
    } else {
      app.navigateWx(that, '../../posting/videoImageComment/videoImageComment', parameterStrng);
    }
  },
  btn_go_bottom: function (e) {
    var that = this;
    var isCollect = that.data.isCollect;
    var item = e.currentTarget.dataset.item;

    if (item.collection == '0') {
      isCollect = false
    } else {
      isCollect = true
    }

    that.setData({
      isOhter: false,
      isCollect: isCollect,
      collectId: item.id
    })
  },
  btn_go_likes: function (e) {

    var that = this;
    var item = e.currentTarget.dataset.item;
    var likes = 0;

    if (item.whether_like == 1) {
      likes = -1;
    } else {
      likes = 1
    }
    var requestData = {
      id: item.id,
      openid: app.globalData.openId,
      type: likes
    }
    app.requestPost(that, app.globalData.urlApi.goCreationLikes, requestData, function (res) {

      if (res.data.code == 1) {

        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
        that.get_book_comment(that.data.id);
      }
    })
  },
  btn_go_comment: function (e) {

    var that = this;
    var item = e.currentTarget.dataset.item;
    var parameterStrng = '?id=' + item.id;

    app.navigateWx(that, '../../posting/createComment/createComment', parameterStrng);
  },
  btn_video: function (e) {


    var that = this;
    var videoName = e.currentTarget.dataset.video;

    var parameterStrng = '?videoPlay=' + videoName;

    app.navigateWx(that, '../../videoPlay/videoPlay', parameterStrng);

  },
  btn_preview: function (e) {

    if (!app.globalData.isNetwork) {
      wx.showModal({
        title: '提示',
        content: '当前网络状态不佳，请检查您的网络',
        showCancel: false,
        confirmText: '我知道了',
        success: function (res) {

        }
      })
      return;
    }

    var that = this;

    var item = e.currentTarget.dataset.item;
    var image = e.currentTarget.dataset.image;
    for (var i = 0; i < item.length; i++) {
      item[i] = app.globalData.urlApi.ossImageUrl + item[i]
    }


    wx.previewImage({
      current: image,
      urls: item,
    })
  },
  btn_play_sound: function (e) {//播放语音

    if (!app.globalData.isNetwork) {
      wx.showModal({
        title: '提示',
        content: '当前网络状态不佳，请检查您的网络',
        showCancel: false,
        confirmText: '我知道了',
        success: function (res) {

        }
      })
      return;
    }
    var that = this;
    var info = e.currentTarget.dataset.info;
    var index = e.currentTarget.dataset.index;
    var commentBookPro = that.data.commentBookPro;

    for (var i = 0; i < commentBookPro.length; i++) {

      if (i != index) {
        commentBookPro[i]['isPlay'] = 0;
      }
    }



    if (commentBookPro[index]['isPlay'] == 0) {

      commentBookPro[index]['isPlay'] = 1;
      audioCtx.autoplay = true
      audioCtx.src = app.globalData.urlApi.ossImageUrl + info;
      audioCtx.play();

    } else {
      commentBookPro[index]['isPlay'] = 0;

      audioCtx.pause();
    }
    that.setData({
      commentBookPro: commentBookPro
    })

    audioCtx.onEnded((res) => {

      var commentBookPro1 = that.data.commentBookPro;
      for (var i = 0; i < commentBookPro1.length; i++) {
        commentBookPro1[i]['isPlay'] = 0;
      }

      that.setData({
        commentBookPro: commentBookPro1
      })
    })
  },
  bind_collect: function () {

    var that = this;
    var collectId = that.data.collectId;
    var isCollect = that.data.isCollect;

    if (!isCollect) {

      var requestData = {
        openid: app.globalData.openId,
        type: 4,
        id: collectId
      }

      app.requestPost(that, app.globalData.urlApi.addFavorites, requestData, function (res) {

        if (res.data.code == 1) {

          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })

          that.setData({
            isOhter: true
          })

          that.get_book_comment(that.data.id);
        }
      })
    } else {
      wx.showToast({
        title: '已收藏',
        icon: 'none',
        duration: 2000
      })

      that.setData({
        isOhter: true
      })
    }
  },
  bind_complain: function () {

    var that = this;
    var collectId = that.data.collectId;
    var requestData = {
      id: collectId,
      openid: app.globalData.openId
    }

    app.requestPost(that, app.globalData.urlApi.createCpmplaidts, requestData, function (res) {


      wx.showToast({
        title: res.data.msg,
        icon: 'none',
        duration: 2000
      })
      that.setData({
        isOhter: true
      })
    })
  },

  btn_go_comment_information: function (e) {//进入评论详情页

    var that = this;

    var item = e.currentTarget.dataset.item;

    var parameterStrng = '?typeNum=1&id=' + item.id;

    app.navigateWx(that, '../../posting/commentInformation/commentInformation', parameterStrng);

  },
  btn_book_comment_likes: function () {//点赞书籍或取消点赞


    var that = this;
    var item = that.data.libraryInformationPro;
    var likes = 0;

    if (item.whether_like == 1) {
      likes = -1;
    } else {
      likes = 1
    }
    var requestData = {
      id: item.id,
      openid: app.globalData.openId,
      type: likes
    }
    app.requestPost(that, app.globalData.urlApi.getLibraryLikes, requestData, function (res) {

      if (res.data.code == 1) {

        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
        that.get_book_data(that.data.id);
      }
    })
  },
  btn_go_book_mall: function (e) {
    console.log(e);
    var that = this;

    var item = e.currentTarget.dataset.item;

    var parameterStrng = '?typeNum=1&id=' + item.id
    var parameterStrng = '?id=' + item.id + '&name=' + item.name + '&libId=' + this.data.id
    app.navigateWx(that, '../../goods/goods', parameterStrng);
  },
  btn_go_comment_: function () {

    this.setData({
      toView: 'to_tab'
    })
  }
})