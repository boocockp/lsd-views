// @flow

import React from'react'
import {PropTypes} from'react'
import {Form} from'react-bootstrap'
const FormItem = () => require('./FormItem')

let SimpleView = React.createClass({

    getInitialState: function () {
        return {updatedValue: undefined}
    },

    componentWillReceiveProps: function () {
        this.setState(this.getInitialState())
    },

    value: function () {
        return this.isChanged() ? this.state.updatedValue : this.props.value
    },

    isChanged: function() {
        return this.state.updatedValue !== undefined && this.state.updatedValue !== this.props.value
    },

    render: function () {
        const FormItemClass = FormItem()
        return (
            <Form inline onSubmit={e => e.preventDefault()} onKeyUp={this.onKeyUp}>
                <FormItemClass type={this.props.type} editable={true} onChange={this.onChange} value={this.value()} label={null} autoFocus/>
            </Form>
        )
    },

    onChange: function (value: String) {
        this.setState({updatedValue: value})
    },

    onSave: function () {
        if (this.isChanged()) {
            const updatedValue = this.state.updatedValue;
            this.props.onSave(updatedValue)
        } else {
            this.onCancel()
        }
    },

    onCancel: function () {
        this.setState(this.getInitialState())
        this.props.onCancel()
    },

    onKeyUp: function (e: Object) {
        const ESC = 27, ENTER = 13
        if (e.keyCode === ESC) {
            this.onCancel()
        }
        if (e.keyCode === ENTER) {
            this.onSave()
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