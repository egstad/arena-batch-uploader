<template>
  <div>
    <n-input
      @input="onInput"
      type="password"
      show-password-on="click"
      :status="tokenValidationState"
      placeholder="Personal Access Token"
    />
  </div>
</template>

<script setup>
import { ref, defineExpose, watch } from "vue";
import { NInput } from "naive-ui";

const token = ref(null);
const tokenValidationState = ref("default");

const onInput = (newVal) => {
  token.value = newVal;
};

watch(token, (val) => {
  tokenValidationState.value = val.length !== 43 ? "warning" : "success";
});

defineExpose({
  token,
});
</script>

<style lang="scss" scoped></style>
