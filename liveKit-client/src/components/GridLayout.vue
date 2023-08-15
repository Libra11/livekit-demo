<!--
 * @Author: Libra
 * @Date: 2023-08-15 16:36:04
 * @LastEditors: Libra
 * @Description: 
-->
<template>
  <div class="grid-container">
    <div :class="layout==='EquallyDivided'? ['EquallyDivided', gridMode]: layout">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, type Ref } from "vue";
import emitter from "@/utils/mitt";
import { UserStore, type ILayout } from "@/store/modules/user";

const gridMode = ref("");
let layout: Ref<ILayout> = ref("EquallyDivided");
const userStore = UserStore();

onMounted(() => {
  emitter.on("equallyDivided", (layout: string) => {
    gridMode.value = layout;
  })
  emitter.on("changeLayout", (l: ILayout) => {
    layout.value = l;
    userStore.setLayout(l);
  })
  layout.value = userStore.getLayout;
});
onBeforeUnmount(() => {
  emitter.off("equallyDivided");
  emitter.off("changeLayout");
})
</script>

<style lang="scss" scoped>
:deep(.n-space) {
  justify-content: center !important;
  width: 100%;
  height: 100%;
  align-items: center;
}
</style>
<style lang="scss">
.grid-box-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 4px;
  border-radius: 2px;
  box-sizing: border-box;
  overflow: hidden;
  cursor: pointer;
}
.grid-container {
  width: 100%;
  height: 100%;
}
.EquallyDivided {
  width: 100%;
  height: 100%;
  display: grid;
  box-sizing: content-box;
}
.grid-one-one {
  grid-template-columns: repeat(1, 100%);
  grid-template-rows: repeat(1, 100%);
}
.grid-one-two {
  grid-template-rows: repeat(1, 100%);
  grid-template-columns: repeat(2, 50%);
}
.grid-two-two {
  grid-template-columns: repeat(2, 50%);
  grid-template-rows: repeat(2, 50%);
}
.grid-two-three {
  grid-template-columns: repeat(3, 33.3%);
  grid-template-rows: repeat(2, 50%);
}
.grid-three-three {
  grid-template-columns: repeat(3, 33.3%);
  grid-template-rows: repeat(3, 33.3%);
}
.grid-three-four {
  overflow: scroll;
  grid-template-columns: repeat(4, 25%);
  grid-template-rows: unset;
  grid-auto-rows: 33.3%;
}
.grid-four-four {
  grid-template-columns: repeat(4, 25%);
  grid-template-rows: repeat(4, 25%);
}

.grid-five-five {
  grid-template-columns: repeat(5, 20%);
  grid-template-rows: repeat(5, 20%);
}
.header-foot-foot {
  grid-template-columns: repeat(2, 50%);
  grid-template-rows: repeat(2, 50%);
  .grid-box-item:nth-child(1) {
    grid-column: 1 / 4;
  }
}
.left-one-box {
  grid-template-columns: repeat(3, 33.3%);
  grid-template-rows: repeat(3, 33.3%);
  .grid-box-item:nth-child(1) {
    grid-column: 1/3;
    grid-row: 1/3;
  }
}
.header-more {
  grid-template-columns: repeat(4, 25%);
  grid-template-rows: repeat(4, 25%);
  .grid-box-item:nth-child(1) {
    grid-column: 1 / 5;
    grid-row: 1 / 3;
  }
}

.left-four {
  grid-template-columns: repeat(5, 20%);
  grid-template-rows: repeat(5, 20%);

  .grid-box-item:nth-child(1) {
    grid-column: 1 / 3;
    grid-row: 1 / 3;
  }
  .grid-box-item:nth-child(2) {
    grid-column: 3 / 5;
    grid-row: 1 / 3;
  }
  .grid-box-item:nth-child(3) {
    grid-column: 1 / 3;
    grid-row: 3 / 5;
  }
  .grid-box-item:nth-child(4) {
    grid-column: 3 / 5;
    grid-row: 3 / 5;
  }
}
.twelve-twelve {
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(12, 1fr);
}
@media (min-width: 375px) and (max-width: 385px) {
  .grid-box {
    width: 240px;
    height: 240px;
  }
  .color-list {
    width: 100px;
    height: 300px;
    margin-right: 12px;
  }
}

.MainAndTop {
  width: 100%;
  height: 100%;
	display: grid;
	grid-template-rows: repeat(4, 25%);
	grid-template-columns: unset;
	grid-auto-columns: 25%;
	overflow: auto;
	.grid-box-item {
		padding: 0.25rem;
	}
	.grid-box-item:nth-child(1) {
		grid-row: 2 / 5;
		grid-column: 1 / 5;
	}
}
.MainAndAside {
  width: 100%;
  height: 100%;
	display: grid;
	grid-template-columns: repeat(4, 25%);
	grid-template-rows: unset;
	grid-auto-rows: 25%;
	overflow: auto;
	.grid-box-item {
		padding: 0.25rem;
	}
	.grid-box-item:nth-child(1) {
		grid-column: 2 / 5;
		grid-row: 1 / 5;
	}
}

</style>
