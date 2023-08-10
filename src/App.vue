<script setup>
import { ref, toRaw } from "vue";
import Channels from "./components/Channels.vue";
import Search from "./components/Search.vue";
import File from "./components/File.vue";
import Upload from "./components/Upload.vue";

const channels = ref([]);
const channelsTotal = ref(0);
const onChannelLoaded = (channel) => {
  channels.value.push({
    title: channel.payload.title,
    id: channel.payload.id,
  });
  channelsTotal.value = channel.totalChannels;
};

const selectedChannel = ref(null);
const onChannelSelected = (channel) => {
  selectedChannel.value = channel;
};

const fileSelected = ref(null);
const onFileSelected = (channel) => {
  fileSelected.value = toRaw(channel);
};
</script>

<template>
  <main>
    <!-- This component loads channels -->
    <Channels @channelLoaded="onChannelLoaded" />

    <table>
      <tr>
        <td>1. Select a channel</td>
        <td>
          <Search
            @channelSelected="onChannelSelected"
            :search-data="channels"
          />
        </td>
      </tr>

      <tr v-if="selectedChannel">
        <td>2. Select a JSON file.</td>
        <td><File @fileSelected="onFileSelected" /></td>
      </tr>

      <tr v-if="fileSelected && selectedChannel">
        <td>3. Press the red button.</td>
        <td>
          You are about to add
          <pre>{{ fileSelected.length }}</pre>
          posts to the "
          <pre>{{ selectedChannel }}</pre>
          " channel. You cool with that?
        </td>
      </tr>
    </table>

    <button class="big-red" v-if="fileSelected && selectedChannel">
      FUCKING SEND IT!
    </button>

    <div>
      <Upload @channelSelected="onChannelSelected" :json-data="fileSelected" />
    </div>
  </main>
</template>

<style scoped>
main {
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
  width: 100%;
}

.big-red {
  display: flex;
  width: 100%;
  height: 100%;
  background: maroon;
  color: white;
  border: none;
  outline: none;
  align-items: center;
  justify-content: center;
  font-size: 10vw;
  letter-spacing: -0.05em;
  border-radius: 100%;
  cursor: pointer;
  transition: scale 150ms ease-in-out, color 150ms ease-in-out;
  scale: 0.99;
}

.big-red:hover,
.big-red:focus {
  background: red;
  scale: 1;
}
</style>
