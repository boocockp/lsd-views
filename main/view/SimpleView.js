const _ = require('lodash')
const React = require('react')
const {PropTypes} = require('react')
const {Button} = require('react-bootstrap')
const FormItem = () => require('./FormItem')

let SimpleView = React.createClass({

    getInitialState: function () {
        return {}
    },

    componentWillReceiveProps: function () {
        this.setState(this.getInitialState())
    },

    value: function () {
        return this.state.hasOwnProperty("updatedValue") ? this.state.updatedValue : this.props.value
    },

    render: function () {
        const FormItemClass = FormItem()
        return (
            <div >
                <FormItemClass type={this.props.type} editable={true} onChange={this.onChange} value={this.value()} label={null} />
                <Button onClick={this.onSave}>Save</Button>
            </div>
        )
    },

    onChange: function (value) {
        this.setState({updatedValue: value})
    },

    onSave: function (e) {
        e.preventDefault()
        const updatedValue = this.state.updatedValue;
        if (updatedValue !== this.props.value) {
            console.log('save', updatedValue)
            this.props.onSave(updatedValue)
            this.setState({})
        } else {
            console.log('save', 'no change')
        }
    }
})

SimpleView.propTypes = {
    value: PropTypes.any.isRequired,
    type: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
}

module.exports = SimpleView