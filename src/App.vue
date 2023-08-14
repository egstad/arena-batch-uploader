<script setup>
import { ref, toRaw } from "vue";
// import Upload from "./components/Upload.vue";
import { darkTheme } from "naive-ui";
import { NConfigProvider } from "naive-ui";
import SearchUser from "./components/SearchUser.vue";
import SearchChannel from "./components/SearchChannel.vue";
import AccessToken from "./components/AccessToken.vue";
import File from "./components/File.vue";
import Upload from "./components/Upload.vue";

const user = ref(null);
const channel = ref(null);
const token = ref(null);
const file = ref(null);
const upload = ref(null);
</script>

<template>
  <n-config-provider :theme="darkTheme">
    <main class="grid">
      <header class="header row">
        <h1>Are.na Batch Uploader</h1>
        <div>
          <p>
            A tool that takes your cute lil <span class="pre">json</span> file
            and batch uploads its contents as blocks to an
            <a href="https://are.na">are.na</a> channel.
            <a href="https://github.com/egstad">Learn more</a>.
          </p>
        </div>
      </header>

      <section class="content">
        <div class="row">
          <h2>
            <span v-if="!user?.user">Enter username</span>
            <s v-else style="opacity: 0.5">Enter username</s>
          </h2>
          <SearchUser ref="user" />
        </div>

        <div class="row" v-if="user?.user">
          <h2>
            <span v-if="!channel?.channel">Select channel</span>
            <s v-else style="opacity: 0.5">Select channel</s>
          </h2>
          <SearchChannel :user="user" ref="channel" />
        </div>

        <div class="row" v-if="channel?.channel">
          <h2>
            <span v-if="!token?.token">Enter personal access token.</span>
            <s v-else style="opacity: 0.5">Enter personal access token.</s>
          </h2>

          <AccessToken ref="token" />
        </div>

        <div class="row" v-if="token?.token">
          <h2>
            <span v-if="!token?.token">Select a file</span>
            <s v-else style="opacity: 0.5">Select a file</s>
          </h2>

          <div>
            <File ref="file" />
          </div>
        </div>

        <div class="row" v-if="file?.jsonData?.length">
          <h2>
            <span>Confirm batch</span>
          </h2>

          <div>
            <Upload
              :json-data="file?.jsonData"
              :channel-title="channel?.channel?.title"
              :access-token="token"
              ref="upload"
            />
          </div>
        </div>
      </section>
    </main>
  </n-config-provider>
</template>

<style lang="scss">
main {
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
  width: 100%;
  padding: 0 1rem;
}

.row {
  width: 100%;
  display: grid;
  grid-template-columns: 15em 1fr;
  grid-gap: 1rem;
  line-height: 1.25rem;
  margin-top: 1rem;
  margin-bottom: 5rem;
  min-height: 100px;

  // left column
  *:first-child {
    // background: blue;
  }

  // right column
  *:last-child {
    max-width: 33em;
  }

  // both columns
  > * {
    border-top: 1px solid var(--border);
    // border-left: 1px solid var(--border);
    // border-radius: 0.125rem 0 0 0;
    padding: 0.5rem 0;
  }

  code,
  pre,
  .pre {
    font-family: monospace;
    display: inline;
    line-height: inherit;
    background-color: darkslategray;
    padding: 0.05em 0.5em;
    border-radius: 100vw;
  }
}

.header.row {
  > * {
    border: 0;
  }
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
