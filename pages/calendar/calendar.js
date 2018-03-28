
let chooseYear = null;
let chooseMonth = null;
var trans = ["今天", "明天", "后天"];
const conf = {
  data: {
    hasEmptyGrid: false,
    showPicker: false,
    currentActive: 0
  },
  onLoad(query) {
    const date = new Date();
    if (!query) {
      var query = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        date: date.getDate(),
      }
    }
    const curYear = date.getFullYear();
    const curMonth = date.getMonth() + 1;
    const curDate = date.getDate();
    const weeksCh = ['日', '一', '二', '三', '四', '五', '六'];
    this.calculateEmptyGrids(query.year, query.month);
    this.calculateDays(query.year, query.month);
    this.setData({
      curYear,
      curMonth,
      curDate,
      query,
      weeksCh,
      currentActive: query.date - 1
    });
  },
  getThisMonthDays(year, month) {
    return new Date(year, month, 0).getDate();
  },
  getFirstDayOfWeek(year, month) {
    return new Date(Date.UTC(year, month - 1, 1)).getDay();
  },
  calculateEmptyGrids(year, month) {
    const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
    let empytGrids = [];
    if (firstDayOfWeek > 0) {
      for (let i = 0; i < firstDayOfWeek; i++) {
        empytGrids.push(i);
      }
      this.setData({
        hasEmptyGrid: true,
        empytGrids
      });
    } else {
      this.setData({
        hasEmptyGrid: false,
        empytGrids: []
      });
    }
  },
  DateChange: function (e) {
    var arr = e.detail.value.split("-");
    var query = {year:arr[0],month:arr[1]}
    this.calculateEmptyGrids(query.year, query.month);
    this.calculateDays(query.year, query.month);
    this.setData({
      query,
      currentActive:0
    });
  },

  //将当月日期插入到数组
  calculateDays(year, month) {
    let days = [];
    var date = new Date();
    date.setHours(0,0,0,0);
    var today = date.getDate();

    const thisMonthDays = this.getThisMonthDays(year, month);
    
    //判断是否是当月
    if(date.getFullYear()==year&&((date.getMonth()+1)==month)){
      for (let i = 1; i <= thisMonthDays; i++) {

        days.push({
          day: i,
          disable: ((parseInt(i)) - today) < 0 ? true : false,
          today: ((parseInt(i)) - today) == 0 ? true : false,
          desc: trans[(parseInt(i)) - today] || "",
          choosed: false
        });

      }
    }else{
      for (let i = 1; i <= thisMonthDays; i++) {

        days.push({
          day: i,
          disable: false ,
          today:false,
          desc:  "",
          choosed: false
        });

      }
    }

    this.setData({
      days
    });
  },
  handleCalendar(e) {
    const handle = e.currentTarget.dataset.handle;
    const curYear = this.data.curYear;
    const curMonth = this.data.curMonth;
    if (handle === 'prev') {
      let newMonth = curMonth - 1;
      let newYear = curYear;
      if (newMonth < 1) {
        newYear = curYear - 1;
        newMonth = 12;
      }

      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);

      this.setData({
        curYear: newYear,
        curMonth: newMonth
      });
    } else {
      let newMonth = curMonth + 1;
      let newYear = curYear;
      if (newMonth > 12) {
        newYear = curYear + 1;
        newMonth = 1;
      }

      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);

      this.setData({
        curYear: newYear,
        curMonth: newMonth
      });
    }
  },

  //点击日期触发
  tapDayItem(e) {

    const idx = e.currentTarget.dataset.idx;

    var date = new Date(this.data.query.year, this.data.query.month - 1, parseInt(idx) + 1);

    //如果当前页面栈出错则重定向
    var pages = getCurrentPages();
    if (pages.length < 2) {
      wx.reLaunch({
        url: '../index/index',
      })
    }

    //获取上一页实例，并setData,之后返回
    var indexDate = { year: date.getFullYear(), month: date.getMonth()+1, date: date.getDate(), day: date.getDay(), desc: this.data.days[idx]['desc'] }
    var indexPage = pages[pages.length - 2];
    indexPage.setData({
      date: indexDate
    }, function () {
      wx.navigateBack({})
    })

    //const days = this.data.days;
    // days[idx].choosed = !days[idx].choosed;
    //this.setData({
    //  days,
    // });
    // this.setData({
    //  currentActive: idx,
    // });

  },
  chooseYearAndMonth() {
    const curYear = this.data.curYear;
    const curMonth = this.data.curMonth;
    let pickerYear = [];
    let pickerMonth = [];
    for (let i = 1900; i <= 2100; i++) {
      pickerYear.push(i);
    }
    for (let i = 1; i <= 12; i++) {
      pickerMonth.push(i);
    }
    const idxYear = pickerYear.indexOf(curYear);
    const idxMonth = pickerMonth.indexOf(curMonth);
    this.setData({
      pickerValue: [idxYear, idxMonth],
      pickerYear,
      pickerMonth,
      showPicker: true,
    });
  },
  pickerChange(e) {
    const val = e.detail.value;
    chooseYear = this.data.pickerYear[val[0]];
    chooseMonth = this.data.pickerMonth[val[1]];
  },
  tapPickerBtn(e) {
    const type = e.currentTarget.dataset.type;
    const o = {
      showPicker: false,
    };
    if (type === 'confirm') {
      o.curYear = chooseYear;
      o.curMonth = chooseMonth;
      this.calculateEmptyGrids(chooseYear, chooseMonth);
      this.calculateDays(chooseYear, chooseMonth);
    }

    this.setData(o);
  },

};

Page(conf);
