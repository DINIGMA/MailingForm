<script setup>
import { computed, onMounted, ref, toRefs, watch } from 'vue'
import { useMailingStore } from '@/stores/Mailing'
import WhatsAppChoose from '@/components/MailingComponents/WhatsAppChoose.vue'
import SelectSender from '@/components/MailingComponents/SelectSender.vue'
import { Field, ErrorMessage, useField, useForm } from 'vee-validate'
import { storeToRefs } from 'pinia'

const mailingStore = useMailingStore()

const emits = defineEmits(['next'])

const { formData, getTypes } = storeToRefs(mailingStore)

const isFocused = ref(false)

const touched = ref(false)

// const v$ = useVuelidate(rules, formData)

const handleBlurEvent = () => {
  touched.value = false
  isFocused.value = false
  // v$.value.mailingName.$touch()
}

const handleFocusEvent = () => {
  touched.value = true
  isFocused.value = true
  // handleFocus()
}
</script>

<template>
  <div class="mailing-form__block">
    <h3>Выбор названия и канала отправки</h3>
    <div class="mailing-form__block-sub">
      <div class="mailing-form__infoPanel">
        Задания на рассылку, а также правки по ним принимаются за день до старта
      </div>
      <Field
        name="mailingName"
        :validateOnMount="false"
        :validateOnInput="true"
        v-slot="{ field, errors }"
        ><div
          class="input-form"
          :class="{
            'input-form_active': isFocused,
            'input-form_value': formData.mailingName,
            'input-form_error': errors.length > 0
          }"
        >
          <input
            name="mailingName"
            type="text"
            @focus="handleFocusEvent()"
            @blur="handleBlurEvent()"
            autocomplete="off"
            v-bind="field"
            v-model="formData.mailingName"
            :placeholder="isFocused & !formData.mailingName ? 'Введите название' : ''"
          />
          <span>Название рассылки</span>
        </div>
        <div class="form__error">
          <ErrorMessage name="mailingName"></ErrorMessage>
        </div>
      </Field>

      <!-- <div>
        <input
          type="text"
          @focus="handleFocus()"
          @blur="handleBlur()"
          v-model="formData.mailingName"
          :placeholder="isFocused & !formData.mailingName ? 'Введите название' : ''"
        />
        <span>Название рассылки</span>
      </div> -->
      <!-- <div class="form__error">Введите название</div> -->
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
</template>

<style></style>
