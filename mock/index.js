import Mock from 'mockjs';
import sysMenus from "./menu"
//延时200-600毫秒请求到数据
Mock.setup({
  timeout: '100-200'
})
const sysInfo = [
  {
    icon: "admin",
    title: "后台管理",
    path: "admin",
    hidden: false
  },
  {
    icon: "content",
    title: "前端展示",
    path: "content",
    hidden: false
  }
];
let userList = ['admin', 'content'];
let userAuth = {
  'admin': ['admin', 'content'],
  'content': ['content']
};

Mock.mock('app/ywxts', 'get', (data) => {
  return sysInfo
});
Mock.mock(/app\/menu[\s\S]*?/, 'get', (data) => {
  const sysName = data.url.slice(data.url.lastIndexOf("/")+1);
  return sysMenus[sysName];
});

Mock.mock('user/login', 'post', (data) => {
  const body = JSON.parse(data.body)
  if (userList.indexOf(body.username) === -1) {
    return {
      status: 1,
      msg: "未找到当前用户信息"
    }
  }
  const token = Math.random().toString().slice(2);
  let userInfo = JSON.parse(sessionStorage.getItem('userInfo')) || {};
  userInfo[body.username] = token;
  sessionStorage.setItem('userInfo', JSON.stringify(userInfo));

  let userToken = JSON.parse(sessionStorage.getItem('userToken'))  || {};
  userToken[token] = body.username;
  sessionStorage.setItem('userToken', JSON.stringify(userToken));
  
  return {
    status: 0,
    username: body.username,
    token: userInfo[body.username]
  }
});

Mock.mock(/user\/logout[\s\S]*?/, 'get', (data) => {
  const token = data.url.slice(data.url.lastIndexOf("/")+1);
  
  let userToken = JSON.parse(sessionStorage.getItem('userToken'))  || {};
  let username = userToken[token];
  delete userToken[token];
  sessionStorage.setItem('userToken', JSON.stringify(userToken));

  let userInfo = JSON.parse(sessionStorage.getItem('userInfo')) || {};
  delete userToken[username];
  sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
  
  return {
    status: 0
  }
});

Mock.mock(/user\/getUserInfo[\s\S]*?/, 'get', (data) => {
  const token = data.url.slice(data.url.lastIndexOf("/")+1);
  let userToken = JSON.parse(sessionStorage.getItem('userToken'))  || {};
  if (userToken[token]) {
    let username = userToken[token];
    return {
      username,
      token: token
    }
  } else {

  }
});