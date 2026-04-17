// @ts-nocheck
import { defineConfig } from '@lynx-js/rspeedy'
import { pluginQRCode } from '@lynx-js/qrcode-rsbuild-plugin'
import { pluginReactLynx } from '@lynx-js/react-rsbuild-plugin'
import type { AppConfig } from 'sparkling-app-cli'

const lynxConfig = defineConfig({
  source: {
    entry: {
      main: './src/pages/main/index.tsx',
      explore: './src/pages/explore/index.tsx',
      chat: './src/pages/chat/index.tsx',
      note: './src/pages/note/index.tsx',
      user: './src/pages/user/index.tsx',
      reply: './src/pages/reply/index.tsx',
      notifications: './src/pages/notifications/index.tsx',
      post: './src/pages/post/index.tsx',
      send: './src/pages/send/index.tsx',
      receive: './src/pages/receive/index.tsx',
      qr: './src/pages/qr/index.tsx',
      scan: './src/pages/scan/index.tsx',
      profile: './src/pages/profile/index.tsx',
      login: './src/pages/login/index.tsx',
      wallet: './src/pages/wallet/index.tsx',
      theme: './src/pages/theme/index.tsx',
      cmdk: './src/pages/cmdk/index.tsx',
      keys: './src/pages/keys/index.tsx',
      relays: './src/pages/relays/index.tsx',
      logout: './src/pages/logout/index.tsx',
      minting: './src/pages/minting/index.tsx',
      minted: './src/pages/minted/index.tsx',
      melt: './src/pages/melt/index.tsx',
      melted: './src/pages/melted/index.tsx',
      newchat: './src/pages/newchat/index.tsx',
      followlists: './src/pages/followlists/index.tsx',
      repost: './src/pages/repost/index.tsx',
      share: './src/pages/share/index.tsx',
      tapcash: './src/pages/tapcash/index.tsx',
      lightning: './src/pages/lightning/index.tsx',
      relayinfos: './src/pages/relayinfos/index.tsx',
      zaps: './src/pages/zaps/index.tsx',
      kind0: './src/pages/kind0/index.tsx',
      ecash: './src/pages/ecash/index.tsx',
      kind1111: './src/pages/kind1111/index.tsx',
      zoom: './src/pages/zoom/index.tsx',
      testbuild: './src/pages/test-build/index.tsx',
      tags: './src/pages/tags/index.tsx',
    },
  },
  output: {
    assetPrefix: 'asset:///',
    filename: {
      bundle: '[name].lynx.bundle'
    },
  },
  plugins: [
    pluginQRCode({
      schema(url: string): string {
        return `${url}?fullscreen=true`
      },
    }),
    pluginReactLynx(),
  ],
})

const config: AppConfig = {
  lynxConfig,
  appName: 'nutscash',
  platform: {
    android: {
      packageName: 'cash.nuts.app',
    },
    ios: {
      bundleIdentifier: 'cash.nuts.app',
    },
  },
  paths: {
    androidAssets: 'android/app/src/main/assets',
    iosAssets: 'ios/SparklingGo/SparklingGo/Resources/Assets',
  },
  appIcon: './resource/app_icon.png',
  router: {
    main: {
      path: './lynxPages/main',
    },
    explore: {
      path: './lynxPages/explore',
    },
    chat: {
      path: './lynxPages/chat',
    },
    note: {
      path: './lynxPages/note',
    },
    user: {
      path: './lynxPages/user',
    },
    reply: {
      path: './lynxPages/reply',
    },
    notifications: {
      path: './lynxPages/notifications',
    },
    post: {
      path: './lynxPages/post',
    },
    send: {
      path: './lynxPages/send',
    },
    receive: {
      path: './lynxPages/receive',
    },
    qr: {
      path: './lynxPages/qr',
    },
    scan: {
      path: './lynxPages/scan',
    },
    profile: {
      path: './lynxPages/profile',
    },
    login: {
      path: './lynxPages/login',
    },
    wallet: {
      path: './lynxPages/wallet',
    },
    theme: {
      path: './lynxPages/theme',
    },
    cmdk: {
      path: './lynxPages/cmdk',
    },
    keys: {
      path: './lynxPages/keys',
    },
    relays: {
      path: './lynxPages/relays',
    },
    logout: {
      path: './lynxPages/logout',
    },
    minting: {
      path: './lynxPages/minting',
    },
    minted: {
      path: './lynxPages/minted',
    },
    melt: {
      path: './lynxPages/melt',
    },
    melted: {
      path: './lynxPages/melted',
    },
    newchat: {
      path: './lynxPages/newchat',
    },
    followlists: {
      path: './lynxPages/followlists',
    },
    repost: {
      path: './lynxPages/repost',
    },
    share: {
      path: './lynxPages/share',
    },
    tapcash: {
      path: './lynxPages/tapcash',
    },
    lightning: {
      path: './lynxPages/lightning',
    },
    relayinfos: {
      path: './lynxPages/relayinfos',
    },
    zaps: {
      path: './lynxPages/zaps',
    },
    kind0: {
      path: './lynxPages/kind0',
    },
    ecash: {
      path: './lynxPages/ecash',
    },
    kind1111: {
      path: './lynxPages/kind1111',
    },
    zoom: {
      path: './lynxPages/zoom',
    },
    testbuild: {
      path: './lynxPages/testbuild',
    },
    tags: {
      path: './lynxPages/tags',
    },
  },
  plugin: [
    [
      'splash-screen',
      {
        backgroundColor: '#131716',
        image: './resource/app_icon.png',
        dark: {
          image: './resource/app_icon.png',
          backgroundColor: '#000000',
        },
        imageWidth: 200,
      },
    ],
  ],
};

export default config
