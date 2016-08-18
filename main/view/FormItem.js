const React = require('react')
const {PropTypes} = require('react')
const {FormGroup, ControlLabel, FormControl, HelpBlock} = require('react-bootstrap')
const {List} = require('immutable')
const moment = require('moment')
const EntityListItem = require('./EntityListItem');
const EntityViewFn = () => require('./EntityView');
const EntityListEditable = require('./EntityListEditable');
const DisplayItem = require('./DisplayItem');
const DateTimeField = require('react-bootstrap-datetimepicker')

const {Types, Reference} = require('lsd-metadata')

const FormItem = React.createClass({
    getInitialState: function () {
        const fieldId = `id_${Math.floor(Math.random() * 1000000) + 1 }`
        return {value: this.props.value, fieldId}
    },
    handleChange: function (event) {
        const valueStr = event.target.value
        const value = valueStr === '' ? null : valueStr
        this.setState({value})
        if (this.props.onChange) {
            this.props.onChange(value)
        }
    },

    handleNumberChange: function (event) {
        const valueStr = event.target.value
        const value = valueStr === '' ? null : parseFloat(valueStr)
        this.setState({value})
        if (this.props.onChange) {
            this.props.onChange(value)
        }
    },

    handleDateChange: function (valueStr) {
        const value = valueStr === 'Invalid date' ? null : new Date(parseInt(valueStr))
        this.setState({value})
        if (this.props.onChange) {
            this.props.onChange(value)
        }
    },

    handleListChange: function (value) {
        this.setState({value})
        if (this.props.onChange) {
            this.props.onChange(value)
        }
    },

    handleSelectChange: function (event) {
        const optionValue = event.target.value
        const value = this.props.type.values().find( x => x.name === optionValue) || null
        this.setState({value})
        if (this.props.onChange) {
            this.props.onChange(value)
        }
    },

    handleRefChange: function (event) {
        const value = event.target.value
        this.setState({value})
        if (this.props.onChange) {
            this.props.onChange(value)
        }
    },

    render: function () {
        const validationState = this.props.error ? "error" : null
        return (
            <FormGroup controlId={this.state.fieldId} validationState={validationState}>
                <ControlLabel>{this.props.label}</ControlLabel>
                {this.formControl()}
                <FormControl.Feedback />
                {this.props.error ? <HelpBlock>{this.props.error}</HelpBlock> : this.props.help ? <HelpBlock>{this.props.help}</HelpBlock> : ''}
            </FormGroup>
        )
    },

    getDefaultProps: function() {
        return {
            value: ''
        }
    },

    componentWillReceiveProps: function(props) {
        this.setState({value: props.value})
    },

    formControl: function() {
        const EntityView = EntityViewFn()
        const {propDesc, type, editable, placeholder, viewElement} = this.props
        const value = this.state.value
        const valueOrBlank = (this.state.value === undefined || this.state.value === null) ? "" : this.state.value

        if (viewElement) {
            return React.cloneElement(viewElement, {items: value, entityDescriptor: propDesc.itemType.entityDescriptor})
        }

        if (!editable) {
            return <FormControl.Static><DisplayItem propDesc={propDesc} value={valueOrBlank}/></FormControl.Static>
        }

        if (type === String) {
            return <FormControl type="text" value={valueOrBlank} placeholder={placeholder} onChange={this.handleChange}/>
        }
        if (type === Number) {
            return <FormControl type="text" value={valueOrBlank} placeholder={placeholder} onChange={this.handleNumberChange}/>
        }
        if (type === Date) {
            const displayFormat = "DD MMM YY"
            return <DateTimeField mode="date" inputFormat={displayFormat} onChange={this.handleDateChange}
                                  dateTime={value ? value.getTime() : undefined} />
        }
        if (type === List) {
            const displayItemFn = (item) => <EntityListItem item={item} />
            const editItemFn = (item, onSave) => <EntityView entity={item} onSave={onSave} />
            return <EntityListEditable items={value} itemType={propDesc.itemType} displayItem={displayItemFn} editItem={editItemFn} onChange={this.handleListChange}/>
        }
        if (Types.isSameType(type, Reference)) {
            const entities = this.context.getEntityManager(propDesc.itemType).choiceList()
            const optionList = entities.map(o => ({value: o.id, name: o.shortSummary}) )
            return (
                <FormControl componentClass="select" value={value} onChange={this.handleRefChange}>
                    <option value="">{placeholder || "Not selected"}</option>
                    {optionList.map( op => <option key={op.value} value={op.value}>{op.name}</option> )}
                </FormControl>
            )
        }
        if (type.values) {
            const optionList = type.values().map( o => ({value: o.name, name: o.label}) )
            return (
                <FormControl componentClass="select" value={value} onChange={this.handleSelectChange}>
                    <option value="">{placeholder || "Not selected"}</option>
                    {optionList.map( op => <option key={op.value} value={op.value}>{op.name}</option> )}
                </FormControl>
                )

        }
    }
})

FormItem.propTypes = {
    viewElement: PropTypes.element,
    propDesc: PropTypes.object,
    value: PropTypes.any,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    help: PropTypes.string,
    error: PropTypes.string,
    editable: PropTypes.bool,
    onChange: PropTypes.func,
}

FormItem.contextTypes = {
    getEntityManager: PropTypes.func
}

module.exports = FormItem
