import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Layout, Spinner } from '@ui-kitten/components';

export const RouteLoadingSpinner = () => (
  <Layout style={styles.container} level='3'>
    <View style={styles.controlContainer}>
      <Spinner status='control'/>
    </View>
  </Layout>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  controlContainer: {
    borderRadius: 4,
    padding: 12,
    backgroundColor: '#21130d',
  },
});