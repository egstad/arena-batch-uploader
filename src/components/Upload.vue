<template>
  <div>
    <button @click="addShit">Test!</button>
    <span v-if="payload.jsonData"
      >To Go: {{ payload.jsonData.length - downloaded }}</span
    >
  </div>
</template>

<script setup>
import { ref, toRaw } from "vue";
import Arena from "are.na";

const arena = new Arena({ accessToken: import.meta.env.VITE_ARENA_TOKEN });
const downloaded = ref(0);
const payload = defineProps(["json-data"]);

const addShit = () => {
  const blocks = toRaw(payload.jsonData);

  blocks.forEach((block) => {
    arena
      .block()
      .create("testing-xgv_oh8r0pq", block)
      .then((block) => {
        console.log(block.title + " has been added!");
        downloaded.value++;
      })
      .catch(console.error);
  });
};
</script>
