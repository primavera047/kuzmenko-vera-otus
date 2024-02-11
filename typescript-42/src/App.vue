<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

const drawer = ref(false);
</script>

<script lang="ts">
  export default {
    data: () => ({ drawer: false }),
  }
</script>

<template>
  <v-app>
    <v-toolbar title="Главная">     
      <v-navigation-drawer v-model="drawer">
        <v-list-item title="" subtitle=""></v-list-item>
        <v-divider></v-divider>
        <RouterLink to="/"><v-list-item link title="Главная"></v-list-item></RouterLink>
        <RouterLink to="/game"><v-list-item link title="Игра"></v-list-item></RouterLink>
      </v-navigation-drawer>

      <v-app-bar>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

        <v-app-bar-title>Устный счет</v-app-bar-title>
      </v-app-bar>
    </v-toolbar>

    <v-main>
      <RouterView></RouterView>
    </v-main>
  </v-app>
</template>

<style scoped></style>
