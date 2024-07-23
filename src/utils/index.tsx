import {ethers, providers, utils} from 'ethers';
import Config from 'react-native-config';

import {SUPPORTED_NETWORK} from '../constants';

export function isValidPrivateKey(privateKey: string) {
  if (!privateKey.startsWith('0x')) {
    return false;
  }

  // Additional validation using ethers.js
  try {
    // Attempt to create a wallet instance with the private key
    const wallet = new ethers.Wallet(privateKey);

    // If no error is thrown, the private key is valid
    if (wallet.address) {
      return true;
    }

    return false;
  } catch (error) {
    // If an error is thrown, the private key is invalid
    return false;
  }
}

export const getProvider = () => {
  // NOTE: Used "sepolia" network for Testnet, "mainnet" for Mainnet
  const infuraProvider = new providers.InfuraProvider(
    'mainnet',
    Config.INFURA_API_KEY,
  );

  console.log('====================================');
  console.log('ETHEREUM_NETWORK', Config.ETHEREUM_NETWORK);
  console.log('====================================');

  // NOTE: "sepolia" network for Testnet, "homestead" for Mainnet
  const etherscanProvider = new providers.EtherscanProvider('homestead');

  // if INFURA is down
  return new providers.FallbackProvider([infuraProvider, etherscanProvider]);
};

export const networkInfo = async (
  chainId: number | undefined,
): Promise<any> => {
  if (!chainId) {
    return null;
  }
  const network = SUPPORTED_NETWORK.find(({chainId: id}) => id === chainId);
  return network;
};

export const shortAddress = (address: string, length?: number) => {
  if (!address) {
    return '';
  }
  const value = `${address.slice(0, length ?? 4)}...${address.slice(
    address.length - (length ?? 4),
    address.length,
  )}`;
  return value;
};

export const normalizeValue = (input: string): string => {
  let result = input.replace(/,/g, '.').replace(/\s/g, '');

  result = result.trim();

  if (result.startsWith('0')) {
    result = result.replace(/^0+/, '');
    if (result === '') {
      result = '0';
    }
  }

  if (result.startsWith('.')) {
    result = `0${result}`;
  }

  return result;
};

export const isValidAddress = (input: string): boolean => {
  if (!input) {
    return false;
  }
  try {
    utils.getAddress(input);
    return true;
  } catch (e) {
    return false;
  }
};

export const convertGasCostToEth = (
  gasUnits: ethers.BigNumberish,
  gasPriceInGwei: string,
) => {
  const gasPrice = utils.parseUnits(gasPriceInGwei.toString(), 'gwei');
  const gasCostInWei = gasPrice.mul(gasUnits);
  const gasCostInEth = utils.formatEther(gasCostInWei);
  return gasCostInEth;
};

export const convertEthToGwei = (eth: string) => {
  return utils.parseUnits(eth.toString(), 'gwei');
};

export const formatBalance = (
  totalETH: string | number,
  ethereumPrice: any,
  fixedNumber?: number,
) => {
  if (!totalETH || !ethereumPrice) {
    return 0;
  }
  if (!Number(totalETH)) {
    return 0;
  }
  const usdBalance = Number(totalETH) * ethereumPrice;
  return `$${usdBalance.toFixed(fixedNumber ?? 3)}`;
};
