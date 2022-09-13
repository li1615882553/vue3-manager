export function getSystemFromPath(path:string) {
  // redirect路由用于刷新页签
  const tempArr = path.split('/')
  if (tempArr[1] === 'redirect') {
    tempArr.splice(1, 1)
  }
  return tempArr[1]
}

export function combinPath(basePath:string, path:string){
  if(basePath.endsWith("/")){
    basePath = basePath.slice(0, basePath.length - 1);
  }
  if(path.startsWith("/")){
    path = path.slice(1, path.length);
  }
  return `${basePath}/${path}`
}