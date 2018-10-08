import { StyleSheet } from 'react-native';

export const AppStyles = {
  color: {
    main: '#5ea23a',
    text: '#555555',
    white: 'white',
    facebook: '#4267b2',
    grey: 'grey',
    greenBlue: '#00aea8',
    placeholder: '#a0a0a0'
  },
  fontSize: {
    title: 30,
    content: 20,
    normal: 16,
  },
  buttonWidth: {
    main: '70%',
  },
  textInputWidth: {
    main: '80%'
  },
  fontName: {
    main: 'NotoSans-Regular',
    bold: 'NotoSans-Bold'
  },
  borderRadius: {
    main: 25,
    small: 5
  }
}

export const AppIcon = {
  container: {
    padding: 10,
  },
  style: {
    tintColor: 'tomato', 
    width: 25,
    height: 25,
  },
  images: {
    home: require('../assets/icons/home.png'),
    categories: require('../assets/icons/categories.png'),
    collections: require('../assets/icons/collections.png'),
    compose: require('../assets/icons/compose.png'),
    filter: require('../assets/icons/filter.png'),
    filters: require('../assets/icons/filters.png'),
    heart: require('../assets/icons/heart.png'),
    heartFilled: require('../assets/icons/heart-filled.png'),
    map: require('../assets/icons/map.png'),
    search: require('../assets/icons/search.png'),
  }

}

export const HeaderButtonStyle = StyleSheet.create({
  container: {
    padding: 10,
  },
  image: {
    justifyContent: 'center',
    width: 35,
    height: 35,
    margin: 6
  }
});  
