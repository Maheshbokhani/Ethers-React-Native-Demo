import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

interface Props {
  headerContent?: JSX.Element;
  footerContent?: JSX.Element;
  children: JSX.Element;
}

function Layout({
  headerContent,
  footerContent,
  children,
}: Props): React.JSX.Element {
  const backgroundColor = '#222';

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor}]}>
      <StatusBar barStyle={'light-content'} backgroundColor={backgroundColor} />

      {headerContent && (
        <View style={styles.headerContainer}>{headerContent}</View>
      )}

      <ScrollView bounces={false} style={styles.mainContainer}>
        {children}
      </ScrollView>

      {footerContent && (
        <View style={styles.bottomContainer}>{footerContent}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {flex: 1},
  headerContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  mainContainer: {},
  bottomContainer: {
    alignItems: 'center',
    marginBottom: '3%',
  },
});

export default Layout;
