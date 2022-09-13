
declare module '*.vue' {
    import { ComponentOptions } from 'vue'
    const componentOptions: ComponentOptions
    export default componentOptions
}
declare module 'virtual:*' {
    const result: any;
    export default result;
}