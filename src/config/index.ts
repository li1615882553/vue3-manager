const configMeta = import.meta.glob('@/systems/**/config.ts', { eager: true });
const sysConfig = Object.keys(configMeta).reduce((sysConfig, item) => {
  const sysName = item.slice(item.indexOf('systems/')+8, item.indexOf('/config'));
  sysConfig[sysName] = (configMeta[item] as any).default;
  return sysConfig;
}, {})

export default {
  sysConfig
}