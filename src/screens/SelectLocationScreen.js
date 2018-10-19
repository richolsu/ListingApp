import React from 'react';
import { StyleSheet } from 'react-native';
import TextButton from 'react-native-button';
import MapView, { Marker } from 'react-native-maps';
import { AppStyles, HeaderButtonStyle } from '../AppStyles';
import { Configuration } from '../Configuration';

class SelectLocationScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            title: 'Map View',
            headerRight: (
                <TextButton
                    onPress={params.onDone}
                    style={HeaderButtonStyle.rightButton}
                >Done</TextButton>),
        }
    };

    constructor(props) {
        super(props);

        const { navigation } = props;
        const location = navigation.getParam('location');

        this.state = {
            onSelectLocationDone: navigation.getParam('onSelectLocationDone'),
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: Configuration.map.delta.latitude,
            longitudeDelta: Configuration.map.delta.longitude,
        };
    }

    componentDidMount() {
        this.props.navigation.setParams({
            onDone: this.onDone
        });
    }

    onDone = () => {
        this.props.navigation.goBack();
        this.state.onSelectLocationDone({
            latitude: this.state.latitude,
            longitude: this.state.longitude,
        })
    }

    onPress = (event) => {
        this.setState({ latitude: event.nativeEvent.coordinate.latitude, longitude: event.nativeEvent.coordinate.longitude });
    }

    onRegionChange = (region) => {
        this.setState({
            latitude: region.latitude,
            longitude: region.longitude,
            latitudeDelta: region.latitudeDelta,
            longitudeDelta: region.longitudeDelta,

        })
    }

    render() {
        return (
            <MapView
                ref={(map) => this.map = map}
                onPress={this.onPress}
                style={styles.mapView}
                onRegionChangeComplete={this.onRegionChange}
                region={{
                    latitude: this.state.latitude,
                    longitude: this.state.longitude,
                    latitudeDelta: this.state.latitudeDelta,
                    longitudeDelta: this.state.longitudeDelta,
                }}
            >
                <Marker draggable
                    coordinate={{
                        latitude: this.state.latitude,
                        longitude: this.state.longitude,
                    }}
                    onDragEnd={this.onPress}
                />
            </MapView >
        );
    }
}

const styles = StyleSheet.create({
    mapView: {
        width: '100%',
        height: '100%',
        backgroundColor: AppStyles.color.grey,

    }
})

export default SelectLocationScreen;