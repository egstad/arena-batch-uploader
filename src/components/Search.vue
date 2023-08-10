<template>
  <input
    list="search"
    v-model="search"
    type="search"
    placeholder="Search channel..."
    @input="onInput"
  />
  <datalist id="search">
    <option
      v-for="(result, index) in results"
      :key="result.item.id + '-' + index"
    >
      {{ result.item.title }}
    </option>
  </datalist>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useFuse } from "@vueuse/integrations/useFuse";

const channels = defineProps(["search-data"]);
const emit = defineEmits(["channelSelected"]);

const onInput = (ev) => {
  emit("channelSelected", ev.target.value);
};

const search = ref("");
const keys = computed(() => ["title"]);

const resultLimit = ref(undefined);
const resultLimitString = ref("");
watch(resultLimitString, () => {
  if (resultLimitString.value === "") {
    resultLimit.value = undefined;
  } else {
    const float = Number.parseFloat(resultLimitString.value);
    if (!Number.isNaN(float)) {
      resultLimit.value = Math.round(float);
      resultLimitString.value = resultLimit.value.toString();
    }
  }
});

const options = computed(() => ({
  fuseOptions: {
    keys: keys.value,
  },
  resultLimit: resultLimit.value,
  matchAllWhenSearchEmpty: true,
}));

const { results } = useFuse(search, channels.searchData, options);
</script>
