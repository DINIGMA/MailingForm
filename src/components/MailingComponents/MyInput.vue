<template>
  <input type="text" name="myInputData" />
</template>

<script setup>
import { ref } from 'vue'
import { Field, ErrorMessage, useField, useForm } from 'vee-validate'

defineProps(['modelValue'])
</script>

<style></style>
