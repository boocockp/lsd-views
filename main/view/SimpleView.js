const _ = require('lodash')
const React = require('react')
const {PropTypes} = require('react')
const {Form, Button} = require('react-bootstrap')
const FormItem = () => require('./FormItem')

let SimpleView = React.createClass({

    getInitialState: function () {
        return {}
    },

    componentWillReceiveProps: function () {
        this.setState(this.getInitialState())
    },

    value: function () {
        return this.isChanged() ? this.state.updatedValue : this.props.value
    },

    isChanged: function() {
        return this.state.hasOwnProperty("updatedValue") && this.state.updatedValue !== this.props.value
    },

    render: function () {
        const FormItemClass = FormItem()
        return (
            <Form inline onSubmit={this.onSave} onKeyUp={this.onKeyUp}>
                <FormItemClass type={this.props.type} editable={true} onChange={this.onChange} value={this.value()} label={null} autoFocus/>
                {" "}
                <Button type="submit" bsSize="small">Save</Button>
                {" "}
                <Button type="button" bsSize="small" onClick={this.props.onCancel}>Cancel</Button>
            </Form>
        )
    },

    onChange: function (value) {
        this.setState({updatedValue: value})
    },

    onSave: function (e) {
        e.preventDefault()
        if (this.isChanged()) {
            const updatedValue = this.state.updatedValue;
            console.log('save', updatedValue)
            this.setState(this.getInitialState())
            this.props.onSave(updatedValue)
        } else {
            console.log('save', 'no change')
            this.setState(this.getInitialState())
            this.props.onCancel()
        }
    } ,

    onKeyUp: function (e) {
        const ESC = 27
        if (e.keyCode === ESC) {
            this.props.onCancel()
        }
    }
})

SimpleView.propTypes = {
    value: PropTypes.any.isRequired,
    type: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
}

module.exports = SimpleView