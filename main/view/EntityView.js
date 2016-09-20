const _ = require('lodash')
const React = require('react')
const {PropTypes} = require('react')
const {Button, ButtonToolbar} = require('react-bootstrap')
const FormItem = require('./FormItem')

let EntityView = React.createClass({

    getDefaultProps() {
        return {propertyViews: {}}
    },

    getInitialState: function () {
        return {updatedEntity: null, errors: {}}
    },

    componentWillReceiveProps: function () {
        this.setState(this.getInitialState())
    },

    entityAndDescriptor: function () {
        const entity = this.state.updatedEntity || this.props.entity
        const entityDescriptor = entity.constructor.entityDescriptor || this.props.entityDescriptor
        if (!entityDescriptor) throw new Error('EntityDescriptor required')
        return [entity, entityDescriptor]
    },

    render: function () {
        const [entity, entityDescriptor] = this.entityAndDescriptor()
        const propertyNames = this.props.propertiesToShow || entityDescriptor.displayProperties
        return (
            <div >
                <h2>{this.heading(entity, entityDescriptor)}</h2>
                <div>
                    {propertyNames.map(name => this.formItem(entityDescriptor.propertyDescriptor(name), entity[name]))}
                </div>
                <ButtonToolbar>
                    <Button bsStyle="primary" onClick={this.onSave}>Save</Button>
                    {this.props.onCancel ? <Button onClick={this.props.onCancel}>Cancel</Button> : ''}
                </ButtonToolbar>
            </div>
        )
    },

    heading: function (entity, entityDescriptor) {
        if (this.props.hasOwnProperty("heading")) {
            return this.props.heading ? <h2>{this.props.heading}</h2> : ""
        }

        const entityName = entityDescriptor.name
        return _.hasIn(entity, 'id') ? (entity.id ? `${entity.shortSummary}` : `New ${entityName}`) : entityName
    },

    onChange: function (name, value) {
        const oldEntity = this.state.updatedEntity || this.props.entity
        const updatedEntity = oldEntity.setData(name, value)
        const [entity, entityDescriptor] = this.entityAndDescriptor()

        const errors = entityDescriptor.validate(updatedEntity)
        this.setState({updatedEntity, errors})
    },

    onSave: function (e) {
        e.preventDefault()
        const entity = this.state.updatedEntity;
        if (entity) {
            console.log('save', entity.toJS())
            this.props.onSave(entity)
            this.setState({updatedEntity: null})
        } else {
            console.log('save', 'no change')
        }
    },

    formItem: function (propDesc, value) {
        const changeFn = this.onChange.bind(this, propDesc.name)
        const error = this.state.errors[propDesc.name] && this.state.errors[propDesc.name][0]
        return <FormItem key={propDesc.name} type={propDesc.type} editable={propDesc.editable} onChange={changeFn}
                         value={value} label={propDesc.label}
                         placeholder={propDesc.description} help={propDesc.help} error={error}
                         propDesc={propDesc} viewElement={this.props.propertyViews[propDesc.name]}/>
    }
})

EntityView.propTypes = {
    entity: PropTypes.object.isRequired,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    entityDescriptor: PropTypes.object,
    heading: PropTypes.string,
    propertiesToShow: PropTypes.arrayOf(PropTypes.string),
    propertyViews: PropTypes.objectOf(PropTypes.element)
}

module.exports = EntityView