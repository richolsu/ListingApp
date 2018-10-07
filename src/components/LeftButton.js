import React from 'react';
import { StyleSheet, TouchableOpacity, Image, Text, View } from 'react-native';
import { AppIcon } from '../AppStyles';

export default class LeftButton extends React.Component {
  render() {
    return (
      <TouchableOpacity style={styles.headerButtonContainer} onPress={this.props.onPress}>
        <Image style={AppIcon.style} source={AppIcon.images.map}/>
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