import React from 'react';
import { FlatList, Picker, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AppStyles } from '../AppStyles';
import firebase from 'react-native-firebase';
import { ListItem } from "react-native-elements";
import Modal from "react-native-modal";

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
            error: null,
            refreshing: false,
            isModalVisible: false
        };
    }

    _toggleModal = () =>
        this.setState({ isModalVisible: !this.state.isModalVisible });

    onCollectionUpdate = (querySnapshot) => {
        const data = [];
        querySnapshot.forEach((doc) => {
            const filter = doc.data();
            data.push({ ...filter, id: doc.id });
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

    onPress = (item) => {
        this.setState({ isModalVisible: !this.state.isModalVisible });
    }


    renderPicker = ({ item }) => (
        <Picker
            selectedValue={this.state.language}
            style={{ height: 50, width: 100 }}
            onValueChange={(itemValue, itemIndex) => this.setState({ language: itemValue })}>
            <Picker.Item label="Java" value="java" />
            <Picker.Item label="JavaScript" value="js" />
        </Picker>
    );

    renderItem = ({ item }) => (
        <ListItem
            key={item.id}
            title={item.name}
            containerStyle={styles.container}
            titleStyle={styles.title}
            rightTitle={item.options[0]}
            rightTitleStyle={styles.rightTitle}
            // onPress={() => this.onPress(item)}
            hideChevron={true}
        />
    );

    render() {
        return (
            <View style={styles.body}>
                <Modal
                    backdropOpacity={1}
                    style={styles.modalContent}
                    isVisible={this.state.isModalVisible}>
                    <View style={{ flex: 1 }}>
                        <TouchableOpacity onPress={this._toggleModal}>
                            <Text>Hide me!</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
                <TouchableOpacity onPress={this._toggleModal}>
                    <Text>Show Modal</Text>
                </TouchableOpacity>
                <Picker selectedValue={'java'} style={{ height: 50, width: 100 }}>
                    <Picker.Item label="Java" value="java" />
                    <Picker.Item label="JavaScript" value="js" />
                </Picker>

                <FlatList
                    style={styles.flatContainer}
                    vertical
                    showsVerticalScrollIndicator={false}
                    data={this.state.data}
                    renderItem={this.renderItem}
                    keyExtractor={item => `${item.id}`}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    flatContainer: {
        paddingLeft: 10,
        paddingRight: 10,
    },
    modalContent: {
        height: 200,
        backgroundColor: "white",
        padding: 22,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        borderColor: "rgba(0, 0, 0, 0.1)",
    },
    container: {
        justifyContent: 'center',
        height: 65,
        borderBottomWidth: 1,
    },
    title: {
        marginLeft:-10,
        width:'150%',
        color: AppStyles.color.grey,
        fontSize: 19,
        fontFamily: AppStyles.fontName.bold,
    },
    rightTitle: {
        marginRight: -10,
    },
});

export default FilterScreen;