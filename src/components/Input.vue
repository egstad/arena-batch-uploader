<template>
  <input type="text" @input="onInput" />
</template>

<script setup>
const emit = defineEmits(["onInput"]);

const onInput = (ev) => {
  const value = ev.target.value;
  emit("onInput", value);
};
</script>

<style lang="scss" scoped></style>
