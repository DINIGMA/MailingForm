<script setup>
import { useDataStore } from '@/stores/schedulesInfo'
import Schedules from './Schedules.vue'
import { storeToRefs } from 'pinia'
import { computed, provide, ref, inject } from 'vue'
import { DateTime } from 'luxon'
import { useMailingStore } from '@/stores/Mailing'

const dataStore = useDataStore()
const mailingStore = useMailingStore()
const { formData } = storeToRefs(mailingStore)
const emits = defineEmits(['update-value'])

const selectedDay = inject('selectedDay')
const counter = ref(formData.value.counter)
const props = defineProps({
  time: Number
})

const { getSchedules, getHourCapacity } = storeToRefs(dataStore)

const defaultHourCapacity = ref(getHourCapacity.value(props.time))

const time = ref(props.time)

const getBookedScheduler = computed(() => {
  const dates = getSchedules.value.find(
    (item) => item.date == selectedDay.value.toISODate() && item.hour == props.time
  )
  if (dates) {
    return Number(dates.engaged_count)
  } else {
    return null
  }
})

const bookedSchedules = provide('bookedSchedules', {
  defaultHourCapacity,
  getBookedScheduler,
  time
})

const nowDate = ref(DateTime.local())

// Сделать проверку на время(переполнение)

const selectTime = () => {
  console.log(counter.value)
  if (
    selectedDay.value > nowDate.value &&
    defaultHourCapacity.value - getBookedScheduler.value >= counter.value
  ) {
    console.log(1111)
    emits('update-value', {
      selectedDay: selectedDay.value,
      time: props.time
    })
  }
}

function isPastDate(date) {
  return date < nowDate.value ? true : false
}
</script>

<template>
  <div class="calendar__time-options-item" @click="selectTime">
    <Schedules class="schedules" :class="{ schedules_filled: isPastDate(selectedDay) }">
    </Schedules>
  </div>
</template>

<style scoped></style>
