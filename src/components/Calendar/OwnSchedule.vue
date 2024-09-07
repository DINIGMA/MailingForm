<script setup>
import { computed, inject, ref } from 'vue'
import { useMailingStore } from '@/stores/Mailing'

const mailingStore = useMailingStore()
const { defaultHourCapacity } = inject('bookedSchedules')

const counter = mailingStore.formData.counter

const procentOwnScheduler = computed(() => {
  if (counter !== null) {
    return ((counter.value / defaultHourCapacity.value) * 100).toFixed(5)
  }
})
</script>

<template>
  <div :style="{ width: `${procentOwnScheduler}%` }">
    <span>{{ counter }}</span>
  </div>
</template>

<style scoped></style>
