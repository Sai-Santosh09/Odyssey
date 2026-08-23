import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.odyssey.app',
  appName: 'Odyssey',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
