import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  TextInput,
  Text,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { firebaseDatabase, firebaseAuth } from './firebase'

import ArtistBox  from './artistBox';
import CommentList from './commentList';

export default class ArtistDetailView extends Component {
    state = {
        comments: [],
    }

    componentDidMount() {
        this.getArtistCommentsRef().on('child_added', this.addComment);
    }

    componentWillUnmount() {
        this.getArtistCommentsRef().off('child_added', this.addComment);
    }

    addComment = (data) => {
        const comment = data.val()
        this.setState({
            comments: this.state.comments.concat(comment),
        })
    }

    handlePressSend = () => {
        const { text } = this.state
        const { uid, photoURL } = firebaseAuth.currentUser
        const artistCommentsRef = this.getArtistCommentsRef()
        var newCommentRef = artistCommentsRef.push();
        newCommentRef.set({
            text,
            userPhoto: photoURL,
            uid,
         });
        this.setState({text: ''})
    }

    getArtistCommentsRef = () => {
        const { id } = this.props.artist
        return firebaseDatabase.ref(`comments/${id}`)
    }

    handleChangeText = (text) => this.setState({text})

    render() {
        const artist = this.props.artist;
        const { comments } = this.state
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
                <Text style={styles.header}>Comentarios</Text>
                <CommentList comments={comments} />
                <View style={styles.inputContainer}>
                    <TextInput
                    style={styles.input}
                    value= {this.state.text}
                    placeholder="Opina sobre este artista"
                    onChangeText={this.handleChangeText}
                    />
                    <TouchableOpacity onPress={this.handlePressSend}>
                        <Icon name="ios-send-outline" size={30} color="gray" />
                    </TouchableOpacity>
                </View>
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
    inputContainer: {
        height: 50,
        backgroundColor: 'white',
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    input:{
        flex: 1,
        height: 50,
    },
    header: {
        fontSize: 20,
        paddingHorizontal: 15,
        marginVertical: 10,
    },
});
