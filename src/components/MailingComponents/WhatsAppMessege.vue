<script setup>
import { onMounted, ref, toRefs, computed, provide, watch, inject } from 'vue'
import Calendar from '../Calendar/Calendar.vue'
import { useMailingStore } from '@/stores/Mailing'
import { useBasesStore } from '@/stores/Bases'
import { storeToRefs } from 'pinia'
import { Field, ErrorMessage, useField, useForm } from 'vee-validate'
import Multiselect from '../MailingComponents/Multiselect.vue'
import ButtonAppend from '@/components/UI-components/ButtonAppend.vue'
import MultiselectWA from '@/components/MailingComponents/MultiselectWA.vue'
import Textarea from '../UI-components/Textarea.vue'

const mailingStore = useMailingStore()
const basesStore = useBasesStore()

const { formData, getTypes } = storeToRefs(mailingStore)
const { bases } = storeToRefs(basesStore)

const selectedBases = ref([])

// const data = ref('')

const date = ref(null)

const isModalOpen = ref(false)

const textareaData = ref('')

const prev = inject('prev')

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
  <div class="mailing-form__block">
    <h3>Базы для отправки и черные списки</h3>
    <div class="mailing-form__block-sub">
      <ul class="mailing-form__bases">
        <li>
          <div class="select-wrapper">
            <MultiselectWA
              v-model="selectedBases"
              :options="getWhatsAppBasesOptions"
              :emptyText="'Нет баз'"
              placeholder="Выберите базу для отправки"
            />
          </div>
          <div class="button-wrapper button-wrapper--text">
            <ButtonAppend :text="'Загрузить новую базу'"></ButtonAppend>
          </div>
        </li>
        <li>
          <div class="select-wrapper">
            <MultiselectWA
              :options="[]"
              :emptyText="'Нет баз,проверенных на наличие мессенджера'"
              placeholder="Выберите базу для отправки"
            />
          </div>
          <div class="button-wrapper button-wrapper--text">
            <ButtonAppend :text="'Загрузить черный список'"></ButtonAppend>
          </div>
        </li>
      </ul>
    </div>
  </div>
  <div class="mailing-form__block">
    <h3>Текст сообщения</h3>
    <div class="mailing-form__block-sub">
      <p class="mailing-form__message-length">
        <span>Максимальное количество символов: {{ 900 }}</span
        ><br /><span>Символов: {{ textareaData.length }}</span>
      </p>
      <div class="textarea-wrapper">
        <Field
          name="messageText"
          :validateOnMount="false"
          :validateOnInput="true"
          v-slot="{ field, errors }"
          ><Textarea v-bind="field" :errors="errors" v-model="formData.message"></Textarea>
          <div class="form__error">
            <ErrorMessage name="messageText"></ErrorMessage></div
        ></Field>
      </div>
    </div>
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
  <div class="mailing-form__buttons">
    <button type="button" class="mailing-btn__prev" @click="prev">
      <div class="mailing-btn__prev-arrow"></div>
      <span>Назад</span>
    </button>
    <button type="button" class="mailing-btn__next">
      <div class="mailing-btn__arrow"></div>
      <span>Продолжить</span>
    </button>
  </div>

  <!-- <Field
    name="myInputData"
    v-model="data"
    :validateOnMount="false"
    :validateOnInput="true"
    v-slot="{ field }"
  >
    <MyInput name="myInputData" v-bind="field"></MyInput>
    <ErrorMessage name="myInputData"></ErrorMessage>
  </Field> -->
</template>

<style></style>
