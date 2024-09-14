<script setup>
import { onBeforeMount, ref, useAttrs } from 'vue'

const isActive = ref(false)
const hoverOptions = ref(false)

const props = defineProps({
  modelValue: Array,
  options: Array,
  emptyText: String
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

const selectedOptions = ref(props.modelValue || [])

const setActive = () => {
  isActive.value ? (isActive.value = false) : (isActive.value = true)
}

const toggleOption = (option) => {
  const index = selectedOptions.value.findIndex((selected) => selected.value === option.value)

  if (index === -1) {
    // Добавляем опцию, если её нет в массиве
    selectedOptions.value.push(option)
  } else {
    // Удаляем опцию, если она уже есть в массиве
    selectedOptions.value.splice(index, 1)
  }

  emits(
    'update:modelValue',
    selectedOptions.value.map((opt) => opt)
  )
}

const deleteOptions = (option) => {
  const index = selectedOptions.value.findIndex((selected) => selected.value === option.value)
  selectedOptions.value.splice(index, 1)
  emits(
    'update:modelValue',
    selectedOptions.value.map((opt) => opt)
  )
}

onBeforeMount(() => {
  emits(
    'update:modelValue',
    selectedOptions.value.map((opt) => opt.value)
  )
})
</script>

<template>
  <div
    class="multiselect select"
    :class="[{ 'multiselect--active': isActive }]"
    tabindex="0"
    @click="setActive()"
    @blur="isActive = false"
  >
    <div class="multiselect__select"></div>
    <div class="multiselect__tags">
      <div class="multiselect__tags-wrapper">
        <span class="multiselect__tag" v-for="element of selectedOptions" :key="element.name">
          <span>{{ element.name }}</span>
          <i class="multiselect__tag-icon" tabindex="1" @click.stop="toggleOption(element)"></i>
        </span>
      </div>
      <input
        type="text"
        class="multiselect__input"
        style="width: 0; position: absolute; padding: 0"
      />
      <span class="multiselect__single" v-if="selectedOptions.length == 0">{{
        attrs.placeholder
      }}</span>
    </div>
    <div class="multiselect__content-wrapper" :style="checkActive()">
      <ul class="multiselect__content">
        <li
          class="multiselect__element"
          v-for="(element, idx) of options"
          :key="idx"
          @click.stop="toggleOption(element)"
        >
          <span
            class="multiselect__option"
            :class="[
              {
                'multiselect__option--selected': selectedOptions.find(
                  (selected) => selected.name === element.name
                )
              }
            ]"
            ><div class="option__desc">
              {{ element.name }} {{ element.count ? `(номеров - ${element.count})` : null }}
            </div></span
          >
        </li>
        <li v-show="options.length == 0" style="margin-bottom: 0">
          <span class="multiselect__option"
            ><div class="option__desc">
              {{ emptyText }}
            </div></span
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<style></style>
