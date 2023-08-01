<template>
  <!--  -->
  <Layout :class="prefixCls">
    <!-- LayoutFeatures -->
    <LayoutFeatures />
    <!--  LayoutHeader    -->
    <LayoutHeader v-if="getShowFullHeaderRef" fixed />
    <!-- main: 页面主要布局,所见即所得;左边是 sidebar, 右边是 layout,包括 header,content,footer  -->
    <!-- layoutClass: 主要设置flex-direction:row 两列布局 -->
    <Layout :class="[layoutClass]">
      <LayoutSideBar v-if="getShowSidebar || getIsMobile" />
      <Layout :class="`${prefixCls}-main`">
        <LayoutMultipleHeader />
        <LayoutContent />
        <LayoutFooter />
      </Layout>
    </Layout>
  </Layout>
</template>

<script lang="ts">
  import { defineComponent, computed, unref } from 'vue'
  import { Layout } from 'ant-design-vue'
  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent'

  import LayoutHeader from './header/index.vue'
  import LayoutContent from './content/index.vue'
  import LayoutSideBar from './sider/index.vue'
  import LayoutMultipleHeader from './header/MultipleHeader.vue'

  import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting'
  import { useMenuSetting } from '/@/hooks/setting/useMenuSetting'
  import { useDesign } from '/@/hooks/web/useDesign'

  import { useAppInject } from '/@/hooks/web/useAppInject'

  export default defineComponent({
    name: 'DefaultLayout',
    components: {
      LayoutFeatures: createAsyncComponent(() => import('/@/layouts/default/feature/index.vue')),
      LayoutFooter: createAsyncComponent(() => import('/@/layouts/default/footer/index.vue')),
      LayoutHeader,
      LayoutContent,
      LayoutSideBar,
      LayoutMultipleHeader,
      Layout,
    },
    setup() {
      const { prefixCls } = useDesign('default-layout')
      const { getIsMobile } = useAppInject()
      const { getShowFullHeaderRef } = useHeaderSetting()
      // sidebar 分为 sidebar,mixinSidebar;
      const { getShowSidebar, getIsMixSidebar, getShowMenu } = useMenuSetting()

      //
      const layoutClass = computed(() => {
        let cls: string[] = ['ant-layout']
        // 只要显示菜单,或者 是mixinSidebar,都添加 sidebar
        if (unref(getIsMixSidebar) || unref(getShowMenu)) {
          cls.push('ant-layout-has-sider')
        }
        return cls
      })

      return {
        getShowFullHeaderRef,
        getShowSidebar,
        prefixCls,
        getIsMobile,
        getIsMixSidebar,
        layoutClass,
      }
    },
  })
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-default-layout';

  .@{prefix-cls} {
    display: flex;
    width: 100%;
    min-height: 100%;
    background-color: @content-bg;
    flex-direction: column;

    > .ant-layout {
      min-height: 100%;
    }

    &-main {
      width: 100%;
      margin-left: 1px;
    }
  }
</style>
