import type { TransitionSetting } from '/#/config'

import { computed } from 'vue'

import { useAppStore } from '/@/store/modules/app'

// transition 配置,配置信息来源于 store ,也作为hooks
export function useTransitionSetting() {
  const appStore = useAppStore()

  const getEnableTransition = computed(() => appStore.getTransitionSetting?.enable)

  const getOpenNProgress = computed(() => appStore.getTransitionSetting?.openNProgress)
  //
  const getOpenPageLoading = computed((): boolean => {
    return !!appStore.getTransitionSetting?.openPageLoading
  })

  const getBasicTransition = computed(() => appStore.getTransitionSetting?.basicTransition)

  function setTransitionSetting(transitionSetting: Partial<TransitionSetting>) {
    appStore.setProjectConfig({ transitionSetting })
  }
  return {
    setTransitionSetting,

    getEnableTransition,
    getOpenNProgress,
    getOpenPageLoading,
    getBasicTransition,
  }
}
