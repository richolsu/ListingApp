import React from 'react';
import { StyleSheet, TouchableOpacity, Image, Text, View } from 'react-native';
import { AppIcon } from '../AppStyles';

export default class SavedButton extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { item, style } = this.props
    return (
      <TouchableOpacity style={style} onPress={this.props.onPress}>
        <Image style={AppIcon.style} tintColor={item.saved ? 'tomato' : 'white'} source={AppIcon.images.heartFilled} />
      </TouchableOpacity>
    );
  }
}
