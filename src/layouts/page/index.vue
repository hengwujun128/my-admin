<template>
  <RouterView>
    <template #default="{ Component, route }">
      {{
        getTransitionName({
          route,
          openCache,
          enableTransition: getEnableTransition,
          cacheTabs: getCaches,
          def: getBasicTransition,
        })
      }}
      <transition
        :name="
          getTransitionName({
            route,
            openCache,
            enableTransition: getEnableTransition,
            cacheTabs: getCaches,
            def: getBasicTransition,
          })
        "
        mode="out-in"
        appear
      >
        <!-- NOTE: 精华,按需缓存页面 -->
        <keep-alive v-if="openCache" :include="getCaches">
          <component :is="Component" :key="route.fullPath" />
        </keep-alive>
        <!-- NOTE: 否知就不缓存 -->
        <div v-else :key="route.name">
          <component :is="Component" :key="route.fullPath" />
        </div>
      </transition>
    </template>
  </RouterView>
</template>

<script lang="ts">
  import { computed, defineComponent, unref } from 'vue'

  import { useRootSetting } from '/@/hooks/setting/useRootSetting'

  import { useTransitionSetting } from '/@/hooks/setting/useTransitionSetting'
  import { useMultipleTabSetting } from '/@/hooks/setting/useMultipleTabSetting'
  //
  import { getTransitionName } from './transition'

  import { useMultipleTabStore } from '/@/store/modules/multipleTab'

  export default defineComponent({
    name: 'PageLayout',
    setup() {
      const { getShowMultipleTab } = useMultipleTabSetting()
      const tabStore = useMultipleTabStore()

      const { getOpenKeepAlive } = useRootSetting()
      // getEnableTransition 返回:'fade-slide'
      const { getBasicTransition, getEnableTransition } = useTransitionSetting()
      //开启缓存标志: openKeepAlive 和 multiTabsSetting.show 都为真的时候才进行缓存
      const openCache = computed(() => unref(getOpenKeepAlive) && unref(getShowMultipleTab))

      // 要缓存的数据:缓存的 tablist
      const getCaches = computed((): string[] => {
        if (!unref(getOpenKeepAlive)) {
          return []
        }
        return tabStore.getCachedTabList
      })
      return {
        getTransitionName,
        openCache,
        getEnableTransition,
        getBasicTransition,
        getCaches,
      }
    },
  })
</script>
