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
  </div>
</template>

<script setup>
import Arena from "are.na";
import { ref, onMounted } from "vue";
import { NSelect, NTag, NButton, NTime } from "naive-ui";

const user = defineProps(["user"]);
const channel = ref();
const channels = ref([]);
const isLoading = ref(true);

defineExpose({
  channel,
});

const channelsPerPage = 10;
const currentPage = ref(1);
const totalPages = ref(0);
const totalChannels = ref(0);
const arena = new Arena({ accessToken: localStorage.token });

const fetchAllChannelsByUserID = (userID) => {
  isLoading.value = true;

  arena
    .user(userID)
    .channels({ page: currentPage.value, per: channelsPerPage })
    .then((contents) => {
      // first time through? let's catch some details
      if (currentPage.value === 1) setChannelAttributes(contents.attrs);

      contents.map((channel, index) => {
        channels.value.push({
          label: channel.title,
          // this is the bitch that causes errors
          value: { ...channel },
          // naive-ui wants this to be a string.
          // could do this and thins parse as json later...
          // value: JSON.stringify({ ...channel }),
        });
      });

      if (currentPage.value === totalPages.value || totalPages.value === 0) {
        isLoading.value = false;
        return;
      } else {
        currentPage.value = contents.attrs.current_page + 1;
        fetchAllChannelsByUserID(userID);
      }
    })
    .catch((err) => console.log(err));
};

const setChannelAttributes = (attrs) => {
  totalPages.value = attrs.total_pages;
  totalChannels.value = attrs.length;
};

onMounted(() => fetchAllChannelsByUserID(user.user.user.id));

const search = ref(undefined);

const handleUpdate = (newVal) => {
  channel.value = newVal;
  isLoading.value = false;
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
