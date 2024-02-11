<script setup lang="ts">
import { useStatisticStore } from '@/stores/statistic'

const statisticStore = useStatisticStore()
</script>

<template>
  <v-card>
    <template v-slot:title> Статистика </template>
    <v-card-item>
      <v-table>
        <thead>
          <th class="text-left">Характеристика</th>
          <th class="text-left">Значение</th>
        </thead>
        <tbody>
          <tr>
            <td>Количество пройденных раундов:</td>
            <td>
              {{ statisticStore.allGamesCount }}
            </td>
          </tr>
          <tr>
            <td>Количество правильно решенных примеров:</td>
            <td>
              {{ statisticStore.allSolvedCount }} / {{ statisticStore.allPassedCount }}
            </td>
          </tr>
          <tr>
            <td>Процент правильных ответов:</td>
            <td>
              {{ statisticStore.successPercents }} %
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card-item>
    <v-card-actions>
      <v-btn id="resetStatistic" @click="statisticStore.reset" variant="tonal">Сбросить</v-btn>
    </v-card-actions>
  </v-card>
</template>
