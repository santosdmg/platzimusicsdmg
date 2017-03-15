import React, { Component } from 'react';
import {
  AppRegistry,
  View,
  StyleSheet,
  Platform,
} from 'react-native';
import {Scene, Router} from 'react-native-router-flux';

import HomeView from './homeView';
import LoginView from './loginView';
import ArtistDetailView from './artistDetailView';


class PlatziMusicSDMG extends Component {
    render() {
        return (
            <Router>
                <Scene key="login" component={LoginView} hideNavBar />
                <Scene key="root">
                    <Scene key="home" component={HomeView} hideNavBar />
                    <Scene key="artistdetail" component={ArtistDetailView} title="Comentarios" hideNavBar={false} />
                </Scene>
            </Router>
        )
    }
}

AppRegistry.registerComponent('PlatziMusicSDMG', () => PlatziMusicSDMG);
