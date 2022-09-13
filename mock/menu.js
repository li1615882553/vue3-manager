let sysMenus = {};

//暂时使用同一的icon样式,后期可对菜单进行配置
const filterMenus = ({name,path}) => ({name, path})
function getMenusFromRoute(routers) {
    const menus = [];
    routers.forEach(route => {
        let menu = filterMenus(route);
        if(Array.isArray(route.children)){
            menu.children = getMenusFromRoute(route.children);
        } 
        menus.push(menu);
    })
    return menus;
}

// const subSysRouterWebpackContext = require.context('../src/systems', true, /router\/index\.js$/);
// subSysRouterWebpackContext.keys().forEach(path => {
//     const key = path.split('/')[1];
//     const value = subSysRouterWebpackContext(path);  // 返回引入的信息
//     sysMenus[key] = getMenusFromRoute(value.default)
// })

console.log(sysMenus)

// export default sysMenus