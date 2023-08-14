<template>
  <div>
    <n-upload
      directory-dnd
      :max="1"
      accept="application/JSON"
      @input="onInput($event)"
      @remove="jsonData = undefined"
    >
      <n-upload-dragger>
        <p>Click or drag a single JSON file here.</p>
        <p>
          This file should contain an array of objects. Each object accepts a
          title, description, and content property.
        </p>
      </n-upload-dragger>
    </n-upload>

    <n-alert
      v-if="jsonHasError"
      title="Error with JSON file"
      type="error"
      closable
    >
      {{ jsonError }}
    </n-alert>
  </div>
</template>

<script setup>
import { ref, toRaw, watch } from "vue";
import { NUpload, NUploadDragger, NAlert } from "naive-ui";

// validation
// content is required. must be string.

const jsonData = ref([]);
const jsonHasError = ref(false);
const jsonError = ref(null);
const reader = new FileReader();

defineExpose({
  jsonData,
});

reader.addEventListener("load", (ev) => {
  jsonData.value = JSON.parse(ev.target.result);
});

const onInput = (ev) => {
  reader.readAsText(ev.target.files[0]);
};

watch(jsonData, (newValue) => {
  newValue.some((obj, index) => {
    if (obj.hasOwnProperty("content") && typeof obj.content === "string")
      return;

    jsonHasError.value = true;
    jsonError.value = `Error found on index ${index}. This is likely due to the fact that the object doesn't include a 'content' property or this property is not a string. Please correct before proceeding.`;
  });
});

// const columns = [
//   {
//     title: "Title",
//     key: "title",
//   },
// ];

// const pagination = reactive({
//   page: 1,
//   pageSize: 4,
//   // showSizePicker: true,
//   // pageSizes: [3, 5, 7],
//   onChange: (page) => {
//     pagination.page = page;
//   },
//   onUpdatePageSize: (pageSize) => {
//     pagination.pageSize = pageSize;
//     pagination.page = 1;
//   },
// });
</script>
