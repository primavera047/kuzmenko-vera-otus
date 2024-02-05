import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useExpressionStore = defineStore('expression', () => {
  const expression = ref(['']);
  const answers = ref([]);

  function newExpression(newExp: string[]): void {
    expression.value = newExp;
    answers.value = [];
  }

  return { expression, answers, newExpression };
})
