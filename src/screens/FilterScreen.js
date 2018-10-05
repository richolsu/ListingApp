import React from 'react';
import { Button, Text, View } from 'react-native';

class FilterScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Filters',        
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

export default FilterScreen;