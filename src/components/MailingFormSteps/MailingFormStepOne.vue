<script setup>
import { onMounted, ref, toRefs, watch } from 'vue'
import { useMailingStore } from '@/stores/Mailing'
import WhatsAppChoose from '@/components/MailingComponents/WhatsAppChoose.vue'
import SelectSender from '@/components/MailingComponents/SelectSender.vue'
import useVuelidate from '@vuelidate/core'
import { required, email, minLength, numeric } from '@vuelidate/validators'
import { storeToRefs } from 'pinia'

const mailingStore = useMailingStore()

const emits = defineEmits(['next'])

const { formData, getTypes } = storeToRefs(mailingStore)

const isFocused = ref(false)

const rules = {
  mailingName: { required }
}

const v$ = useVuelidate(rules, formData)

const handleBlur = () => {
  isFocused.value = false
  v$.value.mailingName.$touch()
}

const handleFocus = () => {
  isFocused.value = true
  console.log(formData.value)
}

const nextStep = async () => {
  const result = await v$.value.$validate()
  if (result) {
    emits('next')
  }
}
</script>

<template>
  <form class="mailing-form step 1" @submit.prevent action="#">
    <div class="mailing-form__block">
      <h3>Выбор названия и канала отправки</h3>
      <div class="mailing-form__block-sub">
        <div class="mailing-form__infoPanel">
          Задания на рассылку, а также правки по ним принимаются за день до старта
        </div>
        <div
          class="input-form"
          :class="{
            'input-form_active': isFocused,
            'input-form_value': formData.mailingName,
            'input-form_error': v$.mailingName.$error
          }"
        >
          <input
            type="text"
            @focus="handleFocus()"
            @blur="handleBlur()"
            v-model="formData.mailingName"
            :placeholder="isFocused & !formData.mailingName ? 'Введите название' : ''"
          />
          <span>Название рассылки</span>
        </div>
        <div v-if="v$.mailingName.$error" class="form__error">Введите название</div>
      </div>
      <div class="mailing-form__block-sub">
        <h3>Канал отправки</h3>
        <div class="channels__wrapper">
          <div class="channels__item">
            <input
              type="radio"
              name="channels"
              value="whatsApp"
              @change="mailingStore.updateBases()"
              id="whatsAppChannel"
              checked
              v-model="formData.mailingChannel"
            />
            <label for="whatsAppChannel">WhatsApp</label>
          </div>
          <div class="channels__item">
            <input
              type="radio"
              name="channels"
              value="sms"
              @change="mailingStore.updateBases()"
              id="smsChannel"
              v-model="formData.mailingChannel"
            />
            <label for="smsChannel">SMS</label>
          </div>
          <div class="channels__item">
            <input
              type="radio"
              name="channels"
              value="telega"
              @change="mailingStore.updateBases()"
              id="telegaChannel"
              v-model="formData.mailingChannel"
            />
            <label for="telegaChannel">Telegram</label>
          </div>
        </div>
      </div>
    </div>
    <div style="width: 100%">
      <div class="mailing-form__block-sub">
        <WhatsAppChoose v-if="formData.mailingChannel == 'whatsApp'"></WhatsAppChoose>
        <SelectSender v-if="formData.mailingChannel == 'sms'"></SelectSender>
      </div>
    </div>

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
    <button
      class="mailing-btn"
      @click="nextStep()"
      :class="[{ 'mailing-btn_disabled': v$.$silentErrors.length > 0 }]"
    >
      <div class="mailing-btn__arrow"></div>
      <span>Продолжить</span>
    </button>
  </form>
</template>

<style></style>
