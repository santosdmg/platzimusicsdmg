import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Button,
    Text,
} from 'react-native';
import FBSDK, {
    LoginButton,
    AccessToken
} from 'react-native-fbsdk';
import { Actions } from 'react-native-router-flux';

import firebase, { firebaseAuth } from './firebase'


const { FacebookAuthProvider } = firebase.auth;

export default class LoginView extends Component {
    state = {
        credentials: null
    }
    componentWillMount() {
        this.authenticateUser()
    }
    authenticateUser = () => {
        AccessToken.getCurrentAccessToken().then((data) =>{
            const { accessToken } = data;
            const credential = FacebookAuthProvider.credential(accessToken);
            firebaseAuth.signInWithCredential(credential).then((credentials) => {
                Actions.root()
            }, function(error) {
                console.log("Sign In Error", error);
            });
        })
    }

    handleLoginFinished = (error, result) => {
        if (error) {
            console.error(error);
        } else if (result.isCancelled) {
            alert("login is cancelled.");
        } else {
            this.authenticateUser()
        }
    }

    handleButtonPress = () => {
        Actions.root()
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>Bienvenido a PlatziMusicSDMG</Text>
                <LoginButton
                    readPermissions={['public_profile', 'email']}
                    onLoginFinished={ this.handleLoginFinished }
                    onLogoutFinished={() => alert("logout.")}/>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'lightgray',
        justifyContent: 'center',
        alignItems: 'center',
    },
    welcome: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 20,
    }
});
