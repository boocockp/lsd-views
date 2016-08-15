const React = require('react')
const { connect } = require('react-redux')
const {PropTypes} = require('react')
const {List} = require('immutable')
const EntityList = require('./EntityList')
const EntityView = require('./EntityView')
const EntityListItem = require('./EntityListItem')
const {Grid, Row, Col, Button} = require('react-bootstrap')
const EntityManager = require('./EntityManager')


let EntityListWithView = React.createClass({
    render: function () {
        const p = this.props
        const entityManager = p.entityManager
        const selectedId = p.selectedId
        const entity = selectedId === "new" ? entityManager.newInstance() : entityManager.get(selectedId)
        const displayItemFn = (item) => <EntityListItem item={item} />
        return (
            <Grid>
                <Row>
                    <Col xs={12} md={3}>
                        {this.props.onNew ? <Button onClick={this.newObject}>New</Button> : ''}
                        <EntityList items={entityManager.choiceList()} selectedItemId={selectedId} onSelect={this.select} displayItem={displayItemFn}/>
                    </Col>
                    <Col xs={12} md={9}>{this.entityView(entity)}</Col>
                </Row>
            </Grid>
        )
    },

    entityView: function(entity) {
        if (!entity) {
            return ""
        }

        const viewType = this.props.entityViewType || EntityView
        return React.createElement(viewType,  {entity, onSave: this.saveEntity})
    },

    select: function(entity) {
        this.props.onSelect && this.props.onSelect(entity.id)
    },

    saveEntity: function (entity) {
        const newEntity = !entity.id
        const savedEntity = this.props.entityManager.save(entity)
        if (newEntity) {
            this.select(savedEntity)
        }
    },

    newObject: function() {
        this.props.onNew && this.props.onNew()
    }
})

EntityListWithView.propTypes = {
    entityManager: PropTypes.instanceOf(EntityManager).isRequired,
    entityViewType: PropTypes.func,
    selectedId: PropTypes.string,
    onSelect: PropTypes.func,
    onNew: PropTypes.func,
}

module.exports = EntityListWithView