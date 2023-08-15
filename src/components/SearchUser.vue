<template>
  <div>
    <div style="display: flex">
      <template v-if="!user">
        <n-input
          placeholder="john-doe"
          :status="userValidityStatus"
          :on-input="onUserInput"
          :on-clear="onUserClear"
          @keyup.enter="checkIfUserExists"
          style="margin-right: 0.5rem"
          clearable
        >
          <template #prefix>
            <span style="opacity: 0.5; margin-right: -0.125rem"
              >are.na/</span
            ></template
          ></n-input
        >

        <n-button
          v-if="userInput"
          :type="userValidityStatus"
          @click="checkIfUserExists"
          >Search</n-button
        >
      </template>
      <template v-else>
        <n-input
          placeholder="john-doe"
          :status="userValidityStatus"
          :on-input="onUserInput"
          :on-clear="onUserClear"
          @keyup.enter="checkIfUserExists"
          @clear="clearUser"
          style="margin-right: 0.5rem"
          :default-value="user.slug"
          clearable
        >
          <template #prefix>
            <span style="opacity: 0.5; margin-right: -0.125rem"
              >are.na/</span
            ></template
          ></n-input
        >

        <!-- <n-button type="error" secondary @click="clearUser">Remove</n-button> -->
      </template>
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
import { ref, computed, onMounted } from "vue";
import { NButton, NInput, NAvatar, NTag, NTime } from "naive-ui";
import Arena from "are.na";

const user = ref(undefined);
const userInput = ref(undefined);
const userIsValid = ref(undefined);
const userIsLoading = ref(false);
const errorMessage = ref(null);

defineExpose({
  user,
});

onMounted(() => {
  if (!localStorage.user) return;
  user.value = JSON.parse(localStorage.user);
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
  const arena = new Arena();

  arena
    .user(userInput.value)
    .get()
    .then((userData) => {
      userIsValid.value = true;
      user.value = userData;
      userIsLoading.value = false;
      localStorage.setItem("user", JSON.stringify(userData));
    })
    .catch((err) => {
      user.value = undefined;
      userIsLoading.value = false;
      userIsValid.value = false;
      errorMessage.value = err;
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

  return userIsValid.value === true ? "default" : "error";

  // return userIsValid.value ? undefined : "error";
});

const clearUser = () => {
  localStorage.removeItem("user");
  user.value = undefined;
};
</script>

<style scoped lang="scss">
.user-meta {
  display: flex;
  flex-wrap: wrap;

  > * {
    margin-top: 0.5rem;
    margin-right: 0.5rem;
    display: inline-flex;
  }
}
</style>
