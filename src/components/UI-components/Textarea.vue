<template>
  <div
    class="input-form input-textarea"
    :class="{
      'input-form_active': isFocused,
      'input-form_value': modelValue,
      'input-form_error': errors.length > 0,
      'input-form-scroll': 1
    }"
  >
    <textarea
      ref="textarea"
      type="text"
      name="messageText"
      :value="modelValue"
      @focus="handleFocusEvent()"
      @blur="handleBlurEvent()"
      autocomplete="off"
      @input="(event) => emits('update:modelValue', event.target.value)"
      style="height: 87px"
      :placeholder="isFocused & !modelValue ? 'Введите текст сообщения' : ''"
    ></textarea>
    <span>Текст рассылки</span>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const isFocused = ref(false)

const props = defineProps({
  modelValue: String,
  errors: Array
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
