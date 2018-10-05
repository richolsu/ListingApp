import React from 'react';
import { Animated, Easing } from 'react-native';
import { connect } from 'react-redux';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import { createReactNavigationReduxMiddleware, reduxifyNavigator } from 'react-navigation-redux-helpers';
import Icon from 'react-native-vector-icons/FontAwesome';
import HomeScreen from '../screens/HomeScreen';
import CategoryScreen from '../screens/CategoryScreen';
import DetailScreen from '../screens/DetailScreen';
import FilterScreen from '../screens/FilterScreen';
import ListingScreen from '../screens/ListingScreen';
import LoginScreen from '../screens/LoginScreen';
import MapScreen from '../screens/MapScreen';
import SavedListingScreen from '../screens/SavedListingScreen';
import SearchScreen from '../screens/SearchScreen';
import SignupScreen from '../screens/SignupScreen';
import WelcomeScreen from '../screens/WelcomeScreen';


const noTransitionConfig = () => ({
    transitionSpec: {
        duration: 0,
        timing: Animated.timing,
        easing: Easing.step0
    }
})

const middleware = createReactNavigationReduxMiddleware(
    'root',
    state => state.nav
);

// login stack
const LoginStack = createStackNavigator({
    Login: { screen: LoginScreen },
    Signup: { screen: SignupScreen },
    Welcome: { screen: WelcomeScreen }
}, {
        initialRouteName: 'Welcome',
        headerMode: 'float',
        cardStyle: { backgroundColor: '#FFFFFF' },
    }
);

const HomeStack = createStackNavigator({
    Home: { screen: HomeScreen },
    Filter: { screen: FilterScreen },
    Listing: { screen: ListingScreen },
    Detail: { screen: DetailScreen },
    Map: { screen: MapScreen }
}, {
        initialRouteName: 'Home',
        headerMode: 'float',
        navigationOptions: ({ navigation }) => ({
            headerTitleStyle: {
                fontWeight: 'bold',
                textAlign: 'center',
                alignSelf: 'center',
                flex: 1,
                fontFamily: 'FallingSkyCond',
            },
        }),
        cardStyle: { backgroundColor: '#FFFFFF' },
    }
);

const CollectionStack = createStackNavigator({
    Category: { screen: CategoryScreen },
    Listing: { screen: ListingScreen },
    Detail: { screen: DetailScreen },
    Map: { screen: MapScreen }
}, {
        initialRouteName: 'Category',
        headerMode: 'float',
        cardStyle: { backgroundColor: '#FFFFFF' },
        navigationOptions: ({ navigation }) => ({
            headerTitleStyle: {
                fontWeight: 'bold',
                textAlign: 'center',
                alignSelf: 'center',
                flex: 1,
                fontFamily: 'FallingSkyCond',
            },
        }),
    }
);

const SavedListingStack = createStackNavigator({
    SavedListing: { screen: SavedListingScreen },
    Detail: { screen: DetailScreen },
    Map: { screen: MapScreen }
}, {
        initialRouteName: 'SavedListing',
        headerMode: 'float',
        cardStyle: { backgroundColor: '#FFFFFF' },
        navigationOptions: ({ navigation }) => ({
            headerTitleStyle: {
                fontWeight: 'bold',
                textAlign: 'center',
                alignSelf: 'center',
                flex: 1,
                fontFamily: 'FallingSkyCond',
            },
        }),

    }
);

const SearchStack = createStackNavigator({
    Search: { screen: SearchScreen },
    Detail: { screen: DetailScreen },
    Map: { screen: MapScreen }
}, {
        initialRouteName: 'Search',
        headerMode: 'float',
        cardStyle: { backgroundColor: '#FFFFFF' },
        navigationOptions: ({ navigation }) => ({
            headerTitleStyle: {
                fontWeight: 'bold',
                textAlign: 'center',
                alignSelf: 'center',
                flex: 1,
                fontFamily: 'FallingSkyCond',
            },
        }),
    }
);



const TabNavigator = createBottomTabNavigator(
    {
        Home: { screen: HomeStack },
        Collections: { screen: CollectionStack },
        Saved: { screen: SavedListingStack },
        Search: { screen: SearchStack },
    },
    {
        navigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused, tintColor }) => {
                const { routeName } = navigation.state;
                let iconName;
                if (routeName === 'Home') {
                    iconName = "home";
                } else if (routeName === 'Collections') {
                    iconName = "book";
                } else if (routeName === 'Saved') {
                    iconName = "heart";
                } else if (routeName === 'Search') {
                    iconName = "search";
                }

                // You can return any component that you like here! We usually use an
                // icon component from react-native-vector-icons
                return <Icon name={iconName} size={25} color={tintColor} />;
            },
        }),
        tabBarOptions: {
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray',
        },
    }
);

// Manifest of possible screens
const RootNavigator = createStackNavigator({
    LoginStack: { screen: LoginStack },
    TabNavigator: { screen: TabNavigator }
}, {
        // Default config for all screens
        headerMode: 'none',
        initialRouteName: 'loginStack',
        transitionConfig: noTransitionConfig
    })

const AppWithNavigationState = reduxifyNavigator(RootNavigator, 'root');

const mapStateToProps = state => ({
    state: state.nav,
});

const AppNavigator = connect(mapStateToProps)(AppWithNavigationState);

export { RootNavigator, AppNavigator, middleware };