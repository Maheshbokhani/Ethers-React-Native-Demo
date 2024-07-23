import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';

import useStore from '../zustand/store';

interface Props {
  title: string;
  chain: string | null;
  balance: number;
}

const color = '#ffffff';

function Token({title, balance, chain}: Props) {
  const {ethereumPrice} = useStore(state => state);

  return (
    <View style={styles.mainContainer}>
      <Image
        source={{uri: 'https://chainlist.org/unknown-logo.png'}}
        style={styles.img}
        resizeMode="contain"
      />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subTxt}>{chain ? 'on ' + chain : ''}</Text>
      </View>
      <View style={styles.balanceContainer}>
        <Text style={styles.title}>{balance?.toFixed(5)} ETH</Text>
        <Text style={styles.subTxt}>
          ${(ethereumPrice * balance)?.toFixed(4)}
        </Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '5%',
  },
  img: {width: 50, height: 50},
  titleContainer: {flex: 1, marginLeft: '5%'},
  title: {
    color,
    fontSize: 18,
    fontWeight: 'bold',
  },
  subTxt: {
    color: color + '99',
    fontSize: 14,
    marginTop: '2%',
  },
  balanceContainer: {alignItems: 'flex-end'},
});
export default Token;
