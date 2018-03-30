module.exports = {
  // 基础类型输入框配置
  base: {
    name: {
      focus: true,
      title: '姓名',
      name:"name",
      placeholder: '请输入乘客姓名'
    },
    type: {
      title: '证件类型',
      placeholder: '身份证',
      disabled:true,
      value:'身份证'
    },
    idcard: {
      title: '证件号码',
      inputType:"idcard",
      name:"idcard",
      placeholder: '请输入证件号码'
    },
    tel: {
      title: '联系手机',
      name:"tel",
      placeholder: '请输入手机号码'
    }
  },
};
