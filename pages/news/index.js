// pages/news/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '测试文章测试文章测试文章测试文章测试文章测试文章测试文章',
    author: '测试',
    date: '2019-08-28',
    richText: '',
    htmlText: '<p><span>经济日报-中国经济网西安8月26日综合报道。据西北农林科技大学官方网站消息，经与中共陕西省委商得一致，中共教育部党组研究决定，闫祖书任中共西北农林科技大学委员会副书记。同时免去赵忠中共西北农林科技大学委员会常务副书记、常委职务。教育部研究决定，任命韦革宏为西北农林科技大学副校长（试用期一年）。</span></p><p><span>据中国经济网中管高校人物库资料显示，闫祖书、韦革宏此前担任西北农林科技大学党委常委。赵忠，1958年7月生，2015年任西北农林科技大学党委常务副书记（正厅级）。</span></p><p><span><span >闫祖书简历</span></span></p><div ><img src="http://i0.sinaimg.cn/dy/o/2009-09-29/1254240031_5ZY0oP.jpg"></div><p><span>闫祖书，男，汉族，1966年5月生，甘肃天水人，中共党员，副教授。1989年7月参加工作，西北农林科技大学动物科技学院预防兽医学硕士研究生毕业。</span></p><p><span>曾任原西北农业大学基础科学系副主任(副处级)，西北农林科技大学校友会(校友基金会)秘书长(正处级)、动物科技学院党委书记、党委宣传部部长、水土保持研究所党委书记、党委教师工作部部长等职务。</span></p><p><span>2016年7月当选为西北农林科技大学第三届党委委员、常委。2019年7月任西北农林科技大学党委副书记。</span></p><p><span><span >赵忠简历</span></span></p><div ><img src="http://i0.sinaimg.cn/dy/o/2009-09-29/1254240031_5ZY0oP.jpg"></div><p><span>赵忠，男，汉族，1958年7月生，甘肃宁县人，中共党员，教授，博士生导师。1976年3月参加工作，1988年获奥地利维也纳农业大学森林生态专业博士学位。</span></p><p><span>曾任西北林学院教务处副处长，科研处处长，教务处处长，西北农林科技大学教务处处长，校长助理，党委常委、副校长、常务副校长（正厅级）等职务。</span></p><p><span>2015年8月任西北农林科技大学党委常务副书记（正厅级）。</span></p><p><span>2019年7月不再担任西北农林科技大学党委常务副书记、常委。</span></p><p><span><span >韦革宏简历</span></span></p><div ><img src="http://i0.sinaimg.cn/dy/o/2009-09-29/1254240031_5ZY0oP.jpg"></div><p><span>韦革宏，男，汉族，1969年8月生，甘肃榆中人。1991年7月参加工作，1993年4月加入中国共产党。研究生学历，农学博士，教授，博士生导师。主要从事农业与环境微生物方面的科研工作，2011年获国家杰出青年科学基金，2012年获中组部“万人计划”科技创新领军人才，2014年获教育部长江学者特聘教授。</span></p><p><span>曾任西北农林科技大学研究生院培养与学位管理处处长、生命科学学院副院长、生命科学学院院长、科学技术发展研究院常务副院长、校长助理等职务。</span></p><p><span>2016年7月当选为西北农林科技大学第三届党委委员、常委。2019年7月任西北农林科技大学副校长。</span></p><p><span></span><span>来源：经济日报-中国经济网综合</span></p>'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var text = this.data.htmlText.replace(/<p/g, '<p style="line-height: 28px; font-size: 16px; padding-bottom: 20px; text-indent: 2em;"').replace(/<img/g, '<img style="max-width: 100%;padding-bottom: 20px;"')
    this.data.richText = text
    this.setData({ richText: text })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})