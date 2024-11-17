import { Platform } from 'react-native';

let local;
if (Platform.OS === 'web') {
  local = false;
} else {
  local = false;
}

const config = {
  local,
  getBaseUrl() {
    return this.local ? "http://localhost:7071" : "https://tngapp1.azurewebsites.net";
  },
};

export default config;
