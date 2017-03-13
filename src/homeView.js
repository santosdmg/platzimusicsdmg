import React, { Component } from 'react';
import ArtistList  from './artistList';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';

import getArtist from './api-client';

export default class HomeView extends Component {
    state ={
        artists: null,
    }
    componentDidMount(){
        getArtist().then(data => this.setState({ artists: data}))
    }
    render() {
        const artists = this.state.artists;

        return (
            <View style={styles.container}>
                {!artists && <ActivityIndicator size="large"/>}
                {artists && <ArtistList artists={artists} />}
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.select({
            ios: 30,
            android: 10,
        }),
        backgroundColor: 'lightgray',
    },
});
