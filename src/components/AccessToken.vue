<template>
  <div>
    <template v-if="!token">
      <n-button @click="connectOAuth" style="margin-bottom: 0.75rem">
        Connect with Are.na
      </n-button>
      <p style="opacity: 0.5; font-size: 0.85em; margin-bottom: 0.75rem">
        Or enter a
        <a
          href="https://www.are.na/settings/personal-access-tokens"
          target="_blank"
          style="color: inherit"
          >Personal Access Token</a
        >
        manually:
      </p>
    </template>

    <n-input
      @input="onInput"
      type="password"
      show-password-on="click"
      :status="tokenValidationState"
      :default-value="token ? token : ''"
      placeholder="Personal access token"
      clearable
    />
  </div>
</template>

<script setup>
import { ref, watch, onBeforeMount } from "vue";
import { NInput, NButton } from "naive-ui";
import { initiateOAuth } from "../arena-oauth.js";

const token = ref(undefined);
const tokenValidationState = ref("default");

const onInput = (newVal) => {
  token.value = newVal;
  localStorage.setItem("token", token.value);
};

watch(token, (val) => {
  if (!token.value) return;
  tokenValidationState.value = val.length > 0 ? "success" : "warning";
});

defineExpose({
  token,
});

onBeforeMount(() => {
  if (localStorage.token) {
    token.value = localStorage.token;
  }
});

const connectOAuth = () => initiateOAuth();
</script>

<style lang="scss" scoped>
.n-input :deep(.n-base-clear) {
  margin-right: 0.4rem;
}

a {
  text-decoration: underline;
  text-underline-offset: 2px;
}
</style>
