import React from 'react';
import { Button, Text, View } from 'react-native';
import { ListItem, SearchBar } from "react-native-elements";

class SearchScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            headerTitle:
                <SearchBar
                    containerStyle={{
                        backgroundColor: 'transparent', borderBottomColor: 'transparent',
                        borderTopColor: 'transparent', flex: 1
                    }}
                    inputStyle={{ backgroundColor: 'rgba(0.9, 0.9, 0.9, 0.1)', borderRadius: 10, color: 'black' }}
                    showLoading
                    clearIcon={true}
                    searchIcon={true}
                    onChangeText={(text) => params.handleSearch(text)}
                    // onClear={alert('onClear')}
                    placeholder='Search' />,
        }
    };

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Home!</Text>
                <Button
                    title="Go to Settings"
                    onPress={() => this.props.navigation.navigate('Settings')}
                />
                <Button
                    title="Go to Details"
                    onPress={() => this.props.navigation.navigate('Details')}
                />
            </View>
        );
    }
}

export default SearchScreen;