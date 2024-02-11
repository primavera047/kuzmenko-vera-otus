<script setup lang="ts">
import { watch, ref, type ModelRef } from 'vue'

const emit = defineEmits(['time-left'])
const props = defineProps(['duration'])
const timeLeft = ref(props.duration)

const stopTimer: ModelRef<boolean | undefined, string> = defineModel()

const intervalRef = setInterval(() => {
  if (timeLeft.value !== undefined) {
    timeLeft.value--
  }
}, 1000)

watch(timeLeft, () => {
  if (timeLeft.value === 0) {
    clearInterval(intervalRef)
    emit('time-left')
  } else if (stopTimer.value!) {
    clearInterval(intervalRef)
  }
})

function printTime(timeLeft: number): string {
  let hours = 0
  let minutes = 0
  let seconds = 0

  if (timeLeft > 3599) {
    const left = timeLeft % 3600
    hours = (timeLeft - left) / 3600
    timeLeft = left
  }

  if (timeLeft > 60) {
    const left = timeLeft % 60
    minutes = (timeLeft - left) / 60
    timeLeft = left
  }

  seconds = timeLeft

  let result = ''
  result += hours > 0 ? (hours > 9 ? `${hours}:` : `0${hours}:`) : ''
  result += minutes > 9 ? `${minutes}:` : `0${minutes}:`
  result += seconds > 9 ? `${seconds}` : `0${seconds}`
  return result
}
</script>

<template>
  <div id="time">
    <span>{{ printTime(timeLeft) }}</span>
  </div>
</template>
