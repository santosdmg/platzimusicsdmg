import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Platform,
} from 'react-native';

import ArtistBox  from './artistBox';

export default class ArtistDetailView extends Component {
    render() {
        const artist = this.props.artist;
        const isAndroid = Platform.OS === 'android';
        container = (styles) =>{
            if(isAndroid){
                return styles.containerandroid
            }
            else {
                return styles.containerios
            }
        }
        return (
            <View style={container(styles)}>
                <ArtistBox artist={artist} />
            </View>

        );
    }
}

const styles = StyleSheet.create({
    containerios: {
        flex: 1,
        paddingTop: 65,
        backgroundColor: 'lightgray',
    },
    containerandroid: {
        flex: 1,
        paddingTop: 20,
        backgroundColor: 'lightgray',
    },
});
