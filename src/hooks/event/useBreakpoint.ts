import { ref, computed, ComputedRef, unref } from 'vue'
import { useEventListener } from '/@/hooks/event/useEventListener'
import { screenMap, sizeEnum, screenEnum } from '/@/enums/breakpointEnum'

let globalScreenRef: ComputedRef<sizeEnum | undefined>
let globalWidthRef: ComputedRef<number>
let globalRealWidthRef: ComputedRef<number>

export interface CreateCallbackParams {
  screen: ComputedRef<sizeEnum | undefined>
  width: ComputedRef<number>
  realWidth: ComputedRef<number>
  screenEnum: typeof screenEnum
  screenMap: Map<sizeEnum, number>
  sizeEnum: typeof sizeEnum
}

export function useBreakpoint() {
  return {
    screenRef: computed(() => unref(globalScreenRef)),
    widthRef: globalWidthRef,
    screenEnum,
    realWidthRef: globalRealWidthRef,
  }
}

// Just call it once
export function createBreakpointListen(fn?: (opt: CreateCallbackParams) => void) {
  // 定义 6 种尺寸的枚举:sizeEnum 既可以作为 type,又可以做值
  const screenRef = ref<sizeEnum>(sizeEnum.XL)
  const realWidthRef = ref(window.innerWidth)

  function getWindowWidth() {
    const width = document.body.clientWidth
    const xs = screenMap.get(sizeEnum.XS)!
    const sm = screenMap.get(sizeEnum.SM)!
    const md = screenMap.get(sizeEnum.MD)!
    const lg = screenMap.get(sizeEnum.LG)!
    const xl = screenMap.get(sizeEnum.XL)!
    if (width < xs) {
      screenRef.value = sizeEnum.XS
    } else if (width < sm) {
      screenRef.value = sizeEnum.SM
    } else if (width < md) {
      screenRef.value = sizeEnum.MD
    } else if (width < lg) {
      screenRef.value = sizeEnum.LG
    } else if (width < xl) {
      screenRef.value = sizeEnum.XL
    } else {
      screenRef.value = sizeEnum.XXL
    }
    realWidthRef.value = width
  }

  // 初始化全局监听 window.resize: 把浏览器的监听器封装成了 hooks
  useEventListener({
    el: window, // 事件绑定的元素
    name: 'resize', // 事件名称
    // 世界处理程序的回调
    listener: () => {
      getWindowWidth() // 获取屏幕宽度
      resizeFn() //
    },
    // wait: 100,
  })

  // 初始化确定屏幕的尺寸和window的宽度
  getWindowWidth()
  globalScreenRef = computed(() => unref(screenRef))
  globalWidthRef = computed((): number => screenMap.get(unref(screenRef)!)!)
  globalRealWidthRef = computed((): number => unref(realWidthRef))

  // 断点监听时候: 用户外部自定义回调
  function resizeFn() {
    fn?.({
      screen: globalScreenRef,
      width: globalWidthRef,
      realWidth: globalRealWidthRef,
      screenEnum,
      screenMap,
      sizeEnum,
    })
  }

  // 初始化就要调用一次 resizeFn回调, 把screen,width 等宽度暴露出去
  resizeFn()

  return {
    screenRef: globalScreenRef,
    screenEnum,
    widthRef: globalWidthRef,
    realWidthRef: globalRealWidthRef,
  }
}
