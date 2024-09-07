import { defineStore } from 'pinia'
import { useBasesStore } from './Bases'
import { computed, reactive, ref } from 'vue'
import axios from 'axios'

const url = 'https://1ba67701b8743229.mokky.dev/channels'

export const useMailingStore = defineStore('MailingStore', () => {
  const channels = ref([])
  const basesStore = useBasesStore()

  const formData = reactive({
    mailingName: '',
    mailingChannel: 'whatsApp',
    activeTypes: 'text'
  })

  const getTypeMailing = async () => {
    try {
      const { data } = await axios.get(url)
      channels.value = data[0].data.types
    } catch (err) {
      console.log(err)
    }
  }

  const getTypes = computed(() => {
    if (channels) {
      const channel = Object.entries(channels.value)
        .filter(([key]) => key.startsWith('text'))
        .map(([key, value]) => ({ key, ...value }))
      console.log(channel)
      return channel
    }
  })

  const updateBases = () => {
    if (formData.mailingChannel == 'whatsApp') {
      basesStore.getWatsappBases()
    } else if (formData.mailingChannel == 'sms') {
      basesStore.getBases()
    }
  }

  return {
    channels,
    formData,
    getTypeMailing,
    getTypes,
    updateBases
  }
})
