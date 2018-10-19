import { StyleSheet, Dimensions } from 'react-native';
import { Configuration } from './Configuration';

const { width, height } = Dimensions.get('window');
const SCREEN_WIDTH = width < height ? width : height;
const numColumns = 2;

export const AppStyles = {
  color: {
    main: '#5ea23a',
    text: '#696969',
    title: '#464646',
    subtitle: '#545454',
    categoryTitle: '#161616',
    tint: '#ff364d',
    description: '#bbbbbb',
    filterTitle: '#8a8a8a',
    starRating: '#2bdf85',
    location: '#a9a9a9',
    white: 'white',
    facebook: '#4267b2',
    grey: 'grey',
    greenBlue: '#00aea8',
    placeholder: '#a0a0a0',
    background: '#f2f2f2',
    blue: '#3293fe',
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
    main: 'Noto Sans',
    bold: 'Noto Sans Bold'
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
    tintColor: AppStyles.color.tint,
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
  },
  rightButton: {
    color: AppStyles.color.tint,
    marginRight: 10,
    fontFamily: AppStyles.fontName.main,
  },
});



export const ListStyle = StyleSheet.create({
  title: {
    fontSize: 18,
    color: AppStyles.color.subtitle,
    fontFamily: AppStyles.fontName.bold,
    fontWeight: 'bold',
  },
  subtitleView: {
    minHeight: 75,
    flexDirection: 'row',
    paddingTop: 5,
    marginLeft: 10,
  },
  leftSubtitle: {
    flex: 1,
  },
  description: {
    color: AppStyles.color.description,
    fontFamily: AppStyles.fontName.main,
    flex: 1,
    textAlignVertical: 'bottom',
  },
  place: {
    color: AppStyles.color.location,
  },
  price: {
    fontSize: 18,
    color: AppStyles.color.subtitle,
    fontFamily: AppStyles.fontName.bold,
    textAlignVertical: 'bottom',
  },
  avatarStyle: {
    height: 100,
    width: 100
  }
});

export const TwoColumnListStyle = {
  listings: {
    marginTop: 15,
    width: '100%',
    flex: 1,
  },
  showAllButtonContainer: {
    borderWidth: 2,
    borderRadius: 5,
    borderColor: AppStyles.color.greenBlue,
    height: 50,
    width: '100%',
  },
  showAllButtonText: {
    padding: 10,
    textAlign: 'center',
    color: AppStyles.color.greenBlue,
    fontFamily: AppStyles.fontName.bold,
    justifyContent: 'center',
  },
  listingItemContainer: {
    justifyContent: 'center',
    marginBottom: 30,
    marginRight: Configuration.home.listing_item.offset,
    width: (SCREEN_WIDTH - Configuration.home.listing_item.offset * 3) / numColumns,
  },
  photo: {
    // position: "absolute",
  },
  listingPhoto: {
    width: (SCREEN_WIDTH - Configuration.home.listing_item.offset * 3) / numColumns,
    height: Configuration.home.listing_item.height,
  },
  savedIcon: {
    position: "absolute",
    top: Configuration.home.listing_item.saved.position_top,
    left: (SCREEN_WIDTH - Configuration.home.listing_item.offset * 3) / numColumns - Configuration.home.listing_item.offset - Configuration.home.listing_item.saved.size,
    width: Configuration.home.listing_item.saved.size,
    height: Configuration.home.listing_item.saved.size
  },
  listingName: {
    fontSize: 15,
    minHeight: 40,
    fontFamily: AppStyles.fontName.bold,
    fontWeight: 'bold',
    color: AppStyles.color.categoryTitle,
    marginTop: 5,
  },
  listingPlace: {
    fontFamily: AppStyles.fontName.bold,
    color: AppStyles.color.subtitle,
    marginTop: 5,
  },
}

export const ModalSelectorStyle = {
  optionTextStyle: {
    color: AppStyles.color.subtitle,
    fontSize: 16,
    fontFamily: AppStyles.fontName.main,
  },
  selectedItemTextStyle: {
    fontSize: 18,
    color: AppStyles.color.blue,
    fontFamily: AppStyles.fontName.main,
    fontWeight: 'bold',
  },
  optionContainerStyle: {
    backgroundColor: AppStyles.color.white
  },
  cancelContainerStyle: {
    backgroundColor: AppStyles.color.white,
    borderRadius: 10,
  },
  sectionTextStyle: {
    fontSize: 21,
    color: AppStyles.color.title,
    fontFamily: AppStyles.fontName.main,
    fontWeight: 'bold',
  },

  cancelTextStyle: {
    fontSize: 21,
    color: AppStyles.color.blue,
    fontFamily: AppStyles.fontName.main,
    fontWeight: 'bold',
  }
}