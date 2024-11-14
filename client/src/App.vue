<script setup lang="ts">
import HelloWorld from "./components/HelloWorld.vue";
import { Button } from '@/components/ui/button'
</script>

<template>
  <div>
    <Button variant="ghost">Click me</Button>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template>
