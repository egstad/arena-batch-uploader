<template>
  <div>
    <n-upload
      :max="1"
      accept="application/JSON"
      @input="onInput($event)"
      @remove="jsonData = []"
      status="pending"
    >
      <n-upload-dragger>
        <p>
          <span v-if="!jsonData.length"
            >Click or drag a single JSON file here.</span
          >
          <span v-else>File Added</span>
        </p>
        <p style="opacity: 0.5">
          <span v-if="!jsonData.length"
            >This file should contain an array of objects. Each object accepts a
            title, description, and content property.</span
          >
          <span v-else
            >Select the wrong file? Remove the attachment below to try
            again.</span
          >
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
</script>
