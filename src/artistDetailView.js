import React, { Component } from 'react';
import {
  View,
  StyleSheet,
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
        //cuando se agrega un nuevo comentario
        this.getArtistCommentsRef().on('child_added', this.addComment);
        //llenar array de comentarios para mostrarlas
        this.getArtistCommentsRef().once('value', snapshot =>{
            var comments = [];
            snapshot.forEach( comment => {
                comments = comments.concat(comment.val())
            })
            this.setState({
                comments,
            })
        })
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
        return (
            <View style={styles.container}>
                <ArtistBox artist={artist} />
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
    container: {
        flex: 1,
        paddingTop: 65,
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
});
