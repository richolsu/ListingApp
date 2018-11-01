import React from 'react';
import { ScrollView, Dimensions, ActivityIndicator, TouchableOpacity, FlatList, StyleSheet, Text, View } from 'react-native';
import Button from 'react-native-button';
import HeaderButton from '../components/HeaderButton';
import firebase from 'react-native-firebase';
import { AppStyles, AppIcon, TwoColumnListStyle } from '../AppStyles';
import FastImage from 'react-native-fast-image'
import SavedButton from '../components/SavedButton';
import { connect } from 'react-redux';
import { Configuration } from '../Configuration';
import PostModal from '../components/PostModal';

class HomeScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Home',
        headerLeft: <HeaderButton icon={AppIcon.images.map} onPress={() => { navigation.navigate('Map') }} />,
        headerRight: <HeaderButton icon={AppIcon.images.compose} onPress={() => { navigation.state.params.onPressPost() }} />,
    });

    constructor(props) {
        super(props);

        this.categoriesRef = firebase.firestore().collection('Categories').orderBy('order');
        this.listingsRef = firebase.firestore().collection('Listings');
        if (this.props.user)
            this.savedListingsRef = firebase.firestore().collection('SavedListings').where('user_id', '==', this.props.user.id);
        else
            this.savedListingsRef = firebase.firestore().collection('SavedListings');
        this.categoriesUnsubscribe = null;
        this.listingsUnsubscribe = null;
        this.savedListingsUnsubscribe = null;

        this.state = {
            activeSlide: 0,
            categories: [],
            listings: [],
            allListings: [],
            selectedCategoryName: '',
            savedListings: [],
            filter: {},
            showedAll: false,
            postModalVisible: false
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
        if (data.length > 0)
            this.showFirstCategoryItem(data[0]);
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
            listings: data.slice(0, Configuration.home.initial_show_count),
            allListings: data,
            loading: false,
            showedAll: data.length <= Configuration.home.initial_show_count
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

        this.props.navigation.setParams({
            onPressFilter: this.onPressFilter,
            onPressPost: this.onPressPost
        });
    }

    componentWillUnmount() {
        this.categorieUnsubscribe();
        this.listingsUnsubscribe();
        this.savedListingsUnsubscribe();
    }

    onPressPost = () => {
        this.setState({ postModalVisible: true });
    }
    onPostCancel = () => {
        this.setState({ postModalVisible: false });
    }
    onPressCategoryItem = (item) => {
        this.props.navigation.navigate('Listing', { item: item });
    }

    showFirstCategoryItem = (item) => {
        this.state.selectedCategoryName = item.name;
        this.listingsRef = firebase.firestore().collection('Listings').where('category_id', '==', item.id);
        this.listingsUnsubscribe = this.listingsRef.onSnapshot(this.onListingsCollectionUpdate);
    }

    onPressListingItem = (item) => {
        this.props.navigation.navigate('Detail', { item: item });
    }

    onShowAll = () => {
        this.setState({
            showedAll: true,
            listings: this.state.allListings,
        });
    }

    onPressSavedIcon = (item) => {
        if (item.saved) {
            firebase.firestore().collection('SavedListings').where('listing_id', '==', item.id)
                .where('user_id', '==', this.props.user.id)
                .get().then(function (querySnapshot) {
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
                <View style={TwoColumnListStyle.listingItemContainer}>
                    <FastImage style={TwoColumnListStyle.listingPhoto} source={{ uri: item.cover_photo }} />
                    <SavedButton style={TwoColumnListStyle.savedIcon} onPress={() => this.onPressSavedIcon(item)} item={item} />
                    <Text style={{ ...TwoColumnListStyle.listingName, minHeight: 40 }}>{item.name}</Text>
                    <Text style={TwoColumnListStyle.listingPlace}>{item.place}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    renderListingFooter = () => {
        return (
            <Button containerStyle={TwoColumnListStyle.showAllButtonContainer} style={TwoColumnListStyle.showAllButtonText} onPress={() => this.onShowAll()}>
                Show all ({this.state.allListings.length})
            </Button>
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
                        ListFooterComponent={!this.state.showedAll ? this.renderListingFooter : ''}
                        numColumns={2}
                        data={this.state.listings}
                        renderItem={this.renderListingItem}
                        keyExtractor={item => `${item.id}`}
                    />
                </View>
                {this.state.postModalVisible &&
                    <PostModal onCancel={this.onPostCancel}></PostModal>
                }
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        padding: Configuration.home.listing_item.offset,
    },
    title: {
        fontFamily: AppStyles.fontName.bold,
        fontWeight: 'bold',
        color: AppStyles.color.title,
        fontSize: 25,
    },
    listingTitle: {
        marginTop: 10,
        marginBottom: 10,
    },
    categories: {
        marginTop: 7,
    },
    categoryItemContainer: {
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: 'grey',
        paddingBottom: 10,
    },
    categoryItemPhoto: {
        height: 60,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        width: 110,
    },
    categoryItemTitle: {
        fontFamily: AppStyles.fontName.bold,
        fontWeight: 'bold',
        color: AppStyles.color.categoryTitle,
        margin: 10,
    },

});

const mapStateToProps = state => ({
    user: state.auth.user,
});

export default connect(mapStateToProps)(HomeScreen);

