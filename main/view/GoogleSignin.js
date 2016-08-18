const React = require('react')
const {PropTypes} = require('react')
const GoogleLogin = require('react-google-login')['default']
const ObservableData = require('lsd-observable').ObservableData

const GoogleSignin = React.createClass({
    render: function () {
        return (
            <GoogleLogin callback={this._onSignIn} clientId={this.props.clientId} cssClass="btn btn-default" buttonText="Sign in with Google"/>
        )
    },

    getDefaultProps: function() {
        return {accounts: []}
    },

    _onSignIn: function(auth) {
        const authResponse = auth.getAuthResponse();
        const event = new CustomEvent('googleSignIn', {detail: { authResponse }} );
        document.dispatchEvent(event)
    }
})

GoogleSignin.propTypes = {
    clientId: PropTypes.string.isRequired
}


GoogleSignin.Tracker = class GoogleSigninTracker {
    constructor() {
        this.signIn = new ObservableData()
        this.signOut = new ObservableData()
        document.addEventListener('googleSignIn', e =>  this.signIn.value = e.detail.authResponse )
        document.addEventListener('googleSignOut', e => this.signOut.value = null)
    }
}

module.exports = GoogleSignin