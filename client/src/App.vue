<script setup lang="ts">
import HelloWorld from "./components/HelloWorld.vue";
import { Button } from "@/components/ui/button";
</script>

<template>
  <div class="flex items-center justify-center">
    <Button>Click me</Button>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template>
