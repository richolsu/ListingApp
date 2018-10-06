import React from 'react';
import { StyleSheet, FlatList, Text, Image, View } from 'react-native';
import { AppStyles } from '../AppStyles';
import firebase from 'react-native-firebase';
import { ListItem } from "react-native-elements";

class ListingScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: typeof (navigation.state.params) == 'undefined' || typeof (navigation.state.params.item) == 'undefined' ? 'Listing' : navigation.state.params.item.name,
    });

    constructor(props) {
        super(props);

        const { navigation } = props;
        const item = navigation.getParam('item');


        this.ref = firebase.firestore().collection('Listings').where('category_id', '==', item.id);
        this.unsubscribe = null;

        this.state = {
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
            data.push(listing);
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
            titleStyle={styles.title}
            subtitle={
                <View style={styles.subtitleView}>
                    <View style={styles.leftSubtitle}>
                        <Text style={styles.description}>{item.description}</Text>
                        <Text style={styles.place}>{item.place}</Text>
                    </View>
                    <Text style={styles.price}>${item.price}</Text>
                </View>
            }
            onPress={() => this.onPress(item)}
            avatarStyle={styles.avatarStyle}
            avatarContainerStyle={styles.avatarStyle}
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

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        color: AppStyles.color.text,
        fontFamily: AppStyles.fontName.bold,
    },
    subtitleView: {
        minHeight: 75,
        flexDirection: 'row',
        paddingTop: 5,
        marginLeft: 10,
    },
    leftSubtitle: {
        flex:1,
    },
    description: {
        color: AppStyles.color.text,
        fontFamily: AppStyles.fontName.main,
        flex:1,
        textAlignVertical: 'bottom',  
    },
    place: {

    },
    price: {
        fontSize: 18,
        color: AppStyles.color.text,
        fontFamily: AppStyles.fontName.bold,   
        textAlignVertical: 'bottom',     
    },
    avatarStyle: {
        height: 100,
        width: 100
    }
});

export default ListingScreen;