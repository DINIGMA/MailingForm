<template>
  <h3 class="text-base font-medium text-main">Выберите имя отправителя</h3>
  <div v-for="operator in operatorsData" :key="operator.key" class="flex items-center gap-4">
    <h4 class="w-24 text-base font-medium text-main">
      {{ operator.name }}
    </h4>
    <AppMultiselect
      v-model="selectedSenders[operator.key]"
      :options="getSendersForOperator(operator.key)"
      placeholder="Выберите способ отправки"
      option-label="name"
      :name="`sender-${operator.key}`"
      class="!mb-0"
    />
    <span v-if="selectedSenders[operator.key]?.value !== 'not_send'" class="text-sm text-main">
      {{ getPrice(operator.key) }} руб./сообщение
    </span>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { usePricesStore } from '../../store/prices'
import { useMailingStore } from '../../store/mailing'

import AppMultiselect from '@/UI/AppMultiselect.vue'

const mailingStore = useMailingStore()
const { mailing } = storeToRefs(mailingStore)

const pricesStore = usePricesStore()
const { operators, products } = storeToRefs(pricesStore)
const selectedSenders = ref({})

const neutralSMSPrice = computed(
  () => products.value.find((product) => product.name === 'SMS рассылка нейтральное ИО').prices
)

const allowedKeys = ['beeline', 'mts', 'tele2', 'megafon', 'other']
const operatorsData = computed(() =>
  Object.entries(operators.value || {})
    .filter(([key]) => allowedKeys.includes(key))
    .map(([key, name]) => ({ key, name }))
)

function getSendersForOperator(operatorKey) {
  const options = []

  const brandedSenders =
    products.value.find((product) => product.name === 'SMS рассылка брендовое ИО')?.senders ?? []
  brandedSenders.forEach((sender) => {
    if (sender.prices[operatorKey] !== undefined)
      options.push({ name: sender.name, value: sender.name })
  })

  options.push({ name: 'Нейтральное ИО', value: 'neutral_io' })
  options.push({ name: 'Не отправлять', value: 'not_send' })
  return options
}

function getPrice(operatorKey) {
  const selectedSender = selectedSenders.value[operatorKey]
  if (!selectedSender || selectedSender.value === 'not_send') return ''

  const senderValue = selectedSender.value
  if (senderValue === 'neutral_io') {
    return neutralSMSPrice.value[operatorKey]
  } else {
    const sender = products.value
      .find((product) => product.name === 'SMS рассылка брендовое ИО')
      ?.senders.find((sender) => sender.name === senderValue)
    return sender?.prices[operatorKey]
  }
}
const submission = computed(() => {
  const result = {}
  Object.entries(selectedSenders.value).forEach(([key, senderData], index) => {
    let channel = ''
    let sender = ''

    if (senderData.value === 'neutral_io') {
      channel = 'neutral'
    } else if (senderData.value === 'not_send') {
      channel = 'not_send'
    } else {
      channel = 'operator'
      sender = senderData.name
    }

    const submissionKey = key === 'other' ? '999' : (index + 1).toString()
    result[submissionKey] = { channel, sender }
  })

  return result
})
watch(
  selectedSenders,
  () => {
    mailing.value.operators_settings = submission.value
  },
  { deep: true }
)

onBeforeMount(async () => {
  await usePricesStore().getPrices()
  await operatorsData.value.forEach((operator) => {
    selectedSenders.value[operator.key] = {
      name: 'Нейтральное ИО',
      value: 'neutral_io'
    }
  })
})
</script>
