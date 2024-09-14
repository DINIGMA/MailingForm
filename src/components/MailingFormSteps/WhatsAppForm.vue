<script setup>
import WhatsAppChoose from '@/components/MailingComponents/WhatsAppChoose.vue'
import WhatsAppMessege from '../MailingComponents/WhatsAppMessege.vue'

defineProps({
  currentStep: Number
})
</script>

<template>
  <div class="wa-form">
    <div class="mailing-form__block-sub" v-if="currentStep == 1">
      <WhatsAppChoose></WhatsAppChoose>
    </div>
    <div>
      <WhatsAppMessege v-if="currentStep == 2"></WhatsAppMessege>
    </div>
  </div>
</template>

<style></style>
