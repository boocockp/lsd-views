const _ = require('lodash')
const React = require('react')
const {PropTypes} = require('react')
const {List} = require('immutable')
const {Link} = require('react-router-component')
const {parseProp} = require('./Util')
const DisplayItem = require('./DisplayItem')

let EntityTableRowGroup = React.createClass({

    render: function () {
        return (
            <tbody className={this.props.className}>
            {this.props.items.map((item, index) => this.dataRow(item, index)) }
            </tbody>
        )
    },

    entityDescriptor: function () {
        const items = this.props.items
        const entityDescriptor = this.props.entityDescriptor || (items.get(0) && items.get(0).constructor.entityDescriptor);
        if (!entityDescriptor) throw new Error('EntityDescriptor required') //TODO show no data message if no items and no entity descriptor
        return entityDescriptor

    },

    propertiesToShow: function () {
        return (this.props.propertiesToShow || this.entityDescriptor().displayProperties).map( parseProp )
    },

    dataCell: function (propInfo, item, index) {
        const {name, itemLink} = propInfo
        if (name) {
            const propDesc = this.entityDescriptor().propertyDescriptor(name);
            const typeClassName = propDesc.type.name.toLowerCase()
            const value = item[name]
            const displayItem = <DisplayItem propDesc={propDesc} value={value}/>
            const content = itemLink ? this.itemLink(item, itemLink, displayItem) : displayItem
            return <td key={name} className={typeClassName}>{content}</td>
        } else {
            return <td key={"empty" + index} className="empty"/>
        }
    },

    itemLink: function(item, itemLinkPropertyName, displayItem) {
        if (typeof itemLinkPropertyName === 'string') {
            const linkPropertyDesc = this.entityDescriptor().propertyDescriptor(itemLinkPropertyName)
            const linkPropertyValue = item[itemLinkPropertyName]
            const navigationManager = this.context.getNavigationManager(linkPropertyDesc.itemType)
            return <Link href={navigationManager.pathTo(linkPropertyValue)}>{displayItem}</Link>
        } else {
            const navigationManager = this.context.getNavigationManager(item.constructor)
            return <Link href={navigationManager.pathTo(item)}>{displayItem}</Link>
        }
    },

    dataRow: function (item, index) {
        return (
            <tr key={item.id || index}>
                {this.propertiesToShow().map((prop, index) => this.dataCell(prop, item, index))}
            </tr>
        )
    }
})

EntityTableRowGroup.propTypes = {
    items: PropTypes.instanceOf(List).isRequired,
    entityDescriptor: PropTypes.object,
    propertiesToShow: PropTypes.arrayOf(PropTypes.string)
}

EntityTableRowGroup.contextTypes = {
    getNavigationManager: PropTypes.func
}

module.exports = EntityTableRowGroup