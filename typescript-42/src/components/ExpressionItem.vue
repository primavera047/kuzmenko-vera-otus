<script setup lang="ts">
import { useExpressionStore } from '@/stores/expression'

const expressionStore = useExpressionStore()

function isBlank(element: string): boolean {
  return element === 'x'
}
</script>

<template>
  <v-card variant="tonal">
    <v-card-item>
      <v-container>
        <v-row>
          <v-col :key="index" v-for="(part, index) in expressionStore.expression">
            <v-text-field
              variant="outlined"
              style="display: inline-block; width: 70px"
              v-model="expressionStore.answers[index]"
              v-if="isBlank(part)"
            ></v-text-field>
            <span style="display: inline-block; font-size: 30px; " v-else> {{ part }} </span>
          </v-col>
        </v-row>
      </v-container>
    </v-card-item>
  </v-card>
</template>

