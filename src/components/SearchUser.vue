<template>
  <div>
    <div style="display: flex">
      <n-input-group>
        <n-input
          autofocus
          placeholder="john-doe"
          :status="userValidityStatus"
          :on-input="onUserInput"
          :on-clear="onUserClear"
          @keyup.enter="checkIfUserExists"
          clearable
        >
          <template #prefix>
            <span style="opacity: 0.5; margin-right: -0.125rem"
              >are.na/</span
            ></template
          ></n-input
        >
        <n-button :type="userValidityStatus" @click="checkIfUserExists"
          >Search</n-button
        >
      </n-input-group>
    </div>

    <div v-if="user" class="user-meta">
      <n-avatar
        v-if="!user.avatar.includes('gravatar')"
        :src="user.avatar"
        size="tiny"
        lazy
      />
      <n-tag size="small" v-if="user.is_premium">Premium User</n-tag>
      <n-tag size="small">{{ user.channel_count }} channels</n-tag>
      <n-tag size="small">
        Registered
        <n-time :time="new Date(user.created_at)" type="relative" />
      </n-tag>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import {
  NButton,
  NInput,
  NAvatar,
  NTag,
  NTime,
  NInputGroup,
  NInputGroupLabel,
} from "naive-ui";
import Arena from "are.na";

const user = ref(null);
const userInput = ref(undefined);
const userIsValid = ref(undefined);
const userIsLoading = ref(false);

defineExpose({
  user,
});

const onUserInput = (userName) => {
  userIsValid.value = undefined;
  userInput.value = userName;
};

const onUserClear = (ev) => {
  userIsValid.value = undefined;
  userInput.value = undefined;
  user.value = undefined;
};

const checkIfUserExists = () => {
  userIsLoading.value = true;
  const arena = new Arena({ accessToken: import.meta.env.VITE_ARENA_TOKEN });

  arena
    .user(userInput.value)
    .get()
    .then((userData) => {
      userIsValid.value = true;
      user.value = userData;
      userIsLoading.value = false;
    })
    .catch((err) => {
      userIsLoading.value = false;
      userIsValid.value = false;
      alert(err);
    });
};

const userValidityStatus = computed(() => {
  // no text? cool. won't hold that against you.
  if (!userInput.value) {
    userIsValid.value = undefined;
    return "default";
  }

  // in case they haven't submitted anything yet.
  if (userIsValid.value === undefined) return undefined;

  return userIsValid.value === true ? "success" : "error";

  // return userIsValid.value ? undefined : "error";
});
</script>

<style scoped lang="scss">
.user-meta {
  display: flex;
  margin-top: 0.5rem;

  > * {
    margin-right: 0.5rem;
  }
}
</style>
