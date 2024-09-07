import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'
import axios from 'axios'

const urlWatsappBases = 'https://1ba67701b8743229.mokky.dev/waBases'
const urlBases = 'https://1ba67701b8743229.mokky.dev/bases'

export const useBasesStore = defineStore('BasesStore', () => {
  const bases = ref([])

  const getWatsappBases = async () => {
    try {
      const { data } = await axios.get(urlWatsappBases)
      bases.value = data[0].bases.data
      console.log(bases.value)
    } catch (err) {
      console.log(err)
    }
  }
  const getBases = async () => {
    try {
      const { data } = await axios.get(urlBases)
      bases.value = data[0].bases.data
      console.log()
    } catch (err) {
      console.log(err)
    }
  }

  return {
    bases,
    getWatsappBases,
    getBases
  }
})
