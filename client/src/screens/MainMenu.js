import React, { Component } from 'react';
import { View, Text, Image, KeyboardAvoidingView, StatusBar } from 'react-native';

import {
    Button
} from '../components/Button'

class MainMenu extends Component {
    constructor (props) {
        super(props);
    }

    static navigationOptions = {
        header: null
    }

    render () {
        const { navigate } = this.props.navigation;

        const {
            parentContainerStyle,
            menuContainer
        } = styles;

        return (
            <KeyboardAvoidingView behavior="padding" style={ parentContainerStyle }>
                <View style={ menuContainer }>
                    <Button
                        onPress={ () => navigate('CardMainScreen') }
                        buttonText={'Credit Card Menu'}
                    >
                    </Button>
                </View>
            </KeyboardAvoidingView>
        )
    }
}

const styles = {
    parentContainerStyle: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#F9F8F8'
    },
    menuContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: 200,
        top: 190,
        backgroundColor: '#FEFDFF',
        borderWidth: 1,
        borderRadius: 25
    }
}

export default MainMenu;
