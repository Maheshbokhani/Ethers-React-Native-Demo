import {Alert} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';

interface Props {
  getItem: (name: string) => Promise<string | null>;
  setItem: (name: string, value: object) => void;
  removeItem: (name: string) => void;
  removeAll: () => void;
}

const storageServices: Props = {
  setItem: async (name, value) => {
    try {
      await EncryptedStorage.setItem(name, JSON.stringify(value));
    } catch (error: any) {
      // There was an error on the native side
      Alert.alert('Local Storage', error.message);
    }
  },
  getItem: async name => {
    try {
      const session = await EncryptedStorage.getItem(name);
      if (session !== undefined) {
        return session;
      }
      return null;
    } catch (error: any) {
      Alert.alert('Local Storage', error.message);
      return null;
    }
  },
  removeItem: async name => {
    try {
      await EncryptedStorage.removeItem(name);
    } catch (error: any) {
      Alert.alert('Local Storage', error.message);
    }
  },
  removeAll: async () => {
    try {
      await EncryptedStorage.clear();
    } catch (error: any) {
      Alert.alert('Local Storage', error.message);
    }
  },
};

export default storageServices;
