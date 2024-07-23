import {Alert} from 'react-native';
import Config from 'react-native-config';

interface Props {
  price: null | number;
  address: string;
  history: null | any;
  fetchEthereumPrice: () => Promise<number>;
  transactionHistory: (address: string) => Promise<any[] | null>;
}

export const getConigecko = async (path: string) => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-cg-pro-api-key': Config.COINGECKO_API ?? '',
    },
  };

  return await fetch('https://api.coingecko.com/api/v3/' + path, options)
    .then(response => response.json())
    .then(response => response)
    .catch(err => {
      Alert.alert('API ERROR', err.message);
      return null;
    });
};

const apis: Props = {
  price: null,
  address: '',
  history: null,
  fetchEthereumPrice: async () => {
    if (apis.price) {
      return apis.price;
    }
    const result = await getConigecko(
      'simple/price?ids=ethereum&vs_currencies=usd',
    );

    if (!result) {
      return null;
    }
    apis.price = result?.ethereum?.usd;
    return result?.ethereum?.usd;
  },
  transactionHistory: async (address: string) => {
    if (apis.address === address) {
      return apis.history;
    }

    var requestOptions = {
      method: 'GET',
    };

    const result = await fetch(
      'https://api.etherscan.io/api?module=account&action=txlist&address=' +
        address +
        '&startblock=0&endblock=99999999&page=1&offset=10&apikey=' +
        Config.ETHERSCAN_API_KEY +
        '&sort=desc',
      requestOptions,
    )
      .then(response => response.json())
      // eslint-disable-next-line @typescript-eslint/no-shadow
      .then(result => result)
      .catch(_error => null);

    apis.history = result?.result;
    if (apis.history) {
      apis.address = address;
    }
    return result?.result;
  },
};
export default apis;
