import React, { Component } from 'react';
import {
    View,
    ScrollView,
    KeyboardAvoidingView,
    Text,
    TextInput,
    CheckBox,
    WebView,
    Modal,
    Image
} from 'react-native';
import Dimensions from 'Dimensions';
import Xendit from 'xendit-js-node'

import { Button } from '../components/Button'
import { Spinner } from '../components/Spinner'

const {height, width} = Dimensions.get('window');
const EX_API_KEY = 'xnd_public_development_OIiDfOQh1eCqkZNhKrobEzbCMtKjodl6k3Lk+R1r/GPe/7OgCQRyjw==';

class CardMain extends Component {
    constructor (props) {
        super(props);
        this.state = {
            amount: '75000',
            card_number: '4000000000000002',
            card_exp_month: '12',
            card_exp_year: '2017',
            card_cvn: '123',
            is_multiple_use: false,
            should_authenticate: true,
            should_use_meta: false,
            meta_json: '{}',
            isLoading: false,
            source: '',
            msg: '',
            dsWebView: false,
            creditCardToken: ''
        }
        this.webView = null;
    }

    static navigationOptions = {
        header: null
    }

    paymentForm () {
        Xendit.setPublishableKey(EX_API_KEY);

        // Request a token from Xendit:
        var tokenData = this.getTokenData();
        var fraudData = this.getFraudData();

        if (this.state.should_use_meta) {
            Xendit.card.createToken(tokenData, fraudData, this.xenditResponseHandler.bind(this));
        } else {
            Xendit.card.createToken(tokenData, this.xenditResponseHandler.bind(this));
        }
    }

    getTokenData () {
        return {
            amount: this.state.amount,
            card_number: this.state.card_number,
            card_exp_month: this.state.card_exp_month,
            card_exp_year: this.state.card_exp_year,
            card_cvn: this.state.card_cvn,
            is_multiple_use: this.state.is_multiple_use,
            should_authenticate: this.state.should_authenticate
        };
    }

    getFraudData () {
        return JSON.parse(this.state.meta_json);
    }

    xenditResponseHandler (err, creditCardToken) {
        if (err) {
            this.setState({ isLoading: false });
            return this.displayError(err);
        }
        this.setState({ creditCardToken: creditCardToken })

        if (creditCardToken.status === 'APPROVED' || creditCardToken.status === 'VERIFIED') {
            this.displaySuccess(creditCardToken);
        } else if (creditCardToken.status === 'IN_REVIEW') {
            this.setState({ source: creditCardToken.payer_authentication_url })
        } else if (creditCardToken.status === 'FRAUD') {
            this.displayError(creditCardToken);
        } else if (creditCardToken.status === 'FAILED') {
            this.displayError(creditCardToken);
        }

        this.setState({ isLoading: false });
        this.setState({ dsWebView: true });
    }

    displayError (err) {
        var requestData = Object.assign({}, this.getTokenData(), this.getFraudData());

        if (this.state.should_use_meta) {
            requestData["meta_enabled"] = true;
        } else {
            requestData["meta_enabled"] = false;
        }

        alert(
            'Error: \n' +
            JSON.stringify(err, null, 4) +
            '\n\n' +
            'Request Data: \n' +
            JSON.stringify(requestData, null, 4)
        );
    };

    displaySuccess (creditCardToken) {
        var requestData = Object.assign({}, this.getTokenData(), this.getFraudData());

        if (this.state.should_use_meta) {
            requestData["meta_enabled"] = true;
        } else {
            requestData["meta_enabled"] = false;
        }

        alert(
            'RESPONSE: \n' +
            JSON.stringify(creditCardToken, null, 4) +
            '\n\n' +
            'Request Data: \n' +
            JSON.stringify(requestData, null, 4)
        );
    }

    onMessage(event) {
        console.log(event.nativeEvent.data);
        this.setState({ dsWebView: false });
        alert(event.nativeEvent.data);
    }

    render () {
        const { navigate } = this.props.navigation;

        const {
            parentContainerStyle,
            cardDetailsContainer,
            metaDetailsContainer,
            labelText,
            labelTextSect,
            inputForm,
            smallInputForm,
            onTop
        } = styles;

        Xendit.setPublishableKey(EX_API_KEY);

        return(
            <KeyboardAvoidingView style={ parentContainerStyle }>
                <View style={ cardDetailsContainer }>
                    { this.state.isLoading ?
                        <View style={ onTop }>
                            <Spinner
                              size="large"
                              feedback="Tokenizing..."
                              textColor='#FFF'
                            />
                        </View>
                        : <Text></Text>
                    }

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.dsWebView}
                        onRequestClose={() => this.setState({ dsWebView: false }) }
                        hidden={true}
                    >
                        { this.render3dsWebView() }
                    </Modal>

                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: 85, marginTop: -25, marginBottom: 20, marginLeft: -20, marginRight: -20, backgroundColor: '#3498db' }}>
                        <Image
                            source={ require('../img/xendit-logo.png') }
                            style={{ height:55 , width:225 }}
                        />
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: "center" }}>
                        <Text style={ labelText }>
                            Is Multi-Use
                        </Text>
                        <Text style={ labelText }>
                            Skip Authentication
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: "center" }}>
                        <CheckBox
                            value={ this.state.is_multiple_use }
                            onValueChange={ (e) => this.setState({ is_multiple_use: e }) }
                            style={{ right: 65 }}
                        />
                        <CheckBox
                            value={ this.state.should_authenticate === true ? false : true }
                            onValueChange={ (e) => this.setState({ should_authenticate: !e }) }
                            style={{ left: 20 }}
                        />
                    </View>

                    <Text style={ labelText }>
                        AMOUNT
                    </Text>
                    <TextInput
                        value={ this.state.amount }
                        onChangeText={ (amount) => this.setState({ amount }) }
                        placeholder="Amount"
                        underlineColorAndroid="transparent"
                        style={ inputForm }
                    />

                    <Text style={ labelText }>
                        CARD NUMBER
                    </Text>
                    <TextInput
                        value={ this.state.card_number }
                        onChangeText={ (card_number) => this.setState({ card_number }) }
                        placeholder="Card number"
                        underlineColorAndroid="transparent"
                        style={ inputForm }
                    />

                    <View style={{ flexDirection: 'row' }}>
                        <Text style={ labelTextSect }>
                            EXP MONTH
                        </Text>
                        <Text style={ labelTextSect }>
                            EXP YEAR
                        </Text>
                        <Text style={ labelTextSect }>
                            CVN CODE
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <TextInput
                            value={ this.state.card_exp_month }
                            onChangeText={ (card_exp_month) => this.setState({ card_exp_month }) }
                            placeholder="EXP Month"
                            underlineColorAndroid="transparent"
                            style={ smallInputForm }
                        />

                        <TextInput
                            value={ this.state.card_exp_year }
                            onChangeText={ (card_exp_year) => this.setState({ card_exp_year }) }
                            placeholder="EXP Year"
                            underlineColorAndroid="transparent"
                            style={ smallInputForm }
                        />

                        <TextInput
                            value={ this.state.card_cvn }
                            onChangeText={ (card_cvn) => this.setState({ card_cvn }) }
                            placeholder="CVN Code"
                            underlineColorAndroid="transparent"
                            style={ smallInputForm }
                        />
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <Button
                            onPress={ () => {
                                this.paymentForm();
                                this.setState({ isLoading: true });
                            }}
                            buttonText="Bayar"
                            buttonText2="Sekarang"
                            buttonTextPaddingTop={ 5 }
                            buttonTextPaddingBottom={ 1 }
                            color="#2ecc71"
                            height={ 130 }
                            width={ 130 }
                            borderRadius={ 100 }
                        >
                        </Button>
                    </View>
                </View>

                <View>
                    { /* this.renderMetaDetailsContainer() */ }
                </View>
            </KeyboardAvoidingView>
        );
    }

    renderMetaDetailsContainer () {
        const {
            metaDetailsContainer,
            labelText,
            inputForm
        } = styles;

        return (
            <View style={ metaDetailsContainer }>
                <Text style={ labelText }>
                    Meta Details
                </Text>
                <Text style={ labelText }>
                    JSON:
                </Text>
                <TextInput
                    multiline = {true}
                    numberOfLines = {4}
                    value={ this.state.meta_json }
                    onChangeText={ (meta_json) => this.setState({ meta_json }) }
                    style={ inputForm }
                    height={ 100 }
                />

                <Text style={ labelText }>
                    Enable Meta
                </Text>
                <CheckBox
                    value={ this.state.should_use_meta }
                    onValueChange={ (e) => this.setState({ should_use_meta: e }) }
                />
            </View>
        );
    }

    render3dsWebView () {
        const { webViewOnTop, cardDetailsContainer, modalDetailsContainer, cardDetailsContainer2 } = styles;

        return (
            <View style={ cardDetailsContainer }>
                <View style={ modalDetailsContainer }>
                    <Button
                        onPress={ () => this.setState({ dsWebView: false }) }
                        buttonText="Close"
                        color="#e74c3c"
                        height={ 40 }
                        width={ 70 }
                        borderRadius={ 15 }
                    >
                    </Button>
                    <Button
                        onPress={ () => alert(JSON.stringify(this.state.creditCardToken)) }
                        buttonText="Token"
                        color="#EB9486"
                        height={ 40 }
                        width={ 70 }
                        borderRadius={ 15 }
                    >
                    </Button>
                </View>

                <View style={ cardDetailsContainer2 }>
                    <WebView
                        source={{ uri: this.state.source }}
                        ref={( webView ) => this.webView = webView}
                        onMessage={ this.onMessage.bind(this) }
                    />
                </View>
            </View>
        );
    }
}

const styles = {
    parentContainerStyle: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#95a5a6'
    },
    cardDetailsContainer: {
        flex: 1,
        flexDirection: 'column',
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 20,
        paddingRight: 20,
        height: 500,
        backgroundColor: '#FEFDFF'
    },
    cardDetailsContainer2: {
        flex: 1,
        flexDirection: 'column',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: '#FEFDFF'
    },
    metaDetailsContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: 400,
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: '#FEFDFF'
    },
    modalDetailsContainer: {
        flexDirection: 'row',
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: '#FEFDFF'
    },
    labelText: {
        marginRight: 20,
        color: '#000',
        fontWeight: 'bold'
    },
    labelTextSect: {
        marginRight: 30,
        color: '#000',
        fontWeight: 'bold'
    },
    inputForm: {
        height: 40,
        width: 200,
        marginBottom: 19,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderRadius: 7,
        color: '#000',
        borderColor: '#bdc3c7',
        backgroundColor: '#FEFDFF'
    },
    smallInputForm: {
        height: 40,
        width: 80,
        marginBottom: 19,
        marginRight: 22,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderRadius: 7,
        color: '#000',
        borderColor: '#bdc3c7',
        backgroundColor: '#FEFDFF'
    },
    onTop: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999,
        backgroundColor: '#7f8c8d99'
    },
    webViewOnTop: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999,
        backgroundColor: '#FFF'
    }
}

export default CardMain;
