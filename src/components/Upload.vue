<template>
  <div>
    <p>
      Are you sure you'd like to add <strong>{{ jsonData.length }}</strong> new
      blocks to the "<strong>{{ channel.channel.title }}</strong
      >" channel?
    </p>
    <n-input-group>
      <n-input-number
        placeholder="1000"
        :default-value="throttleDuration"
        @update:value="onThrottleUpdate"
      >
        <template #prefix>
          <span style="opacity: 0.5">Throttle duration in ms:</span>
        </template>
      </n-input-number>
      <n-button
        v-if="!uploading"
        @click="upload(channel.channel.slug)"
        type="success"
        >Confirm upload</n-button
      >
      <n-button v-else @click="uploading = false" type="error"
        >Pause upload</n-button
      >
    </n-input-group>

    <p v-if="payload.jsonData">
      <span v-if="payload.jsonData.length - downloaded !== 0"
        >{{ payload.jsonData.length - downloaded }} /
        {{ payload.jsonData.length }} Remaining</span
      >
      <span v-else>Complete! <a href="">View Channel</a></span>
      <br /><br />
    </p>
    <n-collapse v-if="successes.length || errors.length">
      <n-collapse-item
        :title="`Successful Uploads: ${successes.length}`"
        name="1"
      >
        <n-data-table
          pagination-behavior-on-filter="current"
          :columns="statusColumns"
          :data="successes"
          :pagination="{ pageSize: 7 }"
        />
      </n-collapse-item>
      <n-collapse-item
        v-if="errors.length"
        :title="`Errors: ${errors.length}`"
        name="2"
      >
        <div v-for="error in errors">
          <span>{{ error.error }}</span>
          <br />
          <code>
            <pre>{{ error.payload }}</pre>
          </code>
        </div>
      </n-collapse-item>
    </n-collapse>
  </div>
</template>

<script setup>
import { ref, toRaw, computed } from "vue";
import {
  NButton,
  NInputNumber,
  NCollapse,
  NCollapseItem,
  NInputGroup,
  NDataTable,
} from "naive-ui";
import Arena from "are.na";

const arena = new Arena({ accessToken: localStorage.token });
const payload = defineProps(["json-data", "channel", "accessToken"]);
const downloaded = ref(0);
const successes = ref([]);
const errors = ref([]);
const uploading = ref(false);

const upload = async (channel) => {
  const blocks = toRaw(payload.jsonData);
  uploading.value = true;

  for (var i = 0; i < blocks.length; i++) {
    await createBlock(channel, blocks[i], i);
  }
};

const createBlock = async (channel, block, index) => {
  // if uploading is pause, stop.
  if (!uploading.value) return;

  // otherwise, go for it!
  await timer(throttleDuration.value);
  await arena
    .block()
    .create(channel, block)
    .then(async (block) => {
      addToStatusArrays(successes.value, {
        id: block.id,
        created_at: block.connected_at,
        title: block.title,
        index: index,
      });
    })
    .catch((err) => {
      addToStatusArrays(errors.value, {
        error: err,
        payload: block,
      });
    });
  downloaded.value++;
};

const timer = (ms) => new Promise((res) => setTimeout(res, ms));

const addToStatusArrays = (arr, block) => {
  arr.unshift(block);
};

const statusColumns = [
  {
    title: "Title",
    key: "title",
  },
  {
    title: "ID",
    key: "id",
  },
  {
    index: "Index",
    key: "index",
  },
];

const throttleDuration = ref(2000);
const onThrottleUpdate = (val) => (throttleDuration.value = val);
</script>

<style scoped>
strong {
  font-weight: 900;
}

p {
  max-width: 40ch;
  margin-bottom: 1rem;
}

.n-button {
  margin-bottom: 1rem;
}
</style>
