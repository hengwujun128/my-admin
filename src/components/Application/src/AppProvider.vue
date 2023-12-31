<script lang="ts">
  import { defineComponent, toRefs, ref, unref } from 'vue'
  import { createAppProviderContext } from './useAppContext'
  import { createBreakpointListen } from '/@/hooks/event/useBreakpoint'
  import { prefixCls } from '/@/settings/designSetting'
  import { useAppStore } from '/@/store/modules/app'
  import { MenuModeEnum, MenuTypeEnum } from '/@/enums/menuEnum'

  const props = {
    /**
     * class style prefix
     */
    prefixCls: { type: String, default: prefixCls },
  }
  // use defineComponent to define none template component
  export default defineComponent({
    name: 'AppProvider',
    // 3.3 版本之后: 使用defineOptions({ inheritAttrs: false })
    inheritAttrs: false, // 不继承attrs, 不透传;  默认情况下,父组件传递的 attrs会被透传
    props,
    setup(props, { slots }) {
      const isMobile = ref(false)
      const isSetState = ref(false)

      //
      const appStore = useAppStore()

      // 1. Monitor screen breakpoint information changes
      createBreakpointListen(({ screenMap, sizeEnum, width }) => {
        const lgWidth = screenMap.get(sizeEnum.LG)
        if (lgWidth) {
          isMobile.value = width.value - 1 < lgWidth
        }
        // 设置全局状态
        handleRestoreState()
      })

      const { prefixCls } = toRefs(props)

      // 2. Inject variables into the globally
      createAppProviderContext({ prefixCls, isMobile })

      /**
       * Used to maintain the state before the window changes
       */
      function handleRestoreState() {
        if (unref(isMobile)) {
          if (!unref(isSetState)) {
            isSetState.value = true
            const {
              menuSetting: { type: menuType, mode: menuMode, collapsed: menuCollapsed, split: menuSplit },
            } = appStore.getProjectConfig
            appStore.setProjectConfig({
              menuSetting: {
                type: MenuTypeEnum.SIDEBAR,
                mode: MenuModeEnum.INLINE,
                split: false,
              },
            })
            appStore.setBeforeMiniInfo({ menuMode, menuCollapsed, menuType, menuSplit })
          }
        } else {
          if (unref(isSetState)) {
            isSetState.value = false
            const { menuMode, menuCollapsed, menuType, menuSplit } = appStore.getBeforeMiniInfo
            appStore.setProjectConfig({
              menuSetting: {
                type: menuType,
                mode: menuMode,
                collapsed: menuCollapsed,
                split: menuSplit,
              },
            })
          }
        }
      }
      // 3. 在 setup 中 return 一个 function: 其实就是一个渲染函数
      return () => slots.default?.()
    },
  })
</script>
