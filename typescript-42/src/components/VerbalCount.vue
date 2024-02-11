<script setup lang="ts">
import Timer from '@/components/TimerItem.vue'
import Expression from '@/components/ExpressionItem.vue'
import { useSettingsStore } from '@/stores/settings'
import { useExpressionStore } from '@/stores/expression'
import { ref } from 'vue'
import { Parser } from 'expr-eval'
import { useStatisticStore } from '@/stores/statistic'

const settingsStore = useSettingsStore()
const expressionStore = useExpressionStore()

let generatedExp = undefined

while (generatedExp === undefined) {
  generatedExp = generateExpression()
}

expressionStore.newExpression(generatedExp)

const statisticStore = useStatisticStore()

const showGame = ref(true)
const isTimeout = ref(false)
const showDialog = ref(false)
const showAnswerResult = ref(0);

const currentEx = ref(1)

const timeForGame = ref(settingsStore.time)
const stopTimer = ref(false)
const startTimer = ref(0)

function onGameEnd() {
  showDialog.value = true

  showGame.value = false
  stopTimer.value = true
  currentEx.value = 1
  statisticStore.addGame()
}

function onTimeLeft() {
  isTimeout.value = true

  onGameEnd()
}

function onAnswerResult(result: boolean): void {
  if (result) {
    showAnswerResult.value = 1;
  }
  else {
    showAnswerResult.value = 2;
  }

  setTimeout(() => { showAnswerResult.value = 0; }, 2000);
}

function randomInt(min: number, max: number): number {
  if (min === max) {
    return min
  } else if (min > max) {
    return max
  } else {
    const minCeiled = Math.ceil(min)
    const maxFloored = Math.floor(max)

    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled)
  }
}

function randomSequence<T>(allowedElements: T[], length: number, blacklist: T[] = []): T[] {
  let result: T[] = []

  while (length !== 0) {
    const randomIndex = randomInt(0, allowedElements.length - 1)
    const candidate = allowedElements[randomIndex]

    if (blacklist.length === 0 || blacklist.findIndex((element) => element === candidate) === -1) {
      result.push(candidate)

      --length
    }
  }

  return result
}

function expressionToString(
  numbers: number[],
  operators: string[],
  blanks: number[] = []
): string[] {
  let numbersWithBlanks: string[] = numbers.map((number) => {
    return `${number}`
  })
  let operatorsWithBlanks = operators

  for (const index of blanks) {
    if (index % 2 === 1) {
      operatorsWithBlanks[Math.round(index / 2) - (index % 2)] = 'x'
    } else {
      numbersWithBlanks[index / 2] = 'x'
    }
  }

  let exprString: string[] = []

  exprString.push(`${numbersWithBlanks[0]}`)

  for (let i = 1; i < numbersWithBlanks.length; i++) {
    exprString.push(`${operatorsWithBlanks[i - 1]}`)
    exprString.push(`${numbersWithBlanks[i]}`)
  }

  return exprString
}

function solveStringExpression(stringExpression: string[]): number | undefined {
  const solver = new Parser()

  try {
    return Math.ceil(solver.parse(stringExpression.join('')).evaluate())
  } catch {
    onPass()

    return undefined
  }
}

function solveExpression(numbers: number[], operators: string[]): number | undefined {
  const stringExpression = expressionToString(numbers, operators)

  return solveStringExpression(stringExpression)
}

function generateExpression(): string[] | undefined {
  let numberCount = randomInt(settingsStore.minNumberCount, settingsStore.maxNumberCount)
  let numbers = randomSequence([...Array(99).keys()], numberCount)
  let operators = randomSequence(settingsStore.allowedOps, numberCount - 1)
  const answer = solveExpression(numbers, operators)

  if (answer !== undefined) {
    numbers.push(answer)
    operators.push('=')

    const countOfBlanks = randomInt(1, Math.ceil(numberCount / 3))
    const blanks = randomSequence([...Array(numberCount * 2 + 1).keys()], countOfBlanks, [
      2 * numbers.length - 3
    ])

    return expressionToString(numbers, operators, blanks)
  }

  return undefined
}

function onAnswer() {
  for (const [index, part] of expressionStore.expression.entries()) {
    if (part === 'x') {
      expressionStore.expression[index] = expressionStore.answers[index]
    }
  }

  const newExpression = expressionStore.expression.slice(0, expressionStore.expression.length - 2)
  const expectedAnswer = parseInt(expressionStore.expression[expressionStore.expression.length - 1])
  const gotAnswer = solveStringExpression(newExpression)

  if (gotAnswer === expectedAnswer) {
    statisticStore.addAnswer(true);
    onAnswerResult(true);
  } else {
    statisticStore.addAnswer(false);
    onAnswerResult(false);
  }

  if (currentEx.value === settingsStore.expCount) {
    onGameEnd()
  } else {
    ++currentEx.value

    let generatedExp = undefined

    while (generatedExp === undefined) {
      generatedExp = generateExpression()
    }

    expressionStore.newExpression(generatedExp)
  }
}

function onPass() {
  let generatedExp = undefined

  while (generatedExp === undefined) {
    generatedExp = generateExpression()
  }

  expressionStore.newExpression(generatedExp)
}

function onNewGame() {
  let generatedExp = undefined

  while (generatedExp === undefined) {
    generatedExp = generateExpression()
  }

  expressionStore.newExpression(generatedExp)

  showGame.value = true
  isTimeout.value = false
  currentEx.value = 1
  timeForGame.value = settingsStore.time
  stopTimer.value = false
  startTimer.value++
}
</script>

<template>
  <v-container>
    <v-card>
      <v-container>
      <v-card-title> Игра </v-card-title>

      <v-card-item>
        <Timer
          @time-left="onTimeLeft"
          :key="startTimer"
          :duration="timeForGame"
          v-model="stopTimer"
        ></Timer>
      </v-card-item>

      <v-card-item id="currentNumber" v-if="showGame">
        {{ currentEx }} / {{ settingsStore.expCount }}
      </v-card-item>

      <v-card-item v-if="showGame">
        <Expression></Expression>
      </v-card-item>

      <v-card-actions id="answer" v-if="showGame">
        <v-btn type="button" @click="onAnswer">Ответ</v-btn>
        <v-btn type="button" @click="onPass">Пропустить</v-btn>
      </v-card-actions>

      <v-card-text v-if="showAnswerResult === 1"> Правильный ответ! </v-card-text>

      <v-card-text v-if="showAnswerResult === 2"> Ответ не правильный </v-card-text>

      <v-card-text v-if="!showGame && isTimeout"> Время вышло </v-card-text>

      <v-card-text v-if="!showGame && !isTimeout"> Конец раунда </v-card-text>         

      <v-card-actions v-if="!showGame">
        <v-btn type="button" @click="onNewGame">Начать сначала</v-btn>
      </v-card-actions>

      <v-card-subtitle>При делении значение округляется в большую сторону</v-card-subtitle>      
    </v-container>
    </v-card>
  </v-container>
  <v-dialog v-model="showDialog" width="30%">
    <v-card title="Игра окончена">
      <v-card-text v-if="!showGame && isTimeout">
        Закончилось время, отведенное на решение задач
      </v-card-text>

      <v-card-text v-if="!showGame && !isTimeout"> Все задачи решены! </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn text="Закрыть" @click="showDialog = false"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
