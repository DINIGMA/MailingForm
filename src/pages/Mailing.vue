<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useMailingStore } from '@/stores/Mailing'
import { useBasesStore } from '@/stores/Bases'
import { storeToRefs } from 'pinia'
import MailingFormStepOne from '@/components/MailingFormSteps/MailingFormStepOne.vue'
import MailingFormStepSecond from '@/components/MailingFormSteps/MailingFormStepSecond.vue'

const mailingStore = useMailingStore()
const basesStore = useBasesStore()

const { formData, getTypes } = storeToRefs(mailingStore)

const steps = [MailingFormStepOne, MailingFormStepSecond]

const currentStepComponent = computed(() => steps[currentStep.value - 1])

const currentStep = ref(1)
const isFocused = ref(false)

const nextStep = () => {
  if (currentStep.value < steps.length) {
    currentStep.value++
    // mailingStore.updateBases()
  }
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

onMounted(async () => {
  await Promise.all([mailingStore.getTypeMailing(), basesStore.getWatsappBases()])
})
</script>

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
            <component :is="currentStepComponent" @next="nextStep" @prev="prevStep"></component>

            <!-- <form class="mailing-form step 1" action="">
              <div class="mailing-form__block">
                <h3>Выбор названия и канала отправки</h3>
                <div class="mailing-form__block-sub">
                  <div class="mailing-form__infoPanel">
                    Задания на рассылку, а также правки по ним принимаются за день до старта
                  </div>
                  <div
                    class="input-form"
                    :class="{ 'input-form_active': isFocused, 'input-form_value': mailingName }"
                  >
                    <input
                      type="text"
                      @focus="handleFocus()"
                      @blur="handleBlur()"
                      v-model="mailingName"
                      :placeholder="isFocused & !mailingName ? 'Введите название' : ''"
                    />
                    <span>Название рассылки</span>
                  </div>
                </div>
                <div class="mailing-form__block-sub">
                  <h3>Канал отправки</h3>
                  <div class="channels__wrapper">
                    <div class="channels__item">
                      <input
                        type="radio"
                        name="channels"
                        value="whatsapp"
                        id="whatsAppChannel"
                        v-model="mailingChannel"
                        checked
                      />
                      <label for="whatsAppChannel">WhatsApp</label>
                    </div>
                    <div class="channels__item">
                      <input
                        type="radio"
                        name="channels"
                        value="sms"
                        id="smsChannel"
                        v-model="mailingChannel"
                      />
                      <label for="smsChannel">SMS</label>
                    </div>
                    <div class="channels__item">
                      <input
                        type="radio"
                        name="channels"
                        value="telega"
                        id="telegaChannel"
                        v-model="mailingChannel"
                      />
                      <label for="telegaChannel">Telegram</label>
                    </div>
                  </div>
                </div>
              </div>
              <div class="choose">
                <div class="choose-items">
                  <div
                    class="choose-item"
                    v-for="(item, index) in getTypes"
                    :key="index"
                    :class="{ active: item.key == activeTypes, disabled: item.active !== true }"
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
                        v-model="activeTypes"
                      />
                      <label :for="item.key"></label>
                    </div>
                    <div v-if="item.active !== true" class="disabled">Временно недоступно</div>
                  </div>
                </div>
              </div>
              <button class="mailing-btn">
                <div class="mailing-btn__arrow"></div>
                <span>Продолжить</span>
              </button>
            </form> -->
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style></style>
