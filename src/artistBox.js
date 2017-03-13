import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import { firebaseDatabase, firebaseAuth } from './firebase'

export default class artistBox extends Component {
    state = {
        liked: false,
        likeCount: 0
    }

    componentWillMount() {
        const { uid } = firebaseAuth.currentUser
        this.getArtistRef().on('value', snapshot => {
            const artist = snapshot.val()
            if (artist) {
                this.setState({
                    likeCount: artist.likeCount,
                    liked: artist.likes && artist.likes[uid]
                })
            }
        })
    }

    handlePressLike = () => {
        this.toggleLike(!this.state.liked)
    }

    getArtistRef = () => {
        const { id } = this.props.artist
        return firebaseDatabase.ref(`artist/${id}`)
    }

    toggleLike = (liked) => {
        const { uid } = firebaseAuth.currentUser
        this.getArtistRef().transaction(function(artist) {
            if (artist) {
                if (artist.likes && artist.likes[uid]) {
                    artist.likeCount--;
                    artist.likes[uid] = null;
                } else {
                    artist.likeCount++;
                    if (!artist.likes) {
                        artist.likes = {};
                    }
                    artist.likes[uid] = true;
                }
            }
            return artist || {
                likeCount: 1,
                likes: {
                    [uid]: true
                }
            };
        });
    }

    render() {
        const { image, name, likes, comments } = this.props.artist;
        const likeIcon = this.state.liked ?
            <Icon name="ios-heart" size={30} color="#e74c3c" /> :
            <Icon name="ios-heart-outline" size={30} color="gray" />

        const { likeCount } = this.state
        return (
            <View style={styles.artistBox}>
                <Image style={styles.image} source={{ uri: image}} />
                <View style={styles.info}>
                    <Text style={styles.name}>{name}</Text>
                    <View style= {styles.rowInfo}>
                        <View style={styles.iconsInfo}>
                            <TouchableOpacity onPress={this.handlePressLike}>
                                {likeIcon}
                            </TouchableOpacity>
                            <Text style={styles.count}>{likeCount}</Text>
                        </View>
                        <View style={styles.iconsInfo}>
                            <Icon name="ios-chatboxes-outline" size={30} color="gray" />
                            <Text style={styles.count}>{comments}</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    image: {
        width: 150,
        height: 150,
    },
    artistBox: {
        //  para sobras en iOS
        shadowColor: 'black',
        shadowOpacity: .2,
        shadowOffset: {
            height: 1,
            width: -2,
        },
        //  !para sobras en iOS
        flexDirection: 'row',
        backgroundColor: 'white',
        elevation: 4, //    para sombras en Android
        margin: 5,
    },
    info: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    name: {
        marginTop: 10,
        fontSize: 20,
        color: '#333',
    },
    rowInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 40,
        paddingTop: 15,
    },
    iconsInfo: {
        flex: 1,
        alignItems: 'center'
    },
    count: {
        color: 'gray',
    }
});
