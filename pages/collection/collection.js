// pages/collection/collection.js
var app = getApp();
var audioCtx;
let nowTime = require('../../utils/nowTime.js');
var moveXList = [0, 0] //X轴移动的距离
Page({
  data: {
    collectionPro: [],
    isShadow: true,
    hidden: true,
    id: '',
    toastData: '',
    isShowToast: true,
    startX: 0, //开始坐标
    startY: 0,
    isViewDisabled: true,
    createCommentPro: [],
    sliderOffset: 0,
    lineWidth: 0,
    sw: 0,
    bookIndex: 0
  },
  onLoad: function(options) {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          sw: res.windowWidth,
          lineWidth: res.windowWidth * 0.33,
        })
      },
    })
    audioCtx = wx.createInnerAudioContext();
  },
  onShow: function() {
    var that = this;
    var index = that.data.bookIndex;
    if (index == 0) {
      that.getCollectionData(1);
    } else if (index == 1) {
      that.getCollectionData(0);
    } else {
      that.getCollectionData(4);
    }
    that.setData({
      isViewDisabled: true
    })
  },
  btn_infomartion: function(e) {
    var that = this;
    var item = e.currentTarget.dataset.info
    var parameterStrng = '?id=' + item.clt_id;
    if (item.type == 0) {
      app.navigateWx(that, '../goods/goods', parameterStrng);
    } else if (item.type == 1) {
      app.navigateWx(that, '../activityInformation/activityInformation', parameterStrng);
    } else if (item.type == 2) {}
  },
  btn_long_delete: function(e) {
    var that = this;
    var id = e.currentTarget.dataset.info.id;
    wx.showModal({
      title: '提示',
      content: '是否删除此条收藏',
      success: function(res) {
        console.log(res);
        if (res.confirm) {
          that.deleteCollection(id);
        }
      }
    })
  },
  onHide: function() {
    audioCtx.stop();
  },
  deleteCollection: function(id) {
    var that = this;
    var index = that.data.bookIndex;
    var typeNum = 0;
    if (index == 0) {
      typeNum = 1;
    } else if (index == 1) {
      typeNum = 0;
    } else {
      typeNum = 4;
    }
    var requestData = {
      id: id,
      type: typeNum,
      openid: app.globalData.openId
    }
    app.requestPost(that, app.globalData.urlApi.deleteCollection, requestData, function(res) {
      if (res.data.code == 1) {
        wx.showToast({
          title: '删除收藏成功',
          duration: 2000
        })
        wx.hideLoading();
        if (index == 0) {
          that.getCollectionData(1);
        } else if (index == 1) {
          that.getCollectionData(0);
        } else {
          that.getCollectionData(4);
        }
      }
    })
  },
  touchstart: function(e) {
    this.data.collectionPro.forEach(function(v, i) {
      if (v.isTouchMove)
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      collectionPro: this.data.collectionPro
    })
  },
  touchmove: function(e) {
    var that = this,
      index = e.currentTarget.dataset.index,
      startX = that.data.startX,
      startY = that.data.startY,
      touchMoveX = e.changedTouches[0].clientX,
      touchMoveY = e.changedTouches[0].clientY,
      angle = that.angle({
        X: startX,
        Y: startY
      }, {
        X: touchMoveX,
        Y: touchMoveY
      });
    that.data.collectionPro.forEach(function(v, i) {
      v.isTouchMove = false
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX)
          v.isTouchMove = false
        else
          v.isTouchMove = true
      }
    })
    that.setData({
      collectionPro: that.data.collectionPro
    })
  },
  angle: function(start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  btn_collection_title: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var sliderOffset = that.data.sliderOffset;
    var lineWidth = that.data.lineWidth;
    if (index == 0) {
      that.getCollectionData(1);
    } else if (index == 1) {
      that.getCollectionData(0);
    } else {
      that.getCollectionData(4);
    }
    that.setData({
      sliderOffset: index * lineWidth,
      bookIndex: index
    })
  },
  getCollectionData: function(typeNum) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    var requestData = {
      openid: app.globalData.openId,
      type: typeNum
    }
    app.requestPost(that, app.globalData.urlApi.getCollection, requestData, function(res) {
      if (res.data.code == 1) {
        var item = res.data.data;
        for (var i = 0; i < item.length; i++) {
          item[i].isTouchMove = false;
          item[i]['times'] = nowTime.timeNum(item[i].time); //将时间转换为当前时间间隔多少
          item[i]['isPlay'] = 0;
        }
        that.setData({
          collectionPro: item
        })
      } else {
        that.setData({
          collectionPro: null
        })
      }
      wx.hideLoading();
    })
  },
  btn_go_comment_information: function(e) { //进入评论详情页
    var that = this;
    var item = e.currentTarget.dataset.item;
    var parameterStrng = '?id=' + item.id;
    app.navigateWx(that, '../posting/commentInformation/commentInformation', parameterStrng);
  },
  btn_person_information: function(e) {
    var that = this;
    var item = e.currentTarget.dataset.item;
    var parameterStrng = '?id=' + item.user.id;
    app.navigateWx(that, '../personalInformation/personalInformation', parameterStrng);
  },
  btn_add_shop: function(e) {
    var that = this;
    var item = e.currentTarget.dataset.item;
    var goodsPro = app.globalData.goodsPro;
    var goodsNum = app.globalData.goodsNum;
    var dataObj = {}
    goodsNum++;
    dataObj['name'] = item.name;
    dataObj['id'] = item.id;
    dataObj['litpic'] = item.litpic;
    dataObj['money'] = item.money;
    dataObj['moneys'] = item.moneys;
    dataObj['integral'] = item.integral;
    dataObj['num'] = 1;
    dataObj['isSelect'] = false;
    for (var i = 0; i < goodsPro.length; i++) {
      if (goodsPro[i].id == item.id) {
        goodsPro[i].num += 1;
      }
    }
    if (goodsPro['id' + item.id]) {
      goodsPro['id' + item.id]['num'] += 1;
    } else {
      goodsPro['id' + item.id] = dataObj;
    }
    app.globalData.goodsPro = JSON.parse(JSON.stringify(goodsPro));
    app.globalData.goodsNum = goodsNum;
    wx.showToast({
      title: '加入购物车成功',
      duration: 2000
    })
  },
  btn_goods: function(e) {
    var that = this;
    var parameterStrng = '?id=' + e.currentTarget.dataset.item.id + '&name=' + e.currentTarget.dataset.item.name;
    app.navigateWx(that, '../goods/goods', parameterStrng);
  },
  btn_play_sound: function(e) { //播放语音
    var that = this;
    var info = e.currentTarget.dataset.info;
    var index = e.currentTarget.dataset.index;
    var commentBookPro = that.data.collectionPro;
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
      collectionPro: commentBookPro
    })
    audioCtx.onEnded((res) => {
      var commentBookPro1 = that.data.collectionPro;
      for (var i = 0; i < commentBookPro1.length; i++) {
        commentBookPro1[i]['isPlay'] = 0;
      }
      that.setData({
        collectionPro: commentBookPro1
      })
    })
  },
})