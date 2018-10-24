import React from 'react';
import { StyleSheet, TextInput, View, Image } from "react-native";
import TextButton from 'react-native-button';
import firebase from 'react-native-firebase';
import StarRating from 'react-native-star-rating';
import { connect } from 'react-redux';
import { AppStyles, HeaderButtonStyle, AppIcon } from '../AppStyles';
import Button from 'react-native-button';

class ReviewScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Add a Review',
        headerRight: (<TextButton
            onPress={() => { navigation.goBack(null) }}
            style={HeaderButtonStyle.rightButton}
        >Cancel</TextButton>),
    });

    constructor(props) {
        super(props);

        const { navigation } = props;
        const item = navigation.getParam('item');

        this.state = {
            data: item,
            content: '',
            starCount: 5,
        };
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }


    onPostReview = () => {
        const navigation = this.props.navigation;
        if (!this.state.content) {
            alert("content empty");
            return;
        }

        const user = this.props.user;
        const { data, starCount, content } = this.state;

        firebase.firestore().collection('Reviews')
            .where('listing_id', '==', data.id)
            .where('user_id', '==', user.id)
            .get().then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    doc.ref.delete();
                });
                firebase.firestore().collection('Reviews').add({
                    user_id: user.id,
                    listing_id: data.id,
                    star_count: starCount,
                    content: content
                }).then(function (docRef) {
                    navigation.goBack();
                }).catch(function (error) {
                    alert(error);
                });
            });


    }
    render() {
        return (
            <View style={styles.body}>
                <StarRating containerStyle={styles.starRatingContainer}
                    disabled={false}
                    maxStars={5}
                    starSize={25}
                    starStyle={styles.starStyle}
                    selectedStar={(rating) => this.setState({ starCount: rating })}
                    emptyStar={AppIcon.images.star_nofilled}
                    fullStar={AppIcon.images.star_filled}
                    rating={this.state.starCount}
                />
                <TextInput
                    multiline={true}
                    numberOfLines={2}
                    style={styles.input}
                    onChangeText={(text) => this.setState({ content: text })}
                    value={this.state.content}
                    placeholder="Start typing"
                    placeholderTextColor={AppStyles.color.grey}
                    underlineColorAndroid='transparent' />
                <Button containerStyle={styles.btnContainer} style={styles.btnText} onPress={() => this.onPostReview()}>Add review</Button>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
    },
    input: {
        flex: 1,
        width: '100%',
        padding: 10,
        fontSize: 19,
        textAlignVertical: 'top',
        justifyContent: 'flex-start',
        paddingLeft: 0,
        paddingRight: 0,
        fontFamily: AppStyles.fontName.main,
        color: AppStyles.color.text,
    },
    starRatingContainer: {
        padding: 10,
        width: 90,
        marginTop: 10
    },
    starStyle: {
        tintColor: AppStyles.color.tint 
    },
    btnContainer: {
        width: '100%',
        backgroundColor: AppStyles.color.blue,
        marginTop: 10,
        padding: 10,
    },
    btnText: {
        color: AppStyles.color.white
    },

});

const mapStateToProps = state => ({
    user: state.auth.user,
});

export default connect(mapStateToProps)(ReviewScreen);