import React from 'react';
import { ScrollView, StyleSheet, Image, TouchableOpacity, TextInput, Text, View } from "react-native";
import firebase from 'react-native-firebase';
import ModalSelector from 'react-native-modal-selector';
import { AppStyles, AppIcon, ModalSelectorStyle, HeaderButtonStyle } from '../AppStyles';
import TextButton from 'react-native-button';
import FastImage from 'react-native-fast-image'
import { Configuration } from '../Configuration';

const FILTER_SQUARE_FEET = "square_feet";
const FILTER_BEDROOMS = "bedrooms";
const FILTER_PRICE_RANGE = "price_range";
const FILTER_BUY_OR_RENT = "buy_or_rent";
const FILTER_YEAR_BUILT = "year_built";
const FILTER_NEW_ONLY = "new_only";

class PostScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Add Listing',
        headerRight: (<TextButton
            onPress={() => { navigation.goBack(null) }}
            style={HeaderButtonStyle.rightButton}
        >Cancel</TextButton>),
    });

    constructor(props) {
        super(props);

        this.categoryRef = firebase.firestore().collection('Categories').orderBy('order', 'asc');
        this.unsubscribeCategory = null;
        this.ref = firebase.firestore().collection('listing_filters');
        this.unsubscribe = null;

        this.state = {
            loading: false,
            categories: [],
            title: '',
            description: '',
            category: {},
            location: {
                latitude: Configuration.map.origin.latitude,
                longitude: Configuration.map.origin.longitude,
            },
            price: '',
            data: [],
            page: 1,
            seed: 1,
            textInputValue: '',
            error: null,
            refreshing: false,
            language: 'java',
            filter: {
                FILTER_SQUARE_FEET: null,
                FILTER_BEDROOMS: null,
                FILTER_PRICE_RANGE: null,
                FILTER_BUY_OR_RENT: null,
                FILTER_YEAR_BUILT: null,
                FILTER_NEW_ONLY: null,
            },
            isModalVisible: false
        };
    }

    _toggleModal = () =>
        this.setState({ isModalVisible: !this.state.isModalVisible });

    getFilterKey = (filter) => {
        let filter_key = "no_key";
        switch (filter.name) {
            case "Square feet":
                filter_key = FILTER_SQUARE_FEET;
                break;
            case "Bedrooms":
                filter_key = FILTER_BEDROOMS;
                break;
            case "Price Range":
                filter_key = FILTER_PRICE_RANGE;
                break;
            case "Buy or Rent":
                filter_key = FILTER_BUY_OR_RENT;
                break;
            case "Year Built":
                filter_key = FILTER_YEAR_BUILT;
                break;
            case "New Construction Only":
                filter_key = FILTER_NEW_ONLY;
                break;

        };

        return filter_key;
    }

    onCategoryUpdate = (querySnapshot) => {
        const data = [];
        querySnapshot.forEach((doc) => {
            const category = doc.data();
            data.push({ ...category, id: doc.id });
        });

        this.setState({
            categories: data,
            category: data[0],
            loading: false,
        });
    }

    onCollectionUpdate = (querySnapshot) => {
        const data = [];
        querySnapshot.forEach((doc) => {
            const filter = doc.data();
            data.push({ ...filter, id: doc.id });

            this.setState({
                filter: { ...this.state.filter, [this.getFilterKey(filter)]: filter.options[0] }
            });
        });

        this.setState({
            data,
            loading: false,
        });
    }

    componentDidMount() {
        this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate)
        this.unsubscribeCategory = this.categoryRef.onSnapshot(this.onCategoryUpdate)
    }

    componentWillUnmount() {
        this.unsubscribe();
        this.unsubscribeCategory();
    }

    renderItem = (item) => {
        let filter_key = this.getFilterKey(item);
        let selectedValue = this.state.filter.FILTER_SQUARE_FEET;
        switch (filter_key) {
            case FILTER_SQUARE_FEET:
                selectedValue = this.state.filter.square_feet;
                break;
            case FILTER_BEDROOMS:
                selectedValue = this.state.filter.bedrooms;
                break;
            case FILTER_PRICE_RANGE:
                selectedValue = this.state.filter.price_range;
                break;
            case FILTER_BUY_OR_RENT:
                selectedValue = this.state.filter.buy_or_rent;
                break;
            case FILTER_YEAR_BUILT:
                selectedValue = this.state.filter.year_built;
                break;
            case FILTER_NEW_ONLY:
                selectedValue = this.state.filter.new_only;
                break;
        };

        data = item.options.map((option, index) => (
            { key: option, label: option }
        ));
        data.unshift({ key: 'section', label: item.name, section: true });

        console.log(data);
        return (
            <ModalSelector
                touchableActiveOpacity={0.9}
                data={data}
                backdropPressToClose={true}
                cancelText={'Cancel'}
                onChange={(option) => { this.setState({ filter: { ...this.state.filter, [filter_key]: option.key } }) }}>
                <View style={styles.container}>
                    <Text style={styles.title}>{item.name}</Text>
                    <Text style={styles.value}>{selectedValue}</Text>
                </View>
            </ModalSelector>
        );
    }

    handlePriceInputChange = (price) => {
        let newText = '';
        let numbers = '0123456789';

        for (var i = 0; i < price.length; i++) {
            if (numbers.indexOf(price[i]) > -1) {
                newText = newText + price[i];
            }
        }

        this.setState({
            price: newText
        });
    }

    selectLocation = () => {
        this.props.navigation.navigate('SelectLocation', { location: this.state.location, onSelectLocationDone: this.onSelectLocationDone });
    }

    onSelectLocationDone = (location) => {
        this.setState({ location: location });
    }

    render() {
        categoryData = this.state.categories.map((category, index) => (
            { key: category.id, label: category.name }
        ));
        categoryData.unshift({ key: 'section', label: 'Category', section: true });

        return (
            <ScrollView style={styles.body}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Title</Text>
                    <TextInput style={styles.input} value={this.state.title} onChangeText={(text) => this.setState({ title: text })} placeholder="Start typing" placeholderTextColor={AppStyles.color.grey} underlineColorAndroid='transparent' />
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Description</Text>
                    <TextInput
                        multiline={true}
                        numberOfLines={2}
                        style={styles.input}
                        onChangeText={(text) => this.setState({ description: text })}
                        value={this.state.description}
                        placeholder="Start typing"
                        placeholderTextColor={AppStyles.color.grey}
                        underlineColorAndroid='transparent' />
                </View>
                <View style={styles.section}>
                    <View style={styles.row}>
                        <Text style={styles.title}>Price</Text>
                        <TextInput
                            style={styles.priceInput}
                            keyboardType='numeric'
                            value={this.state.price}
                            onChangeText={this.handlePriceInputChange}
                            placeholderTextColor={AppStyles.color.grey}
                            underlineColorAndroid='transparent' />
                    </View>
                    <ModalSelector
                        touchableActiveOpacity={0.9}
                        data={categoryData}
                        sectionTextStyle={ModalSelectorStyle.sectionTextStyle}
                        optionTextStyle={ModalSelectorStyle.optionTextStyle}
                        optionContainerStyle={ModalSelectorStyle.optionContainerStyle}
                        cancelContainerStyle={ModalSelectorStyle.cancelContainerStyle}
                        cancelTextStyle={ModalSelectorStyle.cancelTextStyle}
                        selectedItemTextStyle={ModalSelectorStyle.selectedItemTextStyle}
                        backdropPressToClose={true}
                        cancelText={'Cancel'}
                        initValue={this.state.category.name}
                        onChange={(option) => { this.setState({ category: { id: option.key, name: option.label } }) }}>
                        <View style={styles.row}>
                            <Text style={styles.title}>Category</Text>
                            <Text style={styles.value}>{this.state.category.name}</Text>
                        </View>
                    </ModalSelector>

                    <View style={styles.row}>
                        <Text style={styles.title}>Filters</Text>
                        <Text style={styles.value}>Select...</Text>
                    </View>
                    <TouchableOpacity onPress={this.selectLocation}>
                        <View style={styles.row}>
                            <Text style={styles.title}>Location</Text>
                            <Text style={styles.value}>Select...</Text>
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.addPhotoTitle}>Add Photos</Text>
                    <ScrollView style={styles.photoList} horizontal={true}>
                        <FastImage style={styles.photo} source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/listingapp-f0f38.appspot.com/o/36438b72-b386-45c7-97f2-51c27bc5c2f4.jpg?alt=media&token=b10376d4-3454-48e5-bb68-506f414da5b4' }} />
                        <FastImage style={styles.photo} source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/listingapp-f0f38.appspot.com/o/36438b72-b386-45c7-97f2-51c27bc5c2f4.jpg?alt=media&token=b10376d4-3454-48e5-bb68-506f414da5b4' }} />
                        <View style={[styles.addButton, styles.photo]}>
                            <Image style={styles.photoIcon} source={AppIcon.images.heartFilled} />
                        </View>
                    </ScrollView>
                    <TextButton containerStyle={styles.addButtonContainer} style={styles.addButtonText}>Post Listing</TextButton>

                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: AppStyles.color.background,
    },
    container: {
        justifyContent: 'center',
        height: 65,
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: AppStyles.color.grey,
    },

    sectionTitle: {
        textAlign: 'left',
        alignItems: 'center',
        color: AppStyles.color.title,
        fontSize: 19,
        padding: 10,
        paddingTop: 15,
        paddingBottom: 15,
        fontFamily: AppStyles.fontName.bold,
        fontWeight: 'bold',
        borderBottomWidth: 2,
        borderBottomColor: AppStyles.color.grey,
    },
    input: {
        width: '100%',
        fontSize: 19,
        padding: 10,
        textAlignVertical: 'top',
        justifyContent: 'flex-start',
        paddingLeft: 0,
        paddingRight: 0,
        fontFamily: AppStyles.fontName.main,
        color: AppStyles.color.text,
    },
    priceInput: {
        flex: 1,
        textAlign: 'right',
        paddingRight: 0,
        fontFamily: AppStyles.fontName.main,
        color: AppStyles.color.text,
    },
    title: {
        flex: 1,
        textAlign: 'left',
        alignItems: 'center',
        color: AppStyles.color.title,
        fontSize: 19,
        fontFamily: AppStyles.fontName.bold,
        fontWeight: 'bold',
    },
    value: {
        textAlign: 'right',
        color: AppStyles.color.description,
        fontFamily: AppStyles.fontName.main,
    },
    section: {
        backgroundColor: 'white',
        marginBottom: 10,
    },
    row: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
    },
    addPhotoTitle: {
        color: AppStyles.color.title,
        fontSize: 25,
        paddingLeft: 20,
        marginTop: 20,
        fontFamily: AppStyles.fontName.bold,
        fontWeight: 'bold',
    },
    photoList: {
        height: 80,
        marginTop: 20,
        marginRight: 10,
    },
    photo: {
        marginLeft: 10,
        width: 80,
        height: 80,
        borderRadius: 10,
    },

    addButton: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: AppStyles.color.tint,
    },
    photoIcon: {
        width: 50,
        height: 50,
    },
    addButtonContainer: {
        backgroundColor: AppStyles.color.tint,
        borderRadius: 5,
        padding: 15,
        margin: 10,
        marginTop: 20,
    },
    addButtonText: {
        color: AppStyles.color.white
    },

});

export default PostScreen;