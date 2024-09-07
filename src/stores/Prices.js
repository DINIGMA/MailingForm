import { defineStore } from 'pinia'
import { useBasesStore } from './Bases'
import { computed, reactive, ref } from 'vue'
import axios from 'axios'

const url = 'https://1ba67701b8743229.mokky.dev/prices'

export const usePricesStore = defineStore('PricesStore', () => {
  const data = ref([])
  const operators = ref([])
  const products = ref([])

  const getData = async () => {
    try {
      const { data } = await axios.get(url)
      data.value = data[0]
      products.value = data.value.products
      operators.value = data.value.operators
      console.log(data.value)
      console.log(products.value)
      console.log(operators.value)
    } catch (err) {
      console.log(err)
    }
  }

  const getPrices = computed(() => (data.value ? prices.value : null))

  const getOperators = computed(() => (data.value ? operators.value : null))

  return {
    data,
    operators,
    products,
    getData,
    getPrices,
    getOperators
  }
})
