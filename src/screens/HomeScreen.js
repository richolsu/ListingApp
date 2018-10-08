import React from 'react';
import { ScrollView, Dimensions, Image, TouchableOpacity, FlatList, StyleSheet, Text, View } from 'react-native';
import LeftButton from '../components/LeftButton';
import FilterButton from '../components/FilterButton';
import firebase from 'react-native-firebase';
import { AppStyles, AppIcon } from '../AppStyles';
import FastImage from 'react-native-fast-image'
import SavedButton from '../components/SavedButton';
import { connect } from 'react-redux';

// screen sizing
const { width, height } = Dimensions.get('window');
// orientation must fixed
const SCREEN_WIDTH = width < height ? width : height;

const numColumns = 2;

// item size
const PRODUCT_ITEM_HEIGHT = 130;
const PRODUCT_ITEM_OFFSET = 15;
const SAVED_POSTION_TOP = 5;
const SAVED_ICON_SiZE = 25;

class HomeScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Home',
        headerRight: <FilterButton onPress={() => { navigation.navigate('Filter') }} />,
        headerLeft: <LeftButton onPress={() => { navigation.dispatch({ type: 'Logout' }) }} />,
    });

    constructor(props) {
        super(props);

        this.categoriesRef = firebase.firestore().collection('Categories').orderBy('order');
        this.listingsRef = firebase.firestore().collection('Listings');
        this.savedListingsRef = firebase.firestore().collection('SavedListings').where('user_id', '==', this.props.user.id);
        this.categoriesUnsubscribe = null;
        this.listingsUnsubscribe = null;
        this.savedListingsUnsubscribe = null;

        this.state = {
            activeSlide: 0,
            categories: [],
            listings: [],
            selectedCategoryName:'',
            savedListings: [],
            loading: false,
            error: null,
            refreshing: false
        };
    }

    onCategoriesCollectionUpdate = (querySnapshot) => {
        const data = [];
        querySnapshot.forEach((doc) => {
            const category = doc.data();
            data.push({ ...category, id: doc.id });
        });
        this.setState({
            categories: data,
            loading: false,
        });
        if (data.length>0)
            this.onPressCategoryItem(data[0]);
    }

    onListingsCollectionUpdate = (querySnapshot) => {
        const data = [];
        querySnapshot.forEach((doc) => {
            const listing = doc.data();
            if (this.state.savedListings.findIndex(k => k == doc.id) >= 0) {
                listing.saved = true;
            } else {
                listing.saved = false;
            }
            data.push({ ...listing, id: doc.id });
        });
        this.setState({
            listings: data,
            loading: false,
        });
    }

    onSavedListingsCollectionUpdate = (querySnapshot) => {
        const savedListingdata = [];
        querySnapshot.forEach((doc) => {
            const savedListing = doc.data();
            savedListingdata.push(savedListing.listing_id);
        });
        const listingsData = [];
        this.state.listings.forEach((listing) => {
            const temp = listing;
            if (savedListingdata.findIndex(k => k == temp.id) >= 0) {
                temp.saved = true;
            } else {
                temp.saved = false;
            }
            listingsData.push(temp);
        });

        this.setState({
            savedListings: savedListingdata,
            listings: listingsData,
            loading: false,
        });
    }

    componentDidMount() {
        this.categoriesUnsubscribe = this.categoriesRef.onSnapshot(this.onCategoriesCollectionUpdate);
        this.listingsUnsubscribe = this.listingsRef.onSnapshot(this.onListingsCollectionUpdate);
        this.savedListingsUnsubscribe = this.savedListingsRef.onSnapshot(this.onSavedListingsCollectionUpdate);
    }

    componentWillUnmount() {
        this.categorieUnsubscribe();
        this.listingsUnsubscribe();
        this.savedListingsUnsubscribe();
    }

    onPressCategoryItem = (item) => {
        this.state.selectedCategoryName = item.name;
        this.listingsRef = firebase.firestore().collection('Listings').where('category_id', '==', item.id);
        this.listingsUnsubscribe = this.listingsRef.onSnapshot(this.onListingsCollectionUpdate);
    }

    onPressListingItem = (item) => {
        this.props.navigation.navigate('Detail', { item: item });
    }

    onPressSavedIcon = (item) => {
        if (item.saved) {
            firebase.firestore().collection('SavedListings').where('listing_id', '==', item.id)
            .where('user_id', '==', this.props.user.id)
            .get().then(function(querySnapshot){
                querySnapshot.forEach(function (doc) {
                    doc.ref.delete();
                });
            });
        } else {
            firebase.firestore().collection('SavedListings').add({
                user_id: this.props.user.id,
                listing_id: item.id,
            }).then(function (docRef) {

            }).catch(function (error) {
                alert(error);
            });
        }
    }

    renderCategoryItem = ({ item }) => (
        <TouchableOpacity onPress={() => this.onPressCategoryItem(item)}>
            <View style={styles.categoryItemContainer}>
                <FastImage style={styles.categoryItemPhoto} source={{ uri: item.photo }} />
                <Text style={styles.categoryItemTitle}>{item.name}</Text>
            </View>
        </TouchableOpacity>
    );

    renderCategorySeparator = () => {
        return (
            <View
                style={{
                    width: 10,
                    height: "100%",
                }}
            />
        );
    };

    renderListingItem = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => this.onPressListingItem(item)}>
                <View style={styles.listingItemContainer}>
                    <FastImage style={styles.listingPhoto} source={{ uri: item.cover_photo }} />
                    <SavedButton style={styles.savedIcon} onPress={() => this.onPressSavedIcon(item)} item={item} />
                    <Text style={styles.listingName}>{item.name}</Text>
                    <Text style={styles.listingPlace}>{item.place}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    render() {
        return (
            <ScrollView style={styles.container}>
                <Text style={styles.title}>Explore Listings </Text>
                <View style={styles.categories}>
                    <FlatList
                        horizontal={true}
                        initialNumToRender={4}
                        ItemSeparatorComponent={this.renderCategorySeparator}
                        data={this.state.categories}
                        showsHorizontalScrollIndicator={false}
                        renderItem={this.renderCategoryItem}
                        keyExtractor={item => `${item.id}`}
                    />
                </View>
                <Text style={[styles.title, styles.listingTitle]}>{this.state.selectedCategoryName} </Text>
                <View style={styles.listings}>
                    <FlatList
                        vertical
                        showsVerticalScrollIndicator={false}
                        numColumns={2}
                        data={this.state.listings}
                        renderItem={this.renderListingItem}
                        keyExtractor={item => `${item.id}`}
                    />
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        padding: PRODUCT_ITEM_OFFSET,
    },
    title: {
        fontFamily: AppStyles.fontName.bold,
        color: AppStyles.color.text,
        fontSize: 25,
    },
    listingTitle: {
        marginTop: 10,
    },
    categories: {
        marginTop: 7,
    },
    categoryItemContainer: {
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'grey',
        paddingBottom: 10,
    },
    categoryItemPhoto: {
        height: 60,
        width: 110,
    },
    categoryItemTitle: {
        fontFamily: AppStyles.fontName.bold,
        color: AppStyles.color.text,
        margin: 10,
    },
    listings: {
        marginTop: 15,
        width: '100%',
        flex: 1,
    },
    listingItemContainer: {
        justifyContent: 'center',
        marginBottom: PRODUCT_ITEM_OFFSET,
        marginRight: PRODUCT_ITEM_OFFSET,
        width: (SCREEN_WIDTH - PRODUCT_ITEM_OFFSET * 3) / numColumns,
    },
    photo: {
        // position: "absolute",
    },
    listingPhoto: {
        width: (SCREEN_WIDTH - PRODUCT_ITEM_OFFSET * 3) / numColumns,
        height: PRODUCT_ITEM_HEIGHT,
    },
    savedIcon: {
        position: "absolute",
        top: SAVED_POSTION_TOP,
        left: (SCREEN_WIDTH - PRODUCT_ITEM_OFFSET * 3) / numColumns - SAVED_POSTION_TOP - SAVED_ICON_SiZE,
        width: SAVED_ICON_SiZE,
        height: SAVED_ICON_SiZE
    },
    listingName: {
        fontSize: 15,
        fontFamily: AppStyles.fontName.bold,
        color: AppStyles.color.text,
        marginTop: 5,
    },
    listingPlace: {
        fontFamily: AppStyles.fontName.bold,
        color: AppStyles.color.text,
        marginTop: 5,
    },
});

const mapStateToProps = state => ({
    user: state.auth.user,
});

export default connect(mapStateToProps)(HomeScreen);

