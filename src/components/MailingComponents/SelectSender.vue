<script setup>
import Multiselect from './Multiselect.vue'
import { onBeforeMount, ref, computed, watch } from 'vue'
import { usePricesStore } from '@/stores/Prices'
import { useMailingStore } from '@/stores/Mailing'
import { storeToRefs } from 'pinia'

const pricesStore = usePricesStore()
const mailingStore = useMailingStore()

const { formData } = storeToRefs(mailingStore)
const { operators, products } = storeToRefs(pricesStore)

const selectedSenders = ref({})

const allowedKeys = ['beeline', 'mts', 'tele2', 'megafon', 'other']

const operatorData = computed(() =>
  Object.entries(operators.value || {})
    .filter(([key]) => allowedKeys.includes(key))
    .map(([key, name]) => ({ key, name }))
)

const neutralSMSPrice = computed(
  () => products.value.find((product) => product.name === 'SMS рассылка нейтральное ИО').prices
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

  const senderValue = selectedSender
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
  let result = {}
  Object.entries(selectedSenders.value).forEach(([key, senderData], index) => {
    let channel = ''
    let sender = ''

    if (senderData === 'neutral_io') {
      channel = 'neutral'
    } else if (senderData === 'not_send') {
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
    formData.value.operators_settings = submission.value
  },
  { deep: true }
)

onBeforeMount(async () => {
  await pricesStore.getData()
})
</script>

<template>
  <div class="mailing-form__block-sub">
    <h3>Выберите имя отправителя</h3>
    <div v-for="operator in operatorData" :key="operator.key" class="mailing-form__operators">
      <h4>{{ operator.name }}</h4>
      <div class="select-wrapper">
        <Multiselect
          v-model="selectedSenders[operator.key]"
          :options="getSendersForOperator(operator.key)"
          placeholder="Выберите способ отправки"
        />
      </div>
      <span v-if="selectedSenders[operator.key] !== 'not_send'">
        {{ getPrice(operator.key) }} руб./сообщение</span
      >
    </div>
  </div>
</template>

<style scoped>
h3 {
  margin-bottom: 20px;
}
</style>
