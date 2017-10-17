import React, { Component } from 'react';
import { Text, TouchableOpacity } from 'react-native';

const Button = function ({ onPress, buttonText, buttonText2, buttonTextPaddingTop, buttonTextPaddingBottom, width, height, color, borderRadius }) {
    const styles = {
        textStyle: {
    		alignSelf: 'center',
    		color: '#fff',
            fontSize: 16,
    		fontWeight: 'bold',
    		paddingTop: buttonTextPaddingTop || 12,
    		paddingBottom: buttonTextPaddingBottom || 1
    	},
        textStyle2: {
    		alignSelf: 'center',
    		color: '#fff',
    		fontSize: 16,
    		fontWeight: 'bold',
    		paddingTop: 0,
    		paddingBottom: 10
    	},
    	buttonStyle: {
            justifyContent: 'center',
            alignItems: 'center',
            width: width || 145,
            height: height || 60,
    		borderRadius: borderRadius || 10,
    		marginLeft: 5,
    		marginRight: 5,
            backgroundColor: color || '#007aff'
    	}
    }

    const { buttonStyle, textStyle, textStyle2 } = styles;

    return(
        <TouchableOpacity onPress={ onPress } style={ buttonStyle }>
            <Text style={ textStyle }>
                { buttonText }
            </Text>
            <Text style={ textStyle2 }>
                { buttonText2 }
            </Text>
        </TouchableOpacity>
    )
}

export { Button };
