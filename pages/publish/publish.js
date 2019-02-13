const app = getApp()
Page({
  data: {
    typeName: 0,
    pics: [],
    isShowToast: true,
    toastData: '',
    nameItem: {},
    isDisabled: false,
    dataTime: '',
    isLoading: true,
    name: '',
    address: '',
    person: '',
    information: '',
    endTime: '',
    jTime: '',
    revise: 0,
    dataItem: null,
    picsImagePro: [],
    createBookId: 0,
    createBookName: null
  },
  onLoad: function(options) {
    console.log(options)
    let that = this
    if (options.revise) {
      let revise = options.revise,
        dataItem = JSON.parse(options.item),
        pic = []
      console.log(dataItem.photo)
      for (let i = 0; i < dataItem.photo.length; i++) {
        pic.push(app.globalData.urlApi.ossImageUrl + dataItem.photo[i]);
      }
      if (options.info == 1) {
        that.setData({
          typeName: options.info,
          revise: revise,
          dataItem: dataItem,
          pics: pic,
          name: dataItem.name,
          information: dataItem.comment,
          address: dataItem.address,
          person: dataItem.number_people,
          dataTime: dataItem.date,
          endTime: dataItem.time,
          jTime: dataItem.registration_deadline,
          picsImagePro: dataItem.photo
        })
      } else {
        that.setData({
          typeName: options.info,
          revise: revise,
          dataItem: dataItem,
          pics: pic,
          name: dataItem.name,
          information: dataItem.comment,
          picsImagePro: dataItem.photo
        })
      }
    } else {
      that.setData({
        typeName: options.info,
      })
    }
  },
  onShow: function() {
    let that = this
    if (app.globalData.createBookId != 0) {
      if (app.globalData.createBookId != that.data.createBookId) {
        that.setData({
          createBookId: app.globalData.createBookId,
          createBookName: app.globalData.createBookName
        })
      }
    }
  },
  uploadimg1: function(data) {
    let that = this,
      i = data.i ? data.i : 0,
      success = data.success ? data.success : 0,
      fail = data.fail ? data.fail : 0
    let namePics = data.namePics ? data.namePics : []
    // console.log(data.path[i])
    if (data.path[i].indexOf('meilihua') == -1) {
      wx.uploadFile({
        url: data.url,
        filePath: data.path[i],
        name: 'file', // 这里根据自己的实际情况改
        success: (resp) => {
          let dataName = JSON.parse(JSON.stringify(that.trimKong(resp.data)));
          if (dataName.code == 1) {
            success++
            namePics.push(dataName.data)
            i++
            if (i == data.path.length) { // 当图片传完时，停止调用
              let typeName = that.data.typeName
              let revise = that.data.revise
              if (typeName == 1) {
                if (revise == 0) {
                  that.publishActivity(namePics)
                } else {
                  that.reviseActivity(namePics)
                }
              } else {
                if (revise == 0) {
                  that.publishArticle(namePics)
                } else {
                  that.reviseArticle(namePics)
                }
              }
            } else { //若图片还没有传完，则继续调用函数
              data.i = i
              data.success = success
              data.fail = fail
              data.namePics = namePics
              that.uploadimg1(data)
            }
          } else {
            that.setData({
              isShowToast: false,
              toastData: '图片上传失败',
              isLoading: true,
              isDisabled: false
            })
            setTimeout(function() {
              that.setData({
                isShowToast: true,
              })
            }, 2000)
          }
          //这里可能有BUG，失败也会执行这里,所以这里应该是后台返回过来的状态码为成功时，这里的success才+1
        },
        fail: (res) => {
          fail++
        }
      })
    } else {
      i++
      if (i == data.path.length) {
        let typeName = that.data.typeName
        let revise = that.data.revise
        if (typeName == 1) {
          if (revise == 0) {
            that.publishActivity(namePics)
          } else {
            that.reviseActivity(namePics)
          }
        } else {
          if (revise == 0) {
            that.publishArticle(namePics)
          } else {
            that.reviseArticle(namePics)
          }

        }
      } else {
        console.log(i)
        data.i = i
        data.success = success
        data.fail = fail
        data.namePics = namePics
        that.uploadimg1(data)
      }
    }
  },
  uploadimg: function() { //这里触发图片上传的方法
    let pics = this.data.pics
    this.uploadimg1({
      url: app.globalData.urlApi.upLoadImage, //这里是你图片上传的接口
      path: pics //这里是选取的图片的地址数组
    })
  },
  btn_image: function() { //这里是选取图片的方法
    let that = this,
      pics = this.data.pics
    if (pics.length < 9) {
      wx.chooseImage({
        count: 9 - pics.length,
        success: function(res) {
          console.log(res)
          let imgsrc = res.tempFilePaths
          pics = pics.concat(imgsrc)
          that.setData({
            pics: pics
          })
          // that.uploadimg(pics)
        },
        fail: function() {
          // fail
        },
        complete: function() {
          // complete
        }
      })
    } else {
      that.setData({
        isShowToast: false,
        toastData: '只能上传9张图',
        isDisabled: false
      })
      setTimeout(function() {
        that.setData({
          isShowToast: true,
        })
      }, 2000)
    }
  },
  trimKong: function(s) {
    return JSON.parse(trim(s))
    function trim(str) {
      str = str.replace(/^(\s|\u00A0)+/, '')
      for (let i = str.length - 1; i >= 0; i--) {
        if (/\S/.test(str.charAt(i))) {
          str = str.substring(0, i + 1)
          break
        }
      }
      return str
    }
  },
  // 确认发起
  btn_submit: function(e) {
    let that = this,
      item = e.detail.value,
      pics = that.data.pics,
      typeName = that.data.typeName
    that.setData({
      isDisabled: true,
    })
    if (typeName == 1) {
      that.typeDataUpload(item, pics)
    } else {
      that.typeDataUpload1(item, pics)
    }
  },
  btn_delete: function(e) {
    let that = this,
      index = e.target.dataset.index,
      pics = that.data.pics,
      picsImagePro = that.data.picsImagePro
    for (let i = 0; i < pics.length; i++) {
      if (i == index) {
        if (pics[i].indexOf('meilihua') > -1 || pics[i].indexOf("") > -1) {
          picsImagePro.splice(i, 1)
        }
        pics.splice(i, 1)
        break
      }
    }
    that.setData({
      pics: pics,
      picsImagePro: picsImagePro
    })
  },
  typeDataUpload: function(item, pics) {
    let that = this,
      dataTime = that.data.dataTime,
      endTime = that.data.endTime,
      jTime = that.data.jTime
    if (item.name == '') {
      that.setData({
        isShowToast: false,
        toastData: '请输入活动名称',
        isDisabled: false
      })
      setTimeout(function() {
        that.setData({
          isShowToast: true,
        })
      }, 2000)
    } else if (dataTime == '') {
      that.setData({
        isShowToast: false,
        toastData: '请输入活动开始时间',
        isDisabled: false
      })
      setTimeout(function() {
        that.setData({
          isShowToast: true,
        })
      }, 2000)
    } else if (endTime == '') {
      that.setData({
        isShowToast: false,
        toastData: '请输入活动结束时间',
        isDisabled: false
      })
      setTimeout(function() {
        that.setData({
          isShowToast: true,
        })
      }, 2000)
    } else if (jTime == '') {
      that.setData({
        isShowToast: false,
        toastData: '请输入活动报名截止时间',
        isDisabled: false
      })
      setTimeout(function() {
        that.setData({
          isShowToast: true,
        })
      }, 2000)
    } else if (item.address == '') {
      that.setData({
        isShowToast: false,
        toastData: '请输入活动地址',
        isDisabled: false
      })
      setTimeout(function() {
        that.setData({
          isShowToast: true,
        })
      }, 2000)
    } else if (item.person == '') {
      that.setData({
        isShowToast: false,
        toastData: '请输入活动人数',
        isDisabled: false
      })
      setTimeout(function() {
        that.setData({
          isShowToast: true,
        })
      }, 2000)
    } else if (item.information == '') {
      that.setData({
        isShowToast: false,
        toastData: '请输入活动详情',
        isDisabled: false
      })
      setTimeout(function() {
        that.setData({
          isShowToast: true,
        })
      }, 2000)
    } else {
      that.setData({
        nameItem: item,
        isLoading: false
      })
      if (pics.length > 0) {
        that.uploadimg(pics)
      } else {
        that.publishActivity(pics)
      }
    }
  },
  typeDataUpload1: function(item, pics) {
    let that = this
    if (item.name == '') {
      that.setData({
        isShowToast: false,
        toastData: '请输入文章标题',
        isDisabled: false
      })
      setTimeout(function() {
        that.setData({
          isShowToast: true,
        })
      }, 2000)
    } else {
      that.setData({
        nameItem: item,
        isLoading: false
      })
      if (pics.length > 0) {
        that.uploadimg(pics);
      } else {
        that.publishArticle(pics);
      }
    }
  },
  // 发布活动
  publishActivity: function(namePics) {
    let that = this,
      nameItem = that.data.nameItem,
      dataTime = that.data.dataTime,
      endTime = that.data.endTime,
      jTime = that.data.jTime,
      createBookId = that.data.createBookId,
      requestData = {}
    if (namePics.length > 0) {
      requestData = {
        'openid': app.globalData.openId,
        'name': nameItem.name,
        'address': that.data.address,
        'lat': that.data.personLat,
        'lng': that.data.personLng,
        'member_people': nameItem.person,
        'time': dataTime,
        'comment': nameItem.information,
        'litpic': JSON.stringify(namePics),
        'registration_deadline': jTime,
        'date': endTime,
        'library_id': createBookId
      }
    } else {
      requestData = {
        'openid': app.globalData.openId,
        'name': nameItem.name,
        'address': that.data.address,
        'lat': that.data.personLat,
        'lng': that.data.personLng,
        'member_people': nameItem.person,
        'time': dataTime,
        'comment': nameItem.information,
        'registration_deadline': jTime,
        'date': endTime,
        'library_id': createBookId
      }
    }
    wx.request({
      url: app.globalData.urlApi.publichActivity,
      data: requestData,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: function(res) {
        console.log(res)
        if (res.data.code == 1) {
          that.setData({
            isShowToast: false,
            toastData: res.data.msg,
            name: nameItem.name,
            address: nameItem.name,
            person: nameItem.person,
            information: nameItem.information
          })
          setTimeout(function() {
            that.setData({
              isShowToast: true,
              isDisabled: false,
              isLoading: true,
            })
            wx.navigateBack({
              delta: 1
            })
          }, 2000)
        } else {
          that.setData({
            isShowToast: false,
            toastData: res.data.msg,
            isDisabled: false,
            isLoading: true,
          })
          setTimeout(function() {
            that.setData({
              isShowToast: true,
            })
          }, 2000)
        }
      }
    })
  },
  // 发布文章
  publishArticle: function(namePics) {
    let that = this,
      nameItem = that.data.nameItem,
      requestData = {}
    if (namePics.length > 0) {
      requestData = {
        'openid': app.globalData.openId,
        'name': nameItem.name,
        'content': nameItem.information,
        'litpic': JSON.stringify(namePics)
      }
    } else {
      requestData = {
        'openid': app.globalData.openId,
        'name': nameItem.name,
        'content': nameItem.information,
      }
    }
    wx.request({
      url: app.globalData.urlApi.getArticle,
      data: requestData,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: function(res) {
        console.log(res)
        if (res.data.code == 1) {
          that.setData({
            isShowToast: false,
            toastData: res.data.msg,
            name: nameItem.name,
            information: nameItem.information
          })
          setTimeout(function() {
            that.setData({
              isShowToast: true,
              isDisabled: false,
              isLoading: true,
            })
            wx.navigateBack({
              delta: 1
            })
          }, 2000)
        } else {
          that.setData({
            isShowToast: false,
            toastData: res.data.msg,
            isDisabled: false,
            isLoading: true,
          })
          setTimeout(function() {
            that.setData({
              isShowToast: true,
            })
          }, 2000)
        }
      }
    })
  },
  btn_date: function(e) {
    let that = this
    that.setData({
      dataTime: e.detail.value
    })
  },
  btn_date1: function(e) {
    let that = this
    that.setData({
      endTime: e.detail.value
    })
  },
  btn_date2: function(e) {
    let that = this
    that.setData({
      jTime: e.detail.value
    })
  },
  // 修改活动
  reviseActivity: function(namePics) {
    let that = this,
      nameItem = that.data.nameItem,
      dataTime = that.data.dataTime,
      endTime = that.data.endTime,
      jTime = that.data.jTime,
      dataItem = that.data.dataItem,
      picsImagePro = that.data.picsImagePro
    namePics = namePics.concat(picsImagePro)
    console.log(namePics)
    let requestData = {}
    if (namePics.length > 0) {
      requestData = {
        'openid': app.globalData.openId,
        'name': nameItem.name,
        'address': that.data.address,
        'lat': that.data.personLat,
        'lng': that.data.personLng,
        'member_people': nameItem.person,
        'time': dataTime,
        'comment': nameItem.information,
        'litpic': JSON.stringify(namePics),
        'registration_deadline': jTime,
        'date': endTime,
        'id': dataItem.id
      }
    } else {
      requestData = {
        'openid': app.globalData.openId,
        'name': nameItem.name,
        'address': that.data.address,
        'lat': that.data.personLat,
        'lng': that.data.personLng,
        'member_people': nameItem.person,
        'time': dataTime,
        'comment': nameItem.information,
        'registration_deadline': jTime,
        'date': endTime,
        'id': dataItem.id
      }
    }
    wx.request({
      url: app.globalData.urlApi.edit_activity,
      data: requestData,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: function(res) {
        console.log(res)
        if (res.data.code == 1) {
          that.setData({
            isShowToast: false,
            toastData: res.data.msg,
            name: nameItem.name,
            address: nameItem.name,
            person: nameItem.person,
            information: nameItem.information
          })
          setTimeout(function() {
            that.setData({
              isShowToast: true,
              isDisabled: false,
              isLoading: true,
            })
            wx.navigateBack({
              delta: 1
            })
          }, 2000)
        } else {
          that.setData({
            isShowToast: false,
            toastData: res.data.msg,
            isDisabled: false,
            isLoading: true,
          })
          setTimeout(function() {
            that.setData({
              isShowToast: true,
            })
          }, 2000)
        }
      }
    })
  },
  reviseArticle: function(namePics) {
    let that = this,
      nameItem = that.data.nameItem,
      requestData = {},
      dataItem = that.data.dataItem,
      picsImagePro = that.data.picsImagePro
    namePics = namePics.concat(picsImagePro)
    console.log(namePics)
    if (namePics.length > 0) {
      requestData = {
        'openid': app.globalData.openId,
        'name': nameItem.name,
        'content': nameItem.information,
        'litpic': JSON.stringify(namePics),
        'id': dataItem.id
      }
    } else {
      requestData = {
        'openid': app.globalData.openId,
        'name': nameItem.name,
        'content': nameItem.information,
        'id': dataItem.id
      }
    }
    wx.request({
      url: app.globalData.urlApi.edit_article,
      data: requestData,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: function(res) {
        console.log(res)
        if (res.data.code == 1) {
          that.setData({
            isShowToast: false,
            toastData: res.data.msg,
            name: nameItem.name,
            information: nameItem.information
          })
          setTimeout(function() {
            that.setData({
              isShowToast: true,
              isDisabled: false,
              isLoading: true,
            })
            wx.navigateBack({
              delta: 1
            })
          }, 2000)
        } else {
          that.setData({
            isShowToast: false,
            toastData: res.data.msg,
            isDisabled: false,
            isLoading: true,
          })
          setTimeout(function() {
            that.setData({
              isShowToast: true,
            })
          }, 2000)
        }
      }
    })
  },
  btn_choose_book: function() {
    let that = this,
      parameterStrng = ''
    app.navigateWx(that, '../posting/chooseBook/chooseBook', parameterStrng)
  },
  // 选择地址
  selectAddress: function() {
    let self = this
    wx.chooseLocation({
      success: function(res) {
        self.setData({
          'address': res.name,
          'personLng': res.longitude,
          'personLat': res.latitude
        })
      },
      fail(err) {
        console.log(err)
      },
      complete(res) {}
    })
  },
})