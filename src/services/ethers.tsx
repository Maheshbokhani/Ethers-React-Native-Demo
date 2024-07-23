import {Alert} from 'react-native';

import {ethers, utils, Wallet} from 'ethers';
import {ExternallyOwnedAccount} from '@ethersproject/abstract-signer';
import Config from 'react-native-config';

import {getProvider} from '../utils';
import storageServices from './storage';

interface Props {
  init: any;
  createWallet: () => Promise<Wallet | null>;
  importWallet: (phrase: string) => Promise<Wallet | null>;
  decryptWallet: () => Promise<Wallet | null>;
}

const ethersServices: Props = {
  init: async (
    privateKey:
      | ethers.utils.BytesLike
      | ExternallyOwnedAccount
      | ethers.utils.SigningKey,
  ) => {
    try {
      const provider = getProvider();
      const signer = new ethers.Wallet(privateKey, provider);
      return signer;
    } catch (error: any) {
      Alert.alert('Init Wallet', error.message, [
        {
          text: 'Try again!',
          onPress: () => null,
          style: 'cancel',
        },
      ]);
      return null;
    }
  },
  createWallet: async () => {
    try {
      const newCreatedMnemonicPhrase = utils.entropyToMnemonic(
        utils.randomBytes(16),
      );
      const wallet = await ethersServices.importWallet(
        newCreatedMnemonicPhrase,
      );
      if (!wallet) {
        return null;
      }
      const encryptPassword: any = Config.WALLET_PASSWORD;
      const encryptedWallet = await wallet
        .encrypt(encryptPassword, {scrypt: {N: 16384}})
        .then(JSON.parse)
        .catch(() => ({}));

      await storageServices.setItem('wallet', encryptedWallet);
      return wallet;
    } catch (error: any) {
      Alert.alert('Create Wallet', error.message);
      return null;
    }
  },
  importWallet: async (phrases: string) => {
    try {
      const wallet = await ethers.Wallet.fromMnemonic(phrases);

      const encryptPassword: any = Config.WALLET_PASSWORD;
      const encryptedWallet = await wallet
        .encrypt(encryptPassword, {scrypt: {N: 16384}})
        .then(JSON.parse)
        .catch(() => ({}));

      await storageServices.setItem('wallet', encryptedWallet);

      return wallet;
    } catch (e: any) {
      Alert.alert('Import Wallet', e.message);
      return null;
    }
  },
  decryptWallet: async () => {
    const encryptedWallet = await storageServices.getItem('wallet');
    if (!encryptedWallet) {
      return null;
    }

    const password: any = Config.WALLET_PASSWORD;
    const wallet = await ethers.Wallet.fromEncryptedJson(
      encryptedWallet,
      password,
      percent => {
        console.log('Percent', percent);
      },
    ).catch(error => {
      Alert.alert('Decrypt Wallet', error.message);
      return null;
    });
    return wallet;
  },
};

export default ethersServices;
