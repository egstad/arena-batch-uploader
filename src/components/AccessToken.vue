<template>
  <div>
    <n-input
      @input="onInput"
      type="password"
      show-password-on="click"
      :status="tokenValidationState"
      :default-value="token ? token : ''"
      placeholder="43 characters. Include hyphens."
      clearable
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeMount } from "vue";
import { NInput } from "naive-ui";

const token = ref(undefined);
const tokenFromLocalStorage = ref(undefined);
const tokenValidationState = ref("default");

const onInput = (newVal) => {
  token.value = newVal;
  localStorage.setItem("token", token.value);
};

watch(token, (val) => {
  if (!token.value) return;
  tokenValidationState.value = val.length !== 43 ? "warning" : "success";
});

defineExpose({
  token,
});

onBeforeMount(() => {
  if (localStorage.token) {
    tokenFromLocalStorage.value = localStorage.token;
    token.value = tokenFromLocalStorage.value;
  } else {
    // tokenFromLocalStorage.value = undefined;
    // token.value = undefined;
  }
});
</script>

<style lang="scss" scoped>
.n-input :deep(.n-base-clear) {
  margin-right: 0.4rem;
}
</style>
