// pages/posting/videoImageComment/videoImageComment.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pics: [],
    isShadow: true,
    isBottomModel: true,
    imageVideo: null,
    isVideo: true,
    isCamera: false,
    isDisabled: false,
    information: null,
    videoUrlName: null,
    id: null,
    isShowToast: true,
    toastData: false,
    createBookId: 0,
    libraryInformationPro: {},
    imageIndex: 0,
    classId: 0,
    createBookName: null,
    typeNum: 0,
    isViewDisabled: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this;
      console.log(options);
      app.globalData.createBookId = 0;
      app.globalData.createBookName = null;

      if (options.name) {

        that.setData({
          createBookName: options.name,
          createBookId: options.id,
          classId: options.classId,
          typeNum: options.typeNum
        })

        that.get_book_data(options.id);
      } else {
        that.setData({
          classId: options.classId
        })
      }


      wx.getSystemInfo({
        success: function (res) {

          that.setData({
            otherImageHeight: (res.windowWidth - 8) * 0.33 - 6 //相关推荐图片高度
          })
        },
      })
  },
  onShow: function () {
    var that = this;

    that.setData({
      isViewDisabled: true
    })

    if (app.globalData.createBookId != 0) {

      if (app.globalData.createBookId != that.data.createBookId) {

        that.setData({
          createBookId: app.globalData.createBookId,
          createBookName: app.globalData.createBookName
        })
      }
      that.get_book_data(app.globalData.createBookId);
    }
  },
  btn_choose_book: function () {
    var that = this;

    

    if(that.data.typeNum == 0){

      that.setData({
        isViewDisabled: false
      })
      wx.navigateTo({
        url: '../chooseBook/chooseBook',
      })
    }
  },
  get_book_data: function (id) {
    var that = this;
    var requestData = { id: id, openid: app.globalData.openId};
    app.requestPost(that, app.globalData.urlApi.getLibraryInformation, requestData, function (res) {

      if (res.data.code == 1) {

        that.setData({
          libraryInformationPro: res.data.data,
        })
      }
    })
  },
  btn_other_image:function(e){
    var that = this;

    var imageIndex = that.data.imageIndex;
    var index = e.currentTarget.dataset.index;

    that.setData({
      imageIndex: index
    })

  },
  btn_submit: function (e) {
    var that = this;
    var information = e.detail.value.information;
    var pics = that.data.pics;
    var id = that.data.createBookId;

    that.setData({
      isDisabled: true,
    })
    
    if (information == '') {
      that.setData({
        isDisabled: false,
      })
      wx.showToast({
        title: '请输入评论文字',
        icon: 'none',
        duration: 2000
      })
    } else if (id == 0){
      that.setData({
        isDisabled: false,
      })
      wx.showToast({
        title: '请选择书籍',
        icon: 'none',
        duration: 2000
      })
    } else {

      that.setData({
        information: information,
      })
      wx.showLoading({
        title: '加载中',
      })
      if (pics.length > 0) {
        if (pics.length > 1) {

          that.uploadimg();

        } else {
          if (pics[0].type == 2) {

            that.setData({
              isDisabled: false,
              isLoading: true
            })
            wx.hideLoading();
            wx.showModal({
              title: '提示',
              content: '亲～，上传视频需要上传一张图片哦',
            })
          } else {
            that.uploadimg();
          }
        }

      } else {
        that.publishComment(pics);
      }
    }

  },
  publishComment: function (pics, videoImageUrl) {
    var that = this;
    var information = that.data.information;
    var dataRequest = {};
    var id = that.data.createBookId;
    var classId = that.data.classId;
    var imageIndex = that.data.imageIndex;
    var libraryInformationPro = that.data.libraryInformationPro;
    var requestData = {};

    if(classId == 2){
      requestData = {
        openid: app.globalData.openId,
        library_id: id,
        works_creation_id: classId,
        content: information,
        picture: libraryInformationPro.photo[imageIndex],
        
      }
    }else{
    
      requestData = {
        openid: app.globalData.openId,
        library_id: id,
        works_creation_id: classId,
        content: information,
        video: videoImageUrl != 0 ? videoImageUrl : '',
        litpic: pics.length > 0 ? JSON.stringify(pics) : ''
      }
      
    }
    app.requestPost(that, app.globalData.urlApi.addCreateComment, requestData, function (res) {

      if (res.data.code == 1) {

        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })

        var requestData1 = {
          openid: app.globalData.openId
        }
        app.requestPost(that, app.globalData.urlApi.getBadge, requestData1, function (res) {
          if (res.data.code == 1) {
            

            if (res.data.data.creation_badge1 == 1) {
              var parameterStrng = '?typeNum=1&badgeNum=' + res.data.data.creation_badge2;
              app.navigateWx(that, '../../badgeShow/badgeShow', parameterStrng);
            } else if (res.data.data.story_badge1 == 1) {
              var parameterStrng = '?typeNum=2&badgeNum=' + res.data.data.story_badge2;
              app.navigateWx(that, '../../badgeShow/badgeShow', parameterStrng);
            } else if (res.data.data.painting_badge1 == 1) {
              var parameterStrng = '?typeNum=3&badgeNum=' + res.data.data.painting_badge2;
              app.navigateWx(that, '../../badgeShow/badgeShow', parameterStrng);
            } else {
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1
                })

              }, 1000)
            }
          }
        })

        

        
       
      }
    })
  },
  btn_up_load_image:function () {
    var that = this,
      pics = this.data.pics;

    if (pics.length < 9) {
      wx.chooseImage({
        count: 9 - pics.length,
        success: function (res) {
          console.log(res);

          for (var i = 0; i < res.tempFiles.length; i++) {
            res.tempFiles[i]['type'] = 1;
          }
          var imgsrc = res.tempFiles;
          pics = pics.concat(imgsrc);
          that.setData({
            pics: pics,
            isShadow: true,
            isBottomModel: true

          });
        },
        fail: function () {
          // fail
        },
        complete: function () {
          // complete
        }
      })
    } else {
      wx.showToast({
        title: '只能上传9张图片',
        iconL: 'none',
        duration: 2000
      })
    }

  },
  uploadimg: function () {//这里触发图片上传的方法
    var pics = this.data.pics;
    this.uploadimg1({
      url: app.globalData.urlApi.upLoadImage,//这里是你图片上传的接口
      path: pics,//这里是选取的图片的地址数组
      videoUrl: app.globalData.urlApi.edit_video,//上传视频
    });
  },
  uploadimg1: function (data) {
    console.log(data);
    var that = this,

      i = data.i ? data.i : 0,
      success = data.success ? data.success : 0,
      fail = data.fail ? data.fail : 0;
    var namePics = data.namePics ? data.namePics : [];
    var videoUrlName = data.videoUrlName ? data.videoUrlName : null;
    console.log(data.path[i]);
    wx.uploadFile({
      url: data.path[i].type == 1 ? data.url : data.videoUrl,
      filePath: data.path[i].path,
      name: 'file',//这里根据自己的实际情况改
      success: (resp) => {
        console.log(resp)
        var dataName = JSON.parse(JSON.stringify(that.trimKong(resp.data)));

        if (dataName.code == 1) {
          success++;
          if (data.path[i].type == 1) {
            namePics.push(dataName.data);
          } else {
            videoUrlName = dataName.data;
          }

          console.log(namePics);

          i++;
          if (i == data.path.length) {   //当图片传完时，停止调用          
            if (videoUrlName) {
              that.publishComment(namePics, videoUrlName);
            } else {
              that.publishComment(namePics, 0);
            }


          } else {//若图片还没有传完，则继续调用函数

            data.i = i;
            data.success = success;
            data.fail = fail;
            data.namePics = namePics;
            if (videoUrlName) {
              data.videoUrlName = videoUrlName;
            }
            that.uploadimg1(data);
          }
        } else {
          that.setData({
            isLoading: true,
            isUpload: false,
            isDisabled: false
          })
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
  btn_image: function () {
    var that = this;

    that.setData({
      isShadow: false,
      isBottomModel: false
    })
  },
  btn_shadow: function () {
    this.setData({
      isShadow: true,
      isBottomModel: true
    })
  },
  btn_up_load_video: function () {//上传视频
    var that = this;
    var pics = that.data.pics;

    if (pics.length >= 1) {
      if (pics[0].type == 2) {

        wx.showModal({
          title: '提示',
          content: '一次只能上传一个视频，是否需要更换视频',
          success: function (res) {

            if (res.confirm) {
              that.chooseVideo(1);
            }
          }
        })
      } else {
        that.chooseVideo(0);
      }
    } else {
      that.chooseVideo(0);
    }
  },
  chooseVideo: function (typNum) {
    var that = this;
    var pics = that.data.pics;
    wx.chooseVideo({
      sourceType: ['album'],
      success: function (res) {
        var picsObj = {};
        picsObj['path'] = res.tempFilePath;
        picsObj['type'] = 2;
        if (typNum == 1) {
          pics[0].path = res.tempFilePath;
        } else {
          pics.unshift(picsObj);
        }

        that.setData({
          pics: pics,
          isShadow: true,
          isBottomModel: true
        })
      },
      fail: function () {

      }
    })
  },
  btn_up_load_cancel: function () {
    this.setData({
      isShadow: true,
      isBottomModel: true
    })
  }
})