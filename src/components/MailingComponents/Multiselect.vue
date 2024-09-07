<script setup>
import { onBeforeMount, ref, useAttrs } from 'vue'

const isActive = ref(false)
const hoverOptions = ref(false)

const props = defineProps({
  modelValue: [Object, String],
  options: Array
})

const attrs = useAttrs()

const emits = defineEmits(['update:modelValue'])

const checkActive = () => {
  if (!isActive.value) {
    return { 'max-height': '300px', display: 'none' }
  } else {
    return { 'max-height': '300px' }
  }
}

const data = ref(props.options[0])

const setActive = () => {
  isActive.value ? (isActive.value = false) : (isActive.value = true)
}

const setData = (element) => {
  data.value = element
  emits('update:modelValue', element.value)
}

onBeforeMount(() => {
  emits('update:modelValue', data.value.value)
})
</script>

<template>
  <div
    class="multiselect select select-custom"
    :class="[{ 'multiselect--active': isActive }]"
    tabindex="0"
    @click="setActive()"
    @blur="isActive = false"
  >
    <div class="multiselect__select"></div>
    <div class="multiselect__tags">
      <input
        type="text"
        class="multiselect__input"
        style="width: 0; position: absolute; padding: 0"
      />
      <span class="multiselect__single">{{ !isActive ? data.name : attrs.placeholder }}</span>
    </div>
    <div class="multiselect__content-wrapper" :style="checkActive()">
      <ul class="multiselect__content">
        <li
          class="multiselect__element"
          v-for="(element, idx) of options"
          :key="idx"
          @click="setData(element)"
        >
          <span
            class="multiselect__option"
            :class="[
              {
                'multiselect__option--selected': element.name == data.name
              }
            ]"
            ><div class="option__desc">{{ element.name }}</div></span
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<style></style>
