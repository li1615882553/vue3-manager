export function getSystemFromPath(path:string) {
  // redirect路由用于刷新页签
  const tempArr = path.split('/')
  if (tempArr[1] === 'redirect') {
    tempArr.splice(1, 1)
  }
  return tempArr[1]
}