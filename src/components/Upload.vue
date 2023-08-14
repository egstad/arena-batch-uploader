<template>
  <div>
    <p>
      Are you sure you'd like to add {{ jsonData.length }} new blocks to the "{{
        channelTitle
      }}" channel?
    </p>
    <n-button @click="upload" type="success">Confirm upload</n-button>
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
        <div v-for="success in successes">
          <a :href="`https://are.na/block/${success.id}`" target="_blank">
            <span v-if="success.title">{{ success.title }}</span>
            <span v-else>{{ success.id }}</span> </a
          >&nbsp;was successfully
          <n-time :time="new Date(success.created_at)" type="relative" />
        </div>
      </n-collapse-item>
      <n-collapse-item
        v-if="errors.length"
        :title="`Errors: ${errors.length}`"
        name="2"
      >
        <div>nice</div>
      </n-collapse-item>
    </n-collapse>
  </div>
</template>

<script setup>
import { ref, toRaw } from "vue";
import { NButton, NCollapse, NCollapseItem, NTime } from "naive-ui";
import Arena from "are.na";

const arena = new Arena({ accessToken: import.meta.env.VITE_ARENA_TOKEN });
const payload = defineProps(["json-data", "channel-title", "access-token"]);
const downloaded = ref(0);
const successes = ref([]);
const errors = ref([]);

const upload = () => {
  const blocks = toRaw(payload.jsonData);

  blocks.forEach((block) => {
    arena
      .block()
      .create("testing-xgv_oh8r0pq", block)
      .then((block) => {
        successes.value.push({
          id: block.id,
          created_at: block.connected_at,
          title: block.title,
        });
        downloaded.value++;
      })
      .catch((err) => {
        // console.log("hi");
        errors.value.push({
          error: err,
          payload: block,
        });
      });
  });
};
</script>
