import React, { Component } from 'react';
import { Modal, TouchableOpacity, Text, SafeAreaView, Platform } from 'react-native';
import { WebView } from 'react-native-webview';


const RETURN_URL = 'https://gateway.paylike.io/acs-response';
const parsePaResJS =
    `window.addEventListener('message', function( e ) {
	    window.ReactNativeWebView.postMessage(e.data && e.data.pares);
    });
    
    var script = document.getElementsByTagName('script')[0];
    new Function('"use strict";' + script.text)();
    true;`

const TdsState = {
    PENDING_ACS: 'PENDING_ACS',
    LOADED_ACS: 'LOADED_ACS',

    PENDING_RETURN: 'PENDING_RETURN',
    LOADED_RETURN: 'LOADED_RETURN',
}

export default class TdsDropIn extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tdsState: TdsState.PENDING_ACS,
            retries: 0,
        };
        if (this.props.tds == null) throw {error: "TDS IS NULL"};
    }

    _onMessage = (pares) => {
        if (pares != null) {
            this.props.on3DSDone(pares);
        } else {
            this.props.on3DSFailed();
        }
    }

    _onError = async (event) => {
        if (this.state.tdsState === TdsState.PENDING_ACS && this.state.retries < 3) {
            this.setState({
                retries: this.state.retries + 1,
            });
            this.ref.reload();
            return;
        }
        this.props.on3DSFailed();
    }

    _onCancel = () => {
        if (this.state.tdsState === TdsState.PENDING_ACS || this.state.tdsState === TdsState.LOADED_ACS) {
            this.ref.stopLoading();
            this.props.on3DSCanceled();
        }
    }


    _onNavigationStateChange = (navigationState) => {
        const {url, loading} = navigationState;
        if (url == null) return;

        if (url.includes(this.props.tds.url)) {
            const tdsState = loading ? TdsState.PENDING_ACS : TdsState.LOADED_ACS;
            this.setState({tdsState});
            return;
        }

        if (url.includes(RETURN_URL) && loading) {
            const tdsState = TdsState.PENDING_RETURN;
            this.setState({tdsState});
            return;
        }

        if (url.includes(RETURN_URL) && !loading) {
            const tdsState = TdsState.LOADED_RETURN;
            this.setState({tdsState});
            this.ref.injectJavaScript(parsePaResJS);
            return;
        }
    }

    render() {
        return (
                <Modal visible={true} style={{ flex: 1, paddingTop: 20 }}>
                    <SafeAreaView style={{flex: 1}}>
                        <TouchableOpacity onPress={this._onCancel} style={{padding: 20, alignSelf: 'flex-end'}}>
                            <Text style={{fontSize: 15, fontWeight: 'bold'}}>✕</Text>
                        </TouchableOpacity>
                        <WebView
                            bounces={false}
                            ref={r=>(this.ref = r)}
                            source={{
                                uri: this.props.tds.url,
                                method: 'POST',
                                headers: Platform.OS === 'ios' && {'Content-Type': 'application/x-www-form-urlencoded'},
                                body: 'PaReq=' + encodeURIComponent(this.props.tds.pareq) + '&TermUrl=' + encodeURIComponent(RETURN_URL) + '&MD=' + encodeURIComponent(this.props.tds.oid),
                            }}
                            onHttpError={this._onError}
                            onError={this._onError}
                            onMessage={event => {
                                this._onMessage(event.nativeEvent.data);
                            }}
                            onNavigationStateChange={this._onNavigationStateChange}
                            javaScriptEnabled={true}
                        />
                    </SafeAreaView>
                </Modal>
        );
    }
}
