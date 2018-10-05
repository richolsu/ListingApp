import React from 'react';
import { Button, Text, View } from 'react-native';
import LeftButton from '../components/LeftButton';
import FilterButton from '../components/FilterButton';

class HomeScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Home',              
        headerRight: <FilterButton onPress={() => { navigation.navigate('Filter') }} />,
        headerLeft: <LeftButton onPress={() => { navigation.dispatch({type: 'Logout'}) }} />,  
    });

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

export default HomeScreen;