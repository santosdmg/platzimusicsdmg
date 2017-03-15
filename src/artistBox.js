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
import Share, { ShareSheet, Button} from 'react-native-share'

export default class artistBox extends Component {
    state = {
        liked: false,
        likeCount: 0,
        comenttot: 0,
        visible: false,
    }

    onCancel() {
        this.setState({
            visible:false
        });
    }

    onOpen() {
        this.setState({
            visible:true,
        });
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

    componentDidMount() {
        this.getArtistCommentsRef().on('child_added', this.countComment)
    }

    countComment = () => {
        let  commentCount = 0;

        this.getArtistCommentsRef().once('value', snapshot => {
            snapshot.forEach( comment => {
                commentCount = commentCount+1;
            })
            this.setState({
                comenttot: commentCount,
            })
        })
    }

    componentWillUnmount() {
        this.getArtistCommentsRef().off('child_added', this.countComment)
    }

    handlePressLike = () => {
        this.toggleLike(!this.state.liked)
    }

    getArtistRef = () => {
        const { id } = this.props.artist
        return firebaseDatabase.ref(`artist/${id}`)
    }

    getArtistCommentsRef = () => {
        const { id } = this.props.artist
        return firebaseDatabase.ref(`comments/${id}`)
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
        const { image, name, url } = this.props.artist;
        let shareOptions = {
            title: name,
            message: name,
            url: url,
            subject: "Compartir Artista"
        };


        const likeIcon = this.state.liked ?
            <Icon name="ios-heart" size={30} color="#e74c3c" /> :
            <Icon name="ios-heart-outline" size={30} color="gray" />

        const { likeCount, comenttot } = this.state
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
                            <Text style={styles.count}>{comenttot}</Text>
                        </View>
                        <View style={styles.iconsInfo}>
                            <TouchableOpacity onPress={()=>{
                                Share.open(shareOptions)
                            }}>
                                <Icon name="md-share" size={30} color="#7f8c8d" />
                            </TouchableOpacity>
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
        marginHorizontal: 30,
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
