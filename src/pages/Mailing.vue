<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useMailingStore } from '@/stores/Mailing'
import { useBasesStore } from '@/stores/Bases'
import { storeToRefs } from 'pinia'
import { Form, Field, ErrorMessage, useForm, validate } from 'vee-validate'
import * as yup from 'yup'
import MailingFormStepOne from '@/components/MailingFormSteps/MailingFormStepOne.vue'
import MailingFormStepSecond from '@/components/MailingFormSteps/MailingFormStepSecond.vue'
import ChoosingChannel from '@/components/MailingComponents/ChoosingChannel.vue'
import WhatsAppForm from '@/components/MailingFormSteps/WhatsAppForm.vue'
import SmsForm from '@/components/MailingFormSteps/SmsForm.vue'

const mailingStore = useMailingStore()
const basesStore = useBasesStore()

const { formData, getTypes } = storeToRefs(mailingStore)

// const steps = [MailingFormStepOne, MailingFormStepSecond]

// const currentStepComponent = computed(() => steps[currentStep.value - 1])

const currentStep = ref(1)
const isFocused = ref(false)
const isFormValid = ref(false)

const formRef = ref(null)

const nextStep = async (validate) => {
  isFormValid.value = await validate()
  if (currentStep.value < 2 && isFormValid.value.valid) {
    currentStep.value++
    // mailingStore.updateBases()
  }
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const schemaStepOne = yup.object({
  mailingName: yup.string().required('Введите название')
})

const schemaStepTwo = yup.object({
  myInputData: yup.string().required('Введите название')
})

const getSchema = computed(() => {
  if (currentStep.value == 1 && formData.value.mailingChannel == 'whatsApp') {
    console.log(1111)
    return schemaStepOne
  }
  if (currentStep.value == 2 && formData.value.mailingChannel == 'whatsApp') {
    console.log(222)
    return schemaStepTwo
  }
})

onMounted(async () => {
  await Promise.all([mailingStore.getTypeMailing(), basesStore.getWatsappBases()])
})
</script>

<!-- Сделать внутри формы компоненты для wa-form и sms-form -->

<template>
  <div class="container">
    <div class="mailing-page__create">
      <div class="mailing-page__left">
        <section class="mailing-form-section">
          <div class="block-description">
            <h2 class="mailing-title">Создать новую рассылку</h2>
            <div class="mailing-form__steps">
              <p>{{ currentStep }} шаг из 3</p>
              <div class="mailing-form__steps-dots">
                <span
                  class="dot"
                  v-for="(item, idx) of 3"
                  :key="idx"
                  :class="[{ active: currentStep == idx + 1 }]"
                ></span>
              </div>
            </div>
          </div>
          <div style="width: 100%">
            <!-- <MailingFormStepOne></MailingFormStepOne> -->
            <!-- <component :is="currentStepComponent" @next="nextStep" @prev="prevStep"></component> -->
            <Form
              class="mailing-form step 1"
              @submit.prevent
              action="#"
              :validationSchema="getSchema"
              v-slot="{ validate, meta }"
            >
              <ChoosingChannel v-if="currentStep == 1"></ChoosingChannel>
              <WhatsAppForm
                :currentStep="currentStep"
                v-if="formData.mailingChannel == 'whatsApp'"
              ></WhatsAppForm>
              <SmsForm v-if="formData.mailingChannel == 'sms'"></SmsForm>
              <button
                class="mailing-btn"
                type="button"
                @click="nextStep(validate)"
                :class="[{ 'mailing-btn_disabled': !meta.valid }]"
                v-if="currentStep == 1"
              >
                <div class="mailing-btn__arrow"></div>
                <span>Продолжить</span>
              </button>
            </Form>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<!-- <div style="width: 100%">
                <div class="mailing-form__block-sub">
                  <WhatsAppChoose v-if="formData.mailingChannel == 'whatsApp'"></WhatsAppChoose>
                  <SelectSender v-if="formData.mailingChannel == 'sms'"></SelectSender>
                </div>
              </div> -->

<!-- <div class="choose">
      <div class="choose-items">
        <div
          class="choose-item"
          v-for="(item, index) in getTypes"
          :key="index"
          :class="{
            active: item.key == formData.activeTypes,
            disabled: item.active !== true
          }"
        >
          <div class="choose-item__content">
            <img :src="`/public/img/mailing/${item.key}.png`" alt="" />
            <div class="choose-item__text">
              <h3>{{ item.title }}</h3>
              <p>
                Минимальный объем базы - <b>{{ item.min_count }}</b>
                <br />
                Мин. цена за сообщение - <b>{{ item.price }} р.</b>
              </p>
            </div>
            <input
              type="radio"
              name="tariffs"
              :id="item.key"
              :value="item.key"
              v-model="formData.activeTypes"
            />
            <label :for="item.key"></label>
          </div>
          <div v-if="item.active !== true" class="disabled">Временно недоступно</div>
        </div>
      </div>
    </div> -->
<!-- <button
                class="mailing-btn"
                @click="nextStep()"
                :class="[{ 'mailing-btn_disabled': v$.$silentErrors.length > 0 }]"
              >
                <div class="mailing-btn__arrow"></div>
                <span>Продолжить</span>
              </button> -->

<style></style>
