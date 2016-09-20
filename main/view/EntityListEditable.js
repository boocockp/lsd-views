const React = require('react')
const {PropTypes} = require('react')
const {List} = require('immutable')
const {Button, ListGroup, ListGroupItem} = require('react-bootstrap')
const {Types} = require('lsd-metadata')

const EntityListEditable = React.createClass({
    render: function () {
        const renderDisplayItem = (item, index) => {
            return (
                <ListGroupItem key={item.id || index}
                               onClick={this.onEdit.bind(this, item)}>
                    {this.props.displayItem(item)}
                </ListGroupItem>
            )
        }
        const renderEditItem = (item, index) => {
            return (
                <ListGroupItem key={item.id || index}>
                    {this.props.editItem(item, this.onSave, this.onCancelEdit)}
                </ListGroupItem>
            )
        }

        const renderItem = (item, index) => {
            const isEditing = item === this.state.itemEdited
            return isEditing ? renderEditItem(item, index) : renderDisplayItem(item, index)
        }

        const items = this.props.items
        const itemsToRender = this.state.itemEditedIsNew ? items.insert(this.state.indexEdited, this.state.itemEdited) : items
        const buttonText = `Add ${this.props.entityManager.typeName}`
        const listItems = itemsToRender.map(renderItem)
        const button = <Button bsSize="small" onClick={this.onAdd}>{buttonText}</Button>

        switch (this.props.addButtonPosition) {
            case `top`: return (
                <div>
                    <div className="list-add-button-top">
                        {button}
                    </div>
                    <ListGroup>
                        { listItems }
                    </ListGroup>
                </div>
            )

            default: return (
                <div>
                    <ListGroup>
                        { listItems }
                        <ListGroupItem key="add">
                            {button}
                        </ListGroupItem>
                    </ListGroup>
                </div>
            )
        }
    },

    getInitialState: function () {
        return {
            indexEdited: null,
            itemEdited: null,
            itemEditedIsNew: null
        }
    },

    onEdit: function (item) {
        console.log('onEdit', item)
        this.setState({itemEdited: item, indexEdited: this.props.items.indexOf(item), itemEditedIsNew: false})
    },

    onAdd: function () {
        console.log('onAdd')
        const item = this.props.entityManager.newInstance()
        const addedItemIndex = this.props.addButtonPosition === `top` ? 0 : this.props.items.size
        this.setState({itemEdited: item, indexEdited: addedItemIndex, itemEditedIsNew: true})
    },

    onSave: function(updatedItem) {
        if (this.props.onChangeList) {
            const updatedList = this.state.itemEditedIsNew ?
                this.props.items.insert(this.state.indexEdited, updatedItem) :
                this.props.items.set(this.state.indexEdited, updatedItem)
            this.props.onChangeList(updatedList)
        }

        if (this.props.onChangeItem) {
            this.props.onChangeItem(updatedItem)
        }

        this.setState(this.getInitialState())
    },

    onCancelEdit: function() {
        this.setState(this.getInitialState())
    }
})

EntityListEditable.propTypes = {
    items: PropTypes.instanceOf(List).isRequired,
    entityManager: PropTypes.object.isRequired,
    onChangeList: PropTypes.func,
    onChangeItem: PropTypes.func,
    displayItem: PropTypes.func.isRequired,
    editItem: PropTypes.func.isRequired,
    addButtonPosition: PropTypes.string
}

module.exports = EntityListEditable