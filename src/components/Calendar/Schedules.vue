<script setup>
import BookedSchedule from './BookedSchedule.vue'
import OwnSchedule from './OwnSchedule.vue'
import { useDataStore } from '@/stores/schedulesInfo'
import { storeToRefs } from 'pinia'
import { inject, ref, computed } from 'vue'
import _ from 'lodash'

const selectedTime = inject('selectedTime')
const selectedDay = inject('selectedDay')
const { time, getBookedScheduler } = inject('bookedSchedules')

const currentDate = computed(() => {
  return { selectedDay: selectedDay.value, time: time.value }
})
</script>

<template>
  <div>
    <BookedSchedule v-if="getBookedScheduler"></BookedSchedule>
    <OwnSchedule class="own" v-if="_.isEqual(selectedTime, currentDate)" />
  </div>
</template>

<style scoped></style>
