<template>
  <div>
    <n-input
      @input="onInput"
      type="password"
      show-password-on="click"
      placeholder="Personal Access Token"
    />
  </div>
</template>

<script setup>
import { ref, defineExpose } from "vue";
import { NInput } from "naive-ui";

const token = ref(null);

const onInput = (newVal) => {
  token.value = newVal;
};

defineExpose({
  token,
});
</script>

<style lang="scss" scoped></style>
