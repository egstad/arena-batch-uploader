<script setup>
import { ref, toRaw } from "vue";
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

const themeOverrides = {
  common: {
    primaryColor: "#ffffff",
    successColor: "#e24937",
    errorColor: "rgb(226, 73, 55)",
    textColor2: "var(--foreground)",
    borderColor: "var(--border)",
  },
  Input: {
    border: "1px solid var(--border)",
    borderHover: `1px solid var(--foreground)`,
    borderFocus: `1px solid var(--foreground)`,
  },
  Button: {
    border: "1px solid var(--border)",
    // hover
    textColorHover: "var(--foreground)",
    borderHover: `1px solid var(--foreground)`,
    // focus
    textColorFocus: "var(--foreground)",
    borderFocus: `1px solid var(--foreground)`,
    // error
    borderError: "1px solid var(--error)",
  },
  Select: {
    borderHover: `1px solid var(--foreground)`,
    peers: {
      InternalSelection: {
        borderHover: `1px solid var(--foreground)`,
        borderFocus: `1px solid var(--foreground)`,
      },
      InternalSelectMenu: {
        color: "var(--border)",
      },
    },
  },
};
</script>

<template>
  <n-config-provider :theme="darkTheme" :theme-overrides="themeOverrides">
    <main class="grid">
      <section class="content">
        <header class="header row">
          <h1>Are.na Batch Uploader</h1>
          <div>
            <p>
              A tool that takes a json file and batch uploads its contents as
              blocks to an
              <a href="https://are.na" target="_blank">are.na</a> channel. Learn
              more on
              <a
                href="https://github.com/egstad/arena-batch-uploader/"
                target="_blank"
                >github</a
              >.
            </p>
          </div>
        </header>

        <div class="row">
          <h2>
            <span :class="[{ success: user?.user }, 'status-dot']"></span>
            <span class="status-text">Username</span>
          </h2>
          <SearchUser ref="user" />
        </div>

        <div class="row" v-if="user?.user">
          <h2>
            <span :class="[{ success: token?.token }, 'status-dot']"></span>
            <span class="status-text">Access Token</span>
          </h2>

          <AccessToken ref="token" />
        </div>

        <div class="row" v-if="token?.token">
          <h2>
            <span :class="[{ success: channel?.channel }, 'status-dot']"></span>
            <span class="status-text">Channel</span>
          </h2>
          <SearchChannel :user="user" ref="channel" />
        </div>

        <div class="row" v-if="channel?.channel">
          <h2>
            <span
              :class="[{ success: file?.jsonData?.length }, 'status-dot']"
            ></span>
            <span class="status-text">File</span>
          </h2>

          <div>
            <File ref="file" />
          </div>
        </div>

        <div class="row" v-if="file?.jsonData?.length">
          <h2>
            <span>Connect to Are.na</span>
          </h2>

          <div>
            <Upload
              :json-data="file?.jsonData"
              :channel="channel"
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
  min-height: 100vh;
  width: 100%;
  font-size: 14px;
}

.content {
  padding: 0 1rem;

  width: 100%;
  display: grid;
  // grid-template-rows: repeat(6, auto);
  // grid-template-columns: 1fr;
}

.row {
  width: 100%;
  display: grid;
  line-height: 1.25rem;
  margin-top: 1rem;
  margin-bottom: 5rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--border);
  grid-template-columns: 1fr;
  grid-template-rows: 3rem auto;
  padding-bottom: 3rem;

  @media (min-width: 36rem) {
    max-width: 30rem;
  }

  @media (min-width: 50rem) {
    grid-template-columns: 17em 1fr;
    max-width: 45rem;
    grid-gap: 1rem;
  }

  // left column
  > *:first-child {
    padding: 14px 0;
  }

  // right column
  > *:last-child {
  }

  // both columns
  > * {
    // border-top: 1px solid var(--border);
    // border-left: 1px solid var(--border);
    // border-radius: 0.125rem 0 0 0;
    padding: 0.5rem 0;
  }

  &.header {
    border: 0;
    // padding-top: 0;
    margin-top: 0;

    > * {
      padding: 0.5rem 0;
    }
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

.status-dot {
  background-color: var(--error);
  display: inline-block;
  width: 0.7rem;
  height: 0.7rem;
  border-radius: 100vw;
  margin-right: 0.5rem;

  &.success {
    background-color: green;
  }
}
</style>
