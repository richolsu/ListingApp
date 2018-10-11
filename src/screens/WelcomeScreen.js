import React from 'react';
import Button from 'react-native-button';
import { Text, View, StyleSheet } from 'react-native';
import { AppStyles } from '../AppStyles';

class WelcomeScreen extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Welcome!</Text>
                <Button containerStyle={styles.loginContainer} style={styles.loginText}
                    onPress={() => this.props.navigation.navigate('Login')}>
                    Log In
                </Button>
                <Button containerStyle={styles.signupContainer} style={styles.signupText}
                    onPress={() => this.props.navigation.navigate('Signup')}>
                    Sign Up
                </Button>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 150
    },
    logo: {
        width: 200,
        height: 200,
    },
    title: {
        fontSize: AppStyles.fontSize.title,
        fontWeight: 'bold',
        color: AppStyles.color.main,
        marginTop: 20,
        marginBottom: 20,
    },
    loginContainer: {
        width: AppStyles.buttonWidth.main,
        backgroundColor: AppStyles.color.main,
        borderRadius: AppStyles.borderRadius.main,
        padding: 10,
        marginTop: 30,
    },
    loginText: {
        color: AppStyles.color.white
    },
    signupContainer: {
        width: AppStyles.buttonWidth.main,
        backgroundColor: AppStyles.color.white,
        borderRadius: AppStyles.borderRadius.main,
        padding: 10,
        borderWidth: 1,
        borderColor: AppStyles.color.text,
        marginTop: 30,
    },
    signupText: {
        color: AppStyles.color.text
    },
})

export default WelcomeScreen;