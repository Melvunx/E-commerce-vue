<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { ref } from "vue";

const count = ref(0);
const incrementValue = () => {
  count.value++;
};
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-16">
    <h1 class="text-6xl" :class="{ italic: count > 5 }">
      Compteur : {{ count }}
    </h1>
    <Button class="text-xl" @click="incrementValue">Incrémenter</Button>
  </div>
</template>
