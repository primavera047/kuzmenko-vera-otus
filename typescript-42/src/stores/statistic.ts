import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useStatisticStore = defineStore('statistic', () => {
  const allGamesCount = ref(0);
  const allSolvedCount = ref(0);
  const allPassedCount = ref(0);

  const successPercents = computed(() => (allPassedCount.value !== 0) ? allSolvedCount.value * 100 / allPassedCount.value : 0);

  function addGame(): void {
    allGamesCount.value++;
  }

  function addAnswer(corret: boolean): void {
    allPassedCount.value++;

    if (corret) {
        allSolvedCount.value++;
    }
  }

  function reset(): void {
    allGamesCount.value = 0;
    allSolvedCount.value = 0;
    allPassedCount.value = 0;
  }

  return { allGamesCount, allSolvedCount, allPassedCount, successPercents, addGame, addAnswer, reset }
})
