<template>
  <div>
    <n-select
      size="small"
      placeholder="Search channel..."
      v-model="search"
      @update:value="handleUpdate"
      :render-label="renderLabel"
      :render-tag="renderSingleSelectTag"
      :options="channels"
      filterable
      clearable
    />

    <div v-if="channel">
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

      <n-grid :cols="5">
        <n-grid-item v-for="content in channel.contents">
          <img
            v-if="content.class === 'Image'"
            :src="content.image.large.url"
            style="display: flex; width: 100%; height: auto"
            alt=""
          />
          <!-- <pre>{{ content }}</pre> -->
        </n-grid-item>
      </n-grid>
    </div>
  </div>
</template>

<script setup>
import Arena from "are.na";
import { ref, onMounted, computed, watch, h } from "vue";
import { NSelect, NText, NTag, NTime, NGrid, NGridItem } from "naive-ui";

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
const arena = new Arena({ accessToken: import.meta.env.VITE_ARENA_TOKEN });

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
          value: { ...channel },
        });
      });

      if (currentPage.value === totalPages.value || totalPages.value === 0) {
        isLoading.value = false;
        return;
      } else {
        currentPage.value = contents.attrs.current_page + 1;
        // fetchAllChannelsByUserID(userID);
      }
    })
    .catch((err) => console.log(err));
};

const setChannelAttributes = (attrs) => {
  totalPages.value = attrs.total_pages;
  totalChannels.value = attrs.length;
};

onMounted(() => fetchAllChannelsByUserID(user.user.user.id));

// ----------------------------------------------------
// All this shit is for fuzzy search
// ----------------------------------------------------

const search = ref(undefined);

const handleUpdate = (newVal) => {
  // search.value = newVal;
  channel.value = newVal;
  isLoading.value = false;
  console.log(newVal);
};

const renderLabel = (option) => {
  return h(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
        margin: "0.5rem 0",
      },
    },
    [
      h("div", [
        h("div", null, [option.label]),
        h(
          NText,
          {
            depth: 3,
            tag: "div",
            style: {
              fontSize: "0.75rem",
              lineHeight: "1rem",
            },
          },

          {
            default: (foo) => {
              return `${option.value.length} blocks`;
            },
          }
        ),
      ]),
    ]
  );
};

const renderSingleSelectTag = ({ option }) => {
  return h(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
      },
    },
    [option.label]
  );
};
</script>

<style scoped lang="scss">
.channel-meta {
  display: flex;
  margin-top: 0.5rem;

  > * {
    margin-right: 0.5rem;
  }
}
</style>
