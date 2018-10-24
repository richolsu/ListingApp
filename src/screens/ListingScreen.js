import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { ListItem } from "react-native-elements";
import firebase from 'react-native-firebase';
import { AppIcon, ListStyle } from '../AppStyles';
import priceFormatter from "../components/CurrencyFormatter";
import HeaderButton from '../components/HeaderButton';
import { Configuration } from '../Configuration';

class ListingScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: typeof (navigation.state.params) == 'undefined' || typeof (navigation.state.params.item) == 'undefined' ? 'Listing' : navigation.state.params.item.name,
        headerRight: <HeaderButton icon={AppIcon.images.map} onPress={() => { navigation.navigate('Map', {item: navigation.state.params.item}) }} />,
    });

    constructor(props) {
        super(props);

        const { navigation } = props;
        const item = navigation.getParam('item');


        this.ref = firebase.firestore().collection('Listings').where('category_id', '==', item.id);
        this.unsubscribe = null;

        this.state = {
            category: item,
            loading: false,
            data: [],
            page: 1,
            seed: 1,
            error: null,
            refreshing: false
        };
    }

    onCollectionUpdate = (querySnapshot) => {
        const data = [];
        querySnapshot.forEach((doc) => {
            const listing = doc.data();
            data.push({...listing, id:doc.id});
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
    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: "86%",
                    backgroundColor: "#CED0CE",
                    marginLeft: "14%"
                }}
            />
        );
    };

    onPress = (item) => {
        this.props.navigation.navigate('Detail', { item: item });
    }

    renderItem = ({ item }) => (
        <ListItem
            key={item.id}
            title={item.name}
            titleStyle={ListStyle.title}
            subtitle={
                <View style={ListStyle.subtitleView}>
                    <View style={ListStyle.leftSubtitle}>
                        <Text style={ListStyle.time}>{Configuration.timeFormat(item.post_time)}</Text>
                        <Text style={ListStyle.place}>{item.place}</Text>
                    </View>
                    <Text style={ListStyle.price}>{priceFormatter(item.price)}</Text>
                </View>
            }
            onPress={() => this.onPress(item)}
            avatarStyle={ListStyle.avatarStyle}
            avatarContainerStyle={ListStyle.avatarStyle}
            avatar={{ uri: item.cover_photo }}
            containerStyle={{ borderBottomWidth: 0 }}
            hideChevron={true}
        />
    );


    render() {
        return (
            <FlatList
                data={this.state.data}
                renderItem={this.renderItem}
                keyExtractor={item => `${item.id}`}
                initialNumToRender={5}
                refreshing={this.state.refreshing}
            />
        );
    }
}


export default ListingScreen;