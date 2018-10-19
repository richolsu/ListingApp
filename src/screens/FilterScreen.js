import React from 'react';
import { ScrollView, StyleSheet, Text, View } from "react-native";
import firebase from 'react-native-firebase';
import ModalSelector from 'react-native-modal-selector';
import { AppStyles } from '../AppStyles';

const FILTER_SQUARE_FEET = "square_feet";
const FILTER_BEDROOMS = "bedrooms";
const FILTER_PRICE_RANGE = "price_range";
const FILTER_BUY_OR_RENT = "buy_or_rent";
const FILTER_YEAR_BUILT = "year_built";
const FILTER_NEW_ONLY = "new_only";

class FilterScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Filters',
    });

    constructor(props) {
        super(props);

        this.ref = firebase.firestore().collection('listing_filters');
        this.unsubscribe = null;

        this.state = {
            loading: false,
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
    }

    componentWillUnmount() {
        this.unsubscribe();
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

    render() {
        selectorArray = this.state.data.map(item => {
            return this.renderItem(item);
        })

        return (
            <ScrollView style={styles.body}>
                {selectorArray}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        paddingLeft: 10,
        paddingRight: 10,
    },
    container: {
        justifyContent: 'center',
        height: 65,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: AppStyles.color.grey,
    },
    title: {
        flex: 2,
        textAlignVertical: 'center',
        textAlign: 'left',
        alignItems: 'center',
        color: AppStyles.color.grey,
        fontSize: 19,
        fontFamily: AppStyles.fontName.bold,
    },
    value: {
        textAlignVertical: 'center',
        textAlign: 'right',
        height: '100%',
        color: AppStyles.color.grey,
        fontFamily: AppStyles.fontName.bold,
    },

});

export default FilterScreen;