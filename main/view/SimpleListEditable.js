//@flow

const React = require('react')
const {PropTypes} = require('react')
const {List} = require('immutable')
const {ListGroup, ListGroupItem} = require('react-bootstrap')
const EntityListItem = require('./EntityListItem')
const SimpleView = require('./SimpleView')

const SimpleListEditable = React.createClass({
    render: function () {
        const renderDisplayItem = (item, index) => {
            return (
                <ListGroupItem key={(item && item.id) || index} onClick={this.onEdit.bind(this, index)}>
                    {item ? <EntityListItem item={item}/> : <span className="placeholder">Add another...</span>}
                </ListGroupItem>
            )
        }
        const renderEditItem = (item, index) => {
            return (
                <ListGroupItem key={(item && item.id) || index}>
                    <SimpleView type={this.props.itemType} value={item} onSave={this.onSave}
                                onCancel={this.onCancelEdit}/>
                </ListGroupItem>
            )
        }

        const renderItem = (item, index) => {
            const isEditing = index === this.state.indexEdited
            return isEditing ? renderEditItem(item, index) : renderDisplayItem(item, index)
        }

        const newItem = ''
        const items = this.props.items.push(newItem)
        const listItems = items.map(renderItem)

        return (
            <ListGroup>
                { listItems }
            </ListGroup>
        )
    },

    getInitialState: function () {
        return {
            indexEdited: -1
        }
    },

    onEdit: function (index: number) {
        this.setState({indexEdited: index})
    },

    onSave: function (updatedItem: any) {
        const itemAddedAtEnd = this.state.indexEdited === this.props.items.size
        const nextIndexEdited = itemAddedAtEnd ? this.props.items.size + 1 : this.getInitialState().indexEdited

        if (this.props.onChangeList) {
            const updatedList = this.props.items.set(this.state.indexEdited, updatedItem).filter( item => item !== '' && item !== null)
            this.props.onChangeList(updatedList)
        }
        this.setState({indexEdited: nextIndexEdited})
    },

    onCancelEdit: function () {
        this.setState(this.getInitialState())
    }
})

SimpleListEditable.propTypes = {
    items: PropTypes.instanceOf(List).isRequired,
    itemType: PropTypes.func.isRequired,
    onChangeList: PropTypes.func,
    addButtonPosition: PropTypes.string
}

module.exports = SimpleListEditable