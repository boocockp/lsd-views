import React from 'react'
import { mount } from 'enzyme'
import chai from 'chai'
import {spy} from 'sinon'
import sinonChai from 'sinon-chai'
import {List} from 'immutable'
import SimpleListEditable from '../../main/view/SimpleListEditable'

const should = chai.should()
chai.use(sinonChai)

describe('SimpleListEditable', () => {
    const ENTER = 13, ESC = 27

    const originalItems = List(["One", "Two", "Three"])

    let wrapper, comp, onChangeList

    beforeEach( () => {
        onChangeList = spy()
        wrapper = mount(
            <SimpleListEditable itemType={String} items={originalItems} onChangeList={onChangeList}/>
        )
        comp = wrapper.instance()
    })

    function editItem(index, newValue, finalKeyCode = ENTER) {
        wrapper.find('button').at(index).simulate('click')
        wrapper.find('input').get(0).value = newValue
        wrapper.find('input').simulate('change')
        wrapper.find('input').simulate('keyUp', {keyCode: finalKeyCode})
    }

    function itemsDisplayed() {
        return wrapper.find('button').map(it => it.text() )
    }

    function expectedDisplayFor(items) {
        return items.push("Add another...").toJS()
    }

    function valueBeingEdited() {
        return wrapper.find('input').get(0).value
    }

    it('initialises with items and add placeholder displayed', () => {
        itemsDisplayed().should.eql(expectedDisplayFor(originalItems))
    })

    it('when edit item and press enter, calls onChangeList with new list', () => {
        editItem(1, "2222")

        onChangeList.should.have.been.calledOnce
        onChangeList.firstCall.args[0].toJS().should.eql(["One", "2222", "Three"])
    })

    it('when edit item and update props, shows new items', () => {
        editItem(1, "2222")
        const newItems = List(["One", "Two-and-a-half", "Three"])
        wrapper.setProps({items: newItems})
        itemsDisplayed().should.eql(expectedDisplayFor(newItems))
    })

    it('when edit item and cancel, does not call onChangeList and shows original items', () => {
        editItem(1, "2222", ESC)

        onChangeList.should.not.have.been.called
        itemsDisplayed().should.eql(expectedDisplayFor(originalItems))
    })

    it("when edit last item and update props, auto-edits new item", () => {
        editItem(3, "Four")
        onChangeList.firstCall.args[0].toJS().should.eql(["One", "Two", "Three", "Four"])

        const newItems = List(["One", "Two-and-a-half", "Three", "Four"])
        wrapper.setProps({items: newItems})
        itemsDisplayed().should.eql(newItems.toJS())
        valueBeingEdited().should.eql('')
    })

    it('when clear item and press enter, calls onChangeList with item removed from list', () => {
        editItem(1, "")

        onChangeList.should.have.been.calledOnce
        onChangeList.firstCall.args[0].toJS().should.eql(["One", "Three"])
    })


})