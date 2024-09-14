<script setup>
import { ref } from 'vue'
import { useMailingStore } from '@/stores/Mailing'
import { storeToRefs } from 'pinia'

const mailingStore = useMailingStore()

const { whatsAppFormData, getTypes } = storeToRefs(mailingStore)
</script>

<template>
  <div class="choose">
    <div class="choose-items">
      <div
        class="choose-item"
        v-for="(item, index) in getTypes"
        :key="index"
        :class="{
          active: item.key == whatsAppFormData.activeTypes,
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
            v-model="whatsAppFormData.activeTypes"
          />
          <label :for="item.key"></label>
        </div>
        <div v-if="item.active !== true" class="disabled">Временно недоступно</div>
      </div>
    </div>
  </div>
</template>

<style></style>
