import request from "../config/request";

export function ywxtMenus() {
  return request({
    url: `app/ywxts`,
    method: 'get'
  })
}

export function getMenus(code:string){
  return request({
    url: `app/menu/${code}`,
    method: 'get'
  })
}