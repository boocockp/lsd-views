import React from 'react'
import { mount } from 'enzyme'
import chai from 'chai'
import {spy} from 'sinon'
import sinonChai from 'sinon-chai'
import SimpleView from '../../main/view/SimpleView'

const should = chai.should()
chai.use(sinonChai)

describe('SimpleView', () => {

    const originalValue = "so simple"

    let wrapper, comp, onSave, onCancel

    beforeEach( () => {
        onSave = spy()
        onCancel = spy()
        wrapper = mount(
            <SimpleView type={String} value={originalValue} onSave={onSave} onCancel={onCancel}/>
        )
        comp = wrapper.instance()
    })

    it('initialises with value in input element', () => {
        comp.value().should.eql(originalValue)
        comp.isChanged().should.eql(false)
        wrapper.find('input').get(0).value.should.eql("so simple")
    })

    it('calls onSave with new value when enter pressed', () => {
        wrapper.find('input').get(0).value = "not so simple"
        wrapper.find('input').simulate('change')
        wrapper.find('input').simulate('keyUp', {keyCode: 13})

        onSave.should.have.been.calledWith("not so simple")
        onCancel.should.not.have.been.called
        comp.value().should.eql("not so simple")
        comp.isChanged().should.eql(true)
    })

    it('re-initialises when props set after change', () => {
        wrapper.find('input').get(0).value = "not so simple"
        wrapper.find('input').simulate('change')
        wrapper.find('input').simulate('keyUp', {keyCode: 13})
        wrapper.setProps({value: "quite simple"})

        comp.value().should.eql("quite simple")
        comp.isChanged().should.eql(false)
    })

    it('calls onCancel but not onSave if enter pressed with no change', () => {
        wrapper.find('input').simulate('keyUp', {keyCode: 13})

        onSave.should.not.have.been.called
        onCancel.should.have.been.called
        wrapper.instance().isChanged().should.eql(false)
    })


    it('calls onCancel but not onSave if ESC pressed after change', () => {
        wrapper.find('input').get(0).value = "not so simple"
        wrapper.find('input').simulate('change')
        wrapper.find('input').simulate('keyUp', {keyCode: 27})

        onSave.should.not.have.been.called
        onCancel.should.have.been.called
        wrapper.instance().isChanged().should.eql(false)
    })

})