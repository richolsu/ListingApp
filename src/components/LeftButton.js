import React from 'react';
import { StyleSheet, TouchableOpacity, Image, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class LeftButton extends React.Component {
  render() {
    return (
      <TouchableOpacity style={styles.headerButtonContainer} onPress={this.props.onPress}>
        <Icon name={'home'} size={25} color={'tomato'} />
      </TouchableOpacity>
    );
  }
}


const styles = StyleSheet.create({
  headerButtonContainer: {
    padding: 10,
  },
  headerButtonImage: {
    justifyContent: 'center',
    width: 35,
    height: 35,
    margin: 6
  }
});  