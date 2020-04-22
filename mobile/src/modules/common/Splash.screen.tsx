import * as React from 'react';
import { StyleSheet, Image } from 'react-native';
import { Layout } from '@ui-kitten/components';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1d373b',
    // alignItems: 'center',
    justifyContent: 'center',
    // padding: 16,
  },
  image: {
    flex: 1,
    width: '100%',
    resizeMode: 'contain',
  },
});

const logo = require('../../../assets/original.png');

const SplashScreen: React.FunctionComponent = () => {
  return (
    <Layout style={styles.container}>
      <Image style={styles.image} source={logo} />
    </Layout>
  );
};

export default SplashScreen;
