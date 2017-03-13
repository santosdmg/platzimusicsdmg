import React, { Component } from 'react';
import ArtistList  from './artistList';
import {
  View,
  StyleSheet,
} from 'react-native';

import getArtist from './api-client';

export default class HomeView extends Component {
    state ={
        artists: [],
    }
    componentDidMount(){
        getArtist().then(data => this.setState({ artists: data}))
    }
    render() {
        const artists = this.state.artists;
        return (
            <View style={styles.container}>
                <ArtistList artists={artists} />
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        backgroundColor: 'lightgray',
    },
});
