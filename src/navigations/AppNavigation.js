import React from 'react';
import { Animated, Easing, Image } from 'react-native';
import { connect } from 'react-redux';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import { createReactNavigationReduxMiddleware, reduxifyNavigator } from 'react-navigation-redux-helpers';
import HomeScreen from '../screens/HomeScreen';
import CategoryScreen from '../screens/CategoryScreen';
import DetailScreen from '../screens/DetailScreen';
import FilterScreen from '../screens/FilterScreen';
import ListingScreen from '../screens/ListingScreen';
import LoginScreen from '../screens/LoginScreen';
import PostScreen from '../screens/PostScreen';
import MapScreen from '../screens/MapScreen';
import SelectLocationScreen from '../screens/SelectLocationScreen';
import SavedListingScreen from '../screens/SavedListingScreen';
import SearchScreen from '../screens/SearchScreen';
import SignupScreen from '../screens/SignupScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import { AppIcon, AppStyles } from '../AppStyles';

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
    Post: { screen: PostScreen },
    Map: { screen: MapScreen },
    SelectLocation: { screen: SelectLocationScreen}
}, {
        initialRouteName: 'Home',
        headerMode: 'float',
        headerLayoutPreset: 'center',
        navigationOptions: ({ navigation }) => ({
            headerTitleStyle: {
                fontWeight: 'bold',
                textAlign: 'center',
                flex: 1,
                alignSelf: 'center',
                fontFamily: AppStyles.fontName.main,
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
        headerLayoutPreset: 'center',
        cardStyle: { backgroundColor: '#FFFFFF' },
        navigationOptions: ({ navigation }) => ({
            headerTitleStyle: {
                fontWeight: 'bold',
                textAlign: 'center',
                alignSelf: 'center',
                flex: 1,
                fontFamily: AppStyles.fontName.main,
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
        headerLayoutPreset: 'center',
        cardStyle: { backgroundColor: '#FFFFFF' },
        navigationOptions: ({ navigation }) => ({
            headerTitleStyle: {
                fontWeight: 'bold',
                textAlign: 'center',
                alignSelf: 'center',
                flex: 1,
                fontFamily: AppStyles.fontName.main,
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
        headerLayoutPreset: 'center',
        cardStyle: { backgroundColor: '#FFFFFF' },
        navigationOptions: ({ navigation }) => ({
            headerTitleStyle: {
                fontWeight: 'bold',
                textAlign: 'center',
                alignSelf: 'center',
                flex: 1,
                fontFamily: AppStyles.fontName.main,
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
                    iconName = AppIcon.images.home;
                } else if (routeName === 'Collections') {
                    iconName = AppIcon.images.collections;
                } else if (routeName === 'Saved') {
                    iconName = AppIcon.images.heart;
                } else if (routeName === 'Search') {
                    iconName = AppIcon.images.search;
                }

                
                // You can return any component that you like here! We usually use an
                // icon component from react-native-vector-icons
                return <Image style={{tintColor: focused?AppStyles.color.tint:AppStyles.color.grey}}  source={iconName}/>;
            },
        }),
        tabBarOptions: {
            activeTintColor: AppStyles.color.tint,
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