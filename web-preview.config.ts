import { defineConfig } from '@lynx-js/rspeedy'
import { pluginReactLynx } from '@lynx-js/react-rsbuild-plugin'

const entries = {
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
  tags: './src/pages/tags/index.tsx',
}

export default defineConfig({
  plugins: [pluginReactLynx()],
  environments: {
    web: {
      source: { entry: entries },
      output: {
        assetPrefix: '/',
      },
    },
    lynx: {
      source: { entry: entries },
      output: {
        assetPrefix: 'asset:///',
      },
    },
  },
})
