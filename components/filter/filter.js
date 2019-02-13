Component({
  properties: {
    theme: Object, // 主题配色
    aniShow: Boolean, // 显示动画
    domShow: { // 显示节点
      type: Boolean,
      observer(type) {
        if (type)
          console.log('组件节点渲染完成')
      }
    },
    value: { // 页面列表数据
      type: Array,
      value: [],
      name: ''
    }
  },
  data: {
    panelNum: 6, // 每个类别默认显示的词条个数
    priceMin: 0, // 最低价默认值
    priceMax: 0, // 最高价默认值
  },
  ready() { // 设置初始页面渲染数据
    const value = this.data.value.map(n => {
      n.tagText = 0 // 0.收起 1.更多
      n.childrenCopy = n.children // 拷贝children对象
      if (n.children.length > this.data.panelNum) {
        n.ShowPanelMoreTag = true // 是否显示'更多'
        n.children = n.children.slice(0, this.data.panelNum)
      }
      return n
    })
    this.setData({ value })
  },
  methods: {
    _prevent(e) {
      return false
    },
    init () {
      // console.log('调用初始化')
      const value = this.data.value.map(n => {
        n.tagText = 0 // 0.收起 1.更多
        n.childrenCopy = n.children // 拷贝children对象
        if (n.children.length > this.data.panelNum) {
          n.ShowPanelMoreTag = true // 是否显示'更多'
          n.children = n.children.slice(0, this.data.panelNum)
        }
        return n
      })
      this.setData({ value })
    },
    /**
     * 页面关闭
     */
    _closeFilter() {
      this.setData({
        'aniShow': false
      })
      setTimeout(() => {
        this.setData({
          'domShow': false
        })
        wx.showTabBar()
      }, 300)
    },
    /**
     * radioChange
     */
    _onRadioChange(e) {
      const { value } = e.detail, // radio的value
        { index, item } = e.currentTarget.dataset // group的index与item
      const children = item.children.map(n => Object.assign({}, n, { // 设定type==radio的选中状态
        'checked': n.value == value || n.label == value || n.name == value
      }))
      const childrenCopy = item.childrenCopy.map(n => Object.assign({}, n, { // 设定拷贝数据的选中状态
        'checked': n.value == value || n.label == value || n.name == value
      }))
      const selected = children.filter(n => n.checked).map(n => n.label).join(',')
      if (item.type === 'price') { // 将选中价格radio写入input
        const selectPrice = children.filter(n => n.checked)[0].label
        let priceMin, priceMax
        if (selectPrice.includes('-')) {
          priceMin = selectPrice.split('-')[0]
          priceMax = selectPrice.split('-')[selectPrice.split('-').length - 1]
        } else {
          priceMin = selectPrice.replace(/[^0-9]/ig, "")
          priceMax = '∞'
        }
        this.setData({
          'priceMin': Number(priceMin),
          'priceMax': Number(priceMax)
        })
      }
      this.setData({
        [`value.[${index}].children`]: children,
        [`value.[${index}].childrenCopy`]: childrenCopy,
        [`value.[${index}].selected`]: selected
      })
    },
    /**
     * radioTap // 用于单选取消，radio默认没有取消
     */
    _onRadioTap(e) {
      const { item, index, itemw, indexw } = e.currentTarget.dataset
      if (itemw.checked) {
        this.setData({
          [`value.[${index}].children.[${indexw}].checked`]: !itemw.checked,
          [`value.[${index}].childrenCopy.[${indexw}].checked`]: !itemw.checked,
          [`value.[${index}].selected`]: ''
        })
      }
      // console.log(this.data.value)
    },
    /**
     * checkboxChange
     */
    _onCheckboxChange(e) {
      const { value } = e.detail,
        { index, item } = e.currentTarget.dataset
      const children = item.children.map(n => Object.assign({}, n, {
        'checked': value.includes(n.value) || value.includes(n.label)
      }))
      const childrenCopy = item.childrenCopy.map(n => Object.assign({}, n, { // checkbox.children
        'checked': value.includes(n.value) || value.includes(n.label)
      }))
      const selected = children.filter(n => n.checked).map(n => n.label).join(' , ')
      this.setData({
        [`value.[${index}].children`]: children,
        [`value.[${index}].childrenCopy`]: childrenCopy,
        [`value.[${index}].selected`]: selected
      })
    },
    /**
     * 价格输入 失去焦点
     */
    priceBlur(e) {
      const { id } = e.target,
        { value } = e.detail
      if (id == 1)
        this.setData({
          'priceMin': Number(value)
        })
      else
        this.setData({
          'priceMax': Number(value)
        })
      if (this.data.priceMax < this.data.priceMin && this.data.priceMax > 0) { // 如果最大价格小于最小价格且都填写，则调换数据
        const priceMax = [this.data.priceMin, this.data.priceMax][0]
        const priceMin = [this.data.priceMin, this.data.priceMax][1]
        this.setData({
          'priceMin': Number(priceMin),
          'priceMax': Number(priceMax)
        })
      }
      // console.log(this.data.priceMin, this.data.priceMax)
    },
    /**
     * 价格输入 键入
     */
    priceInput(e) {
      const { index } = e.currentTarget.dataset
      const children = this.data.value[index].children.map(n => Object.assign({}, n, { // price.children
        'checked': false
      }))
      const childrenCopy = this.data.value[index].childrenCopy.map(n => Object.assign({}, n, {
        'checked': false
      }))
      this.setData({
        [`value.[${index}].children`]: children,
        [`value.[${index}].childrenCopy`]: childrenCopy
      })
    },
    /**
     * 初始化价格
     */
    _initPrice() {
      this.setData({
        'priceMin': 0,
        'priceMax': 0
      })
    },
    /**
     * 更多
     */
    _panelMore(e) {
      const { index } = e.currentTarget.dataset // panel index
      const value = this.data.value.map((n, idx) => {
        if (idx === index) {
          this.data.value[idx].tagText = !this.data.value[idx].tagText
          if (this.data.value[idx].tagText){
            // console.log(n.childrenCopy)
            n.children = n.childrenCopy
          } else {
            n.children = n.children.slice(0, this.data.panelNum)
          }
        }
        return n
      })
      this.setData({ value })
    },
    /**
     * 重置
     */
    _resetBtnTap(e) {
      const value = this.data.value.map(n => {
        return Object.assign({}, n, {
          'children': n.children.map(n => Object.assign({}, n, {
            'checked': false,
          })),
          'selected': ''
        })
      })
      const filterKeyword = [], filterPrice = []
      this.setData({ value, filterKeyword, filterPrice }, this._initPrice)
      this.triggerEvent('confirm', this.data)
      // console.log('重置', this.data)
    },
    /**
     * 确定
     */
    _confirmBtnTap() {
      let filterKeyword = [], filterPrice = [] // 所选的筛选条件
      let that = this
      this.data.value.filter(n => n.type != 'price').map((n,index) => n.children).map((n,index) => {
        var name = that.data.value[index].name
        n.filter(n => n.checked).map(n => {
          let a = n.value ? { value: n.value, label: n.label, name: name} : n.label
          filterKeyword.push(a)
        })
      })
      filterPrice = filterPrice.concat([this.data.priceMin, this.data.priceMax ? this.data.priceMax : '∞']) // 如果提交时只填写了最小价格，则最大价格为∞
      console.log(filterKeyword, '222222')
      this.setData({ filterKeyword, filterPrice })
      this.triggerEvent('confirm', this.data)
      this._closeFilter()
      this.triggerEvent('toPage')
      // console.log('确定', this.data)
    },
    /**
     * 监听页面变化
     */
    _watcher() {

    }
  }
})