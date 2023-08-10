<template>
  <input type="file" @input="onInput" accept="application/JSON" />
</template>

<script setup>
import { ref, toRaw } from "vue";

const jsonData = ref([]);
const emit = defineEmits(["fileSelected"]);
const reader = new FileReader();

reader.addEventListener("load", (ev) => {
  jsonData.value = JSON.parse(ev.target.result);
  emit("fileSelected", toRaw(jsonData.value));
});

const onInput = (ev) => {
  reader.readAsText(ev.target.files[0]);
};
</script>
