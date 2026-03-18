<template>
  <div>
    <div style="display: flex">
      <n-select
        placeholder="Search channel..."
        v-model="search"
        @update:value="handleUpdate"
        :options="channels"
        filterable
        clearable
      />&nbsp;
      <n-button type="default" v-if="channel"
        ><a
          :href="`https://are.na/${user.user.user.slug}/${channel?.slug}`"
          target="_blank"
          style="text-decoration: none"
          >Visit Channel</a
        ></n-button
      >
    </div>

    <Transition>
      <template v-if="channel">
        <div class="channel-meta">
          <n-tag size="small">Privacy: {{ channel.status }}</n-tag>
          <n-tag size="small">
            Created
            <n-time :time="new Date(channel.created_at)" type="relative" />
          </n-tag>
          <n-tag size="small">{{ channel.follower_count }} followers</n-tag>
          <n-tag size="small">{{ channel.length }} blocks</n-tag>
          <n-tag size="small" type="error" v-if="channel['nsfw?']">NSFW</n-tag>
        </div>
      </template>
    </Transition>

    <div class="private-lookup" style="margin-top: 1rem">
      <p style="opacity: 0.5; margin-bottom: 0.5rem; font-size: 0.85em">
        Private channel? Enter its slug directly:
      </p>
      <div style="display: flex; gap: 0.5rem">
        <n-input
          v-model:value="privateSlugInput"
          placeholder="my-private-channel-slug"
          :status="privateSlugStatus"
          @keyup.enter="lookupPrivateChannel"
          clearable
        >
          <template #prefix>
            <span style="opacity: 0.5">are.na/</span>
          </template>
        </n-input>
        <n-button
          :disabled="!privateSlugInput || privateSlugLoading"
          :loading="privateSlugLoading"
          @click="lookupPrivateChannel"
        >
          Look up
        </n-button>
      </div>
      <p
        v-if="privateSlugError"
        style="color: var(--error); font-size: 0.85em; margin-top: 0.25rem"
      >
        {{ privateSlugError }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { getUserChannels, getChannel } from "../arena-api.js";
import { ref, onMounted } from "vue";
import { NSelect, NTag, NButton, NTime, NInput } from "naive-ui";

const user = defineProps(["user"]);
const channel = ref();
const channels = ref([]);
const isLoading = ref(true);

defineExpose({
  channel,
});

const channelsPerPage = 100;
const currentPage = ref(1);
const totalPages = ref(0);
const totalChannels = ref(0);

const fetchAllChannelsByUserID = (userID) => {
  isLoading.value = true;

  getUserChannels(userID, localStorage.token, {
    page: currentPage.value,
    per: channelsPerPage,
  })
    .then((response) => {
      if (currentPage.value === 1) setChannelAttributes(response.meta);

      response.data.forEach((ch) => {
        channels.value.push({
          label: ch.title,
          value: { ...ch },
        });
      });

      if (!response.meta.has_more_pages) {
        isLoading.value = false;
        return;
      } else {
        currentPage.value = response.meta.current_page + 1;
        fetchAllChannelsByUserID(userID);
      }
    })
    .catch((err) => console.log(err));
};

const setChannelAttributes = (meta) => {
  totalPages.value = meta.total_pages;
  totalChannels.value = meta.total_count;
};

onMounted(() => fetchAllChannelsByUserID(user.user.user.id));

const search = ref(undefined);

const handleUpdate = (newVal) => {
  channel.value = newVal;
  isLoading.value = false;
};

const privateSlugInput = ref('');
const privateSlugLoading = ref(false);
const privateSlugStatus = ref(undefined);
const privateSlugError = ref('');

const lookupPrivateChannel = () => {
  if (!privateSlugInput.value) return;
  privateSlugLoading.value = true;
  privateSlugError.value = '';
  privateSlugStatus.value = undefined;

  getChannel(privateSlugInput.value.trim(), localStorage.token)
    .then((ch) => {
      channel.value = ch;
      privateSlugStatus.value = 'success';

      const alreadyListed = channels.value.some((opt) => opt.value?.slug === ch.slug);
      if (!alreadyListed) {
        channels.value.unshift({ label: ch.title, value: { ...ch } });
        search.value = ch;
      }
    })
    .catch(() => {
      privateSlugStatus.value = 'error';
      privateSlugError.value = `Channel "${privateSlugInput.value}" not found or not accessible with your token.`;
    })
    .finally(() => {
      privateSlugLoading.value = false;
    });
};
</script>

<style scoped lang="scss">
.channel-meta {
  display: flex;
  flex-wrap: wrap;

  > * {
    margin-top: 0.5rem;
    margin-right: 0.5rem;
    display: inline-flex;
  }
}
</style>
