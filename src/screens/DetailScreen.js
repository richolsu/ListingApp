import React from 'react';
import { StyleSheet, ScrollView, Button, Text, View } from 'react-native';
import { AppStyles } from '../AppStyles';
import firebase from 'react-native-firebase';
import FastImage from 'react-native-fast-image'

class DetailsScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: typeof (navigation.state.params) == 'undefined' || typeof (navigation.state.params.item) == 'undefined' ? 'Detail' : navigation.state.params.item.name,
    });

    constructor(props) {
        super(props);

        const { navigation } = props;
        const item = navigation.getParam('item');
console.log(item);
        this.ref = firebase.firestore().collection('Listings').doc(item.id);
        this.unsubscribe = null;

        this.state = {
            loading: false,
            data: item,
            page: 1,
            seed: 1,
            error: null,
            refreshing: false,
            count: 1,
            photo: item.photo,
        };
    }

    onDocUpdate = (doc) => {
        const listing = doc.data();
        console.log(listing);
        this.setState({
            data: listing,
            loading: false,
        });
    }

    componentDidMount() {
        this.unsubscribe = this.ref.onSnapshot(this.onDocUpdate)
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        
        return (
            <ScrollView style={styles.container}>
                <Text style={styles.title}> {this.state.data.name} </Text>
                <FastImage
                    source={{
                        uri: this.state.data.cover_photo
                    }}
                    style={styles.photo}
                />
                <Text style={styles.description}> {this.state.data.description} </Text>
            </ScrollView>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        padding: 10,
    },
    title: {
        fontFamily: AppStyles.fontName.bold,
        color: AppStyles.color.text,
        fontSize: 25,
    },
    photo: {
        width: '100%',
        height: 300,
        marginTop: 2,
    },
    detail: {
        height: 65,
        width: 65,
        marginBottom: 5,
    },

});

export default DetailsScreen;