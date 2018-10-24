import React from 'react';
import { Dimensions, FlatList, StyleSheet, ScrollView, TouchableOpacity, Text, View } from 'react-native';
import { AppStyles, AppIcon, HeaderButtonStyle } from '../AppStyles';
import firebase from 'react-native-firebase';
import FastImage from 'react-native-fast-image'
import Carousel, { Pagination } from 'react-native-snap-carousel';
import MapView, { Marker } from 'react-native-maps';
import HeaderButton from '../components/HeaderButton';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
const LATITUDEDELTA = 0.0422;
const LONGITUDEDELTA = 0.0221;

class DetailsScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: typeof (navigation.state.params) == 'undefined' || typeof (navigation.state.params.item) == 'undefined' ? 'Detail' : navigation.state.params.item.name,
        headerRight: <View style={HeaderButtonStyle.multi}><HeaderButton icon={AppIcon.images.review} onPress={() => { navigation.state.params.onPressReview() }} /><HeaderButton icon={AppIcon.images.heart} onPress={() => { navigation.state.params.onPressLove() }} /></View>,
    });

    constructor(props) {
        super(props);

        const { navigation } = props;
        const item = navigation.getParam('item');
        console.log(item);
        this.ref = firebase.firestore().collection('Listings').doc(item.id);
        this.unsubscribe = null;

        this.state = {
            activeSlide: 0,
            data: item,
            photo: item.photo,
            reviews: [],
        };
    }

    onDocUpdate = (doc) => {
        const listing = doc.data();

        this.setState({
            data: { ...listing, id: doc.id },
            loading: false,
        });

        console.log(listing);
    }

    onPressReview = () => {
        this.props.navigation.navigate('Review', { item: this.state.data });
    }

    onPressLove = () => {

    }

    componentDidMount() {
        this.unsubscribe = this.ref.onSnapshot(this.onDocUpdate);
        this.props.navigation.setParams({
            onPressReview: this.onPressReview,
            onPressLove: this.onPressLove,
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    renderItem = ({ item }) => (
        <TouchableOpacity >
            <FastImage style={styles.photoItem} resizeMode={FastImage.resizeMode.cover} source={{ uri: item }} />
        </TouchableOpacity>
    );

    renderSeparator = () => {
        return (
            <View
                style={{
                    width: 10,
                    height: "100%",
                }}
            />
        );
    };

    renderReviewItem = ({ reviewItem }) => (
        <View style={styles.reviewItem}>
            <View style={styles.info}>
                <FastImage />
            </View>
            <Text style={styles.reviewContent}>
            </Text>
        </View>
    );

    render() {
        const mapping = this.state.data.mapping;
        extraInfoArr = Object.keys(mapping).map(function (key) {

            return (
                <View style={styles.extraRow}>
                    <Text style={styles.extraKey}>{key}</Text>
                    <Text style={styles.extraValue}>{mapping[key]}</Text>
                </View>
            )
        });

        const { activeSlide } = this.state;
        return (
            <ScrollView style={styles.container}>
                <View style={styles.carousel}>
                    <Carousel
                        ref={(c) => { this._slider1Ref = c; }}
                        data={this.state.data.list_of_photos}
                        renderItem={this.renderItem}
                        sliderWidth={viewportWidth}
                        itemWidth={viewportWidth}
                        // hasParallaxImages={true}
                        inactiveSlideScale={1}
                        inactiveSlideOpacity={1}
                        firstItem={0}
                        loop={false}
                        // loopClonesPerSide={2}
                        autoplay={true}
                        autoplayDelay={500}
                        autoplayInterval={3000}
                        onSnapToItem={(index) => this.setState({ activeSlide: index })}
                    />
                    <Pagination
                        dotsLength={this.state.data.list_of_photos.length}
                        activeDotIndex={activeSlide}
                        containerStyle={styles.paginationContainer}
                        dotColor={'rgba(255, 255, 255, 0.92)'}
                        dotStyle={styles.paginationDot}
                        inactiveDotColor='white'
                        inactiveDotOpacity={0.4}
                        inactiveDotScale={0.6}
                        carouselRef={this._slider1Ref}
                        tappableDots={!!this._slider1Ref}
                    />
                </View>
                <Text style={styles.title}> {this.state.data.name} </Text>
                <Text style={styles.description}> {this.state.data.description} </Text>
                <Text style={styles.title}> {'Location'} </Text>
                <MapView style={styles.mapView}
                    initialRegion={{
                        latitude: this.state.data.coordinate._latitude,
                        longitude: this.state.data.coordinate._longitude,
                        latitudeDelta: LATITUDEDELTA,
                        longitudeDelta: LONGITUDEDELTA,
                    }}
                >
                    <Marker
                        coordinate={{
                            latitude: this.state.data.coordinate._latitude,
                            longitude: this.state.data.coordinate._longitude,
                        }}
                    />
                </MapView>
                <Text style={styles.title}> {'Extra info'} </Text>
                <View style={styles.extra}>
                    {extraInfoArr}
                </View>
                <Text style={styles.title}> {'Reviews'} </Text>
                <FlatList
                    data={this.state.reviews}
                    renderItem={this.renderReviewItem}
                    keyExtractor={item => `${item.id}`}
                    initialNumToRender={5}
                />
            </ScrollView>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
    },
    title: {
        fontFamily: AppStyles.fontName.bold,
        fontWeight: 'bold',
        color: AppStyles.color.title,
        fontSize: 25,
        padding: 10,
    },
    description: {
        fontFamily: AppStyles.fontName.bold,
        padding: 10,
        color: AppStyles.color.description,
    },
    photoItem: {
        backgroundColor: 'green',
        height: 250,
        width: '100%',
    },
    paginationContainer: {
        flex: 1,
        position: 'absolute',
        alignSelf: 'center',
        // backgroundColor: 'green',
        paddingVertical: 8,
        marginTop: 220,
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 0
    },
    mapView: {
        width: '100%',
        height: 200,
        backgroundColor: AppStyles.color.grey,

    },
    extra: {
        padding:30,
        paddingTop: 10,
        paddingBottom: 10,
    },
    extraRow: {
        flexDirection: 'row',
        paddingBottom: 10,
    },
    extraKey: {
        flex: 1,
        color: AppStyles.color.title,
        fontWeight: 'bold',
    },
    extraValue: {
        flex: 1,
    }

});

export default DetailsScreen;