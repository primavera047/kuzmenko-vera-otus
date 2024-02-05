import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', () => {
  const time = ref(30);
  const expCount = ref(5);
  const minNumberCount = ref(2);
  const maxNumberCount = ref(5);
  const allowedOps = ref(['+', '-']);  

  function setDefault() {
    time.value = 30;
    expCount.value = 5;
    minNumberCount.value = 2;
    maxNumberCount.value = 5;
    allowedOps.value = ['+', '-'];
  }

  return { time, expCount, minNumberCount, maxNumberCount, allowedOps, setDefault }
})
