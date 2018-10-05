import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import Button from 'react-native-button';
import { AppStyles } from '../AppStyles';

class SignupScreen extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            fullname: 'John smith',
            phone: '111',
            email: 'jhon@gmail.com',
            password: '111111',
        };
    }

    onRegister = () => {
        this.props.navigation.dispatch({ type: 'Login' });
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={[styles.title, styles.leftTitle]}>Create new account</Text>
                <View style={styles.InputContainer}>
                    <TextInput style={styles.body} placeholder="Full Name" onChangeText={(text) => this.setState({ fullname: text })} value={this.state.fullname} placeholderTextColor={AppStyles.color.grey} underlineColorAndroid='transparent' />
                </View>
                <View style={styles.InputContainer}>
                    <TextInput style={styles.body} placeholder="Phone Number" onChangeText={(text) => this.setState({ phone: text })} value={this.state.phone} placeholderTextColor={AppStyles.color.grey} underlineColorAndroid='transparent' />
                </View>
                <View style={styles.InputContainer}>
                    <TextInput style={styles.body} placeholder="E-mail Address" onChangeText={(text) => this.setState({ email: text })} value={this.state.email} placeholderTextColor={AppStyles.color.grey} underlineColorAndroid='transparent' />
                </View>
                <View style={styles.InputContainer}>
                    <TextInput style={styles.body} placeholder="Password" secureTextEntry={true} onChangeText={(text) => this.setState({ password: text })} value={this.state.password} placeholderTextColor={AppStyles.color.grey} underlineColorAndroid='transparent' />
                </View>
                <Button containerStyle={[styles.facebookContainer, { marginTop: 50 }]} style={styles.facebookText} onPress={() => this.onRegister()}>Sign Up</Button>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    title: {
        fontSize: AppStyles.fontSize.title,
        fontWeight: 'bold',
        color: AppStyles.color.main,
        marginTop: 20,
        marginBottom: 20,
    },
    leftTitle: {
        alignSelf: 'stretch',
        textAlign: 'left',
        marginLeft: 20
    },
    content: {
        paddingLeft: 50,
        paddingRight: 50,
        textAlign: 'center',
        fontSize: AppStyles.fontSize.content,
        color: AppStyles.color.text,
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
    placeholder: {
        fontFamily: AppStyles.fontName.text,
        color: 'red'
    },
    InputContainer: {
        width: AppStyles.textInputWidth.main,
        marginTop: 30,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: AppStyles.color.grey,
        borderRadius: AppStyles.borderRadius.main,
    },
    body: {
        height: 42,
        paddingLeft: 20,
        paddingRight: 20,
        color: AppStyles.color.text,
    },
    facebookContainer: {
        width: AppStyles.buttonWidth.main,
        backgroundColor: AppStyles.color.facebook,
        borderRadius: AppStyles.borderRadius.main,
        padding: 10,
        marginTop: 30,
    },
    facebookText: {
        color: AppStyles.color.white
    },
});

export default SignupScreen;