<script setup>
import { onMounted, ref, toRefs, computed, provide, watch } from 'vue'
import Calendar from '../Calendar/Calendar.vue'
import { useMailingStore } from '@/stores/Mailing'
import { useBasesStore } from '@/stores/Bases'
import { storeToRefs } from 'pinia'
import Multiselect from '../MailingComponents/Multiselect.vue'
import MultiselectWA from '@/components/MailingComponents/MultiselectWA.vue'

const mailingStore = useMailingStore()
const basesStore = useBasesStore()

const { formData, getTypes } = storeToRefs(mailingStore)
const { bases } = storeToRefs(basesStore)

const emits = defineEmits(['next', 'prev'])

const selectedBases = ref([])

const date = ref(null)
const isModalOpen = ref(false)

const closeModal = () => {
  isModalOpen.value = false
}

const openModal = () => {
  isModalOpen.value = true
}

const updateDate = (data) => {
  date.value = `${data.selectedDay.toISODate()} ${data.time}:00`
}

const getWhatsAppBasesOptions = computed(() => {
  const infoBases = bases.value.map((element, index) => {
    return {
      name: element.name,
      id: element.id,
      count: element.checking_data?.whatsapp?.count,
      value: `data-${index}`
    }
  })
  return infoBases
})

const getCounter = computed(() =>
  selectedBases.value.length > 0 ? selectedBases.value[0].count : 0
)

watch(selectedBases, () => {
  mailingStore.formData.counter = getCounter.value
})
</script>

<template>
  <form class="mailing-form step 1" @submit.prevent>
    <div class="mailing-form__block">
      <h3>Базы для отправки и черные списки</h3>
      <div class="mailing-form__block-sub">
        <ul class="mailing-form__bases">
          <li>
            <div class="select-wrapper">
              <MultiselectWA
                v-model="selectedBases"
                :options="getWhatsAppBasesOptions"
                placeholder="Выберите базу для отправки"
              />
            </div>
          </li>
          <li></li>
        </ul>
      </div>
    </div>
    <div class="mailing-form__block">
      <h3>Текст сообщения</h3>
      <div class="mailing-form__block-sub"></div>
    </div>
    <div class="mailing-form__block-sub"></div>
    <div class="additional-steps"></div>
    <div class="mailing-form__block-sub mailing-form__test"></div>
    <div class="mailing-form__block send-date">
      <h3>Дата и время отправки</h3>
      <div class="date-editor">
        <input
          :value="date"
          type="text"
          autocomplete="off"
          placeholder="Выберите дату"
          class="input-date"
          readonly
          @click="openModal"
        />
        <span>
          <img src="/public/img/1.png" alt="" width="20" height="20" />
        </span>
      </div>
      <div class="popup" v-if="isModalOpen">
        <div class="popup-blur" @click="closeModal"></div>
        <Calendar @update-date="updateDate" @close-popup="closeModal"></Calendar>
      </div>
    </div>
    <div class="mailing-form__test mailing-form__block-sub"></div>
    <button class="mailing-btn" @click="emits('prev')">
      <div class="mailing-btn__arrow"></div>
      <span>Продолжить</span>
    </button>
    <div>{{ getWhatsAppBasesOptions }}</div>
  </form>
</template>

<style></style>
