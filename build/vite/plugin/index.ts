import type { PluginOption } from 'vite';
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { configSvgIconsPlugin } from './svgSprite';

export function createVitePlugins() {
  const vitePlugins: (PluginOption | PluginOption[])[] = [
    vue(),
    vueJsx(),
  ];

  vitePlugins.push(configSvgIconsPlugin());

  return vitePlugins;
}