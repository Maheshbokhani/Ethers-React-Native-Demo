import React from 'react';
import {StyleSheet, ActivityIndicator} from 'react-native';

interface Props {
  isVisible?: boolean;
}

function Loader({isVisible = false}: Props) {
  if (!isVisible) {
    return null;
  }
  return (
    <ActivityIndicator size={'large'} color={'#fff'} style={styles.loader} />
  );
}
const styles = StyleSheet.create({
  loader: {
    width: '20%',
    aspectRatio: 1,
    backgroundColor: '#444',
    borderRadius: 6,
  },
});
export default Loader;
