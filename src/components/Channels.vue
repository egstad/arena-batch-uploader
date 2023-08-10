<template></template>

<script setup>
import { ref } from "vue";
import Arena from "are.na";

const emit = defineEmits(["channelLoaded"]);
const channels = ref([]);
const channelsPerPage = 50;
const currentPage = ref(1);
const arena = new Arena({ accessToken: import.meta.env.VITE_ARENA_TOKEN });

const fetchAllChannelsByUserID = (userID) => {
  arena
    .user(userID)
    .channels({ page: currentPage.value, per: channelsPerPage })
    .then((contents) => {
      contents.map((item) => {
        emit("channelLoaded", {
          payload: item,
          totalChannels: contents.attrs.length,
          currentPage: contents.attrs.current_page,
          totalPages: contents.attrs.current_page,
        });
      });

      if (channels.value.length >= contents.attrs.length) return;

      currentPage.value = contents.attrs.current_page + 1;
      fetchAllChannelsByUserID(userID);
    })
    .catch((err) => console.log(err));
};

fetchAllChannelsByUserID("jordan-egstad");
</script>
