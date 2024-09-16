<template>
  <div
    class="input-form"
    :class="{
      'input-form_active': isFocused,
      'input-form_value': modelValue,
      'input-form_error': errors.length > 0 ? true : false
    }"
  >
    <input
      name="mailingName"
      type="text"
      @focus="handleFocusEvent()"
      @blur="handleBlurEvent()"
      autocomplete="off"
      :value="modelValue"
      :placeholder="isFocused & !modelValue ? 'Введите название' : ''"
    />
    <span>Название рассылки</span>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const isFocused = ref(false)

const props = defineProps({
  modelValue: String,
  errors: { type: Array, default: [] }
})

const emits = defineEmits(['update:modelValue'])

const handleBlurEvent = () => {
  isFocused.value = false
  // v$.value.mailingName.$touch()
}

const handleFocusEvent = () => {
  isFocused.value = true
  // handleFocus()
}

const hasScroll = computed(() => {
  if (textarea.value) {
    console.log(textarea.value)
    return textarea.value.style.height
  }
})
</script>

<style></style>
