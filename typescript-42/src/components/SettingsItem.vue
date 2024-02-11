<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings'

const settingsStore = useSettingsStore()

const operations: string[] = ['+', '-', '/', '*']

function onReset() {
  settingsStore.setDefault()
}
</script>

<template>
  <v-card>
    <template v-slot:title>Настройки</template>

    <v-card-text>Разрешенные операции:</v-card-text>
    <v-container>
      <v-row>
        <v-col v-for="(op, op_index) of operations" :key="op_index">
          <v-checkbox v-model="settingsStore.allowedOps" :value="op" :label="op"> </v-checkbox>
        </v-col>
      </v-row>
    </v-container>

    <v-card-item>
      <v-container>
        <v-text-field
          clearable
          label="Время раунда"
          variant="outlined"
          v-model="settingsStore.time"
        ></v-text-field>

        <v-text-field
          clearable
          label="Примеров в упражнении"
          variant="outlined"
          v-model="settingsStore.expCount"
        ></v-text-field>

        <v-text-field
          clearable
          label="Количество значений в выражении (минимум)"
          variant="outlined"
          v-model="settingsStore.minNumberCount"
        ></v-text-field>
        <v-text-field
          clearable
          label="Количество значений в выражении (максимум)"
          variant="outlined"
          v-model="settingsStore.maxNumberCount"
        ></v-text-field>
      </v-container>
    </v-card-item>
    <v-card-actions>
      <v-btn id="resetSettings" @click="onReset" variant="tonal">Сбросить</v-btn>
    </v-card-actions>
  </v-card>
</template>
