import _ from 'lodash'
import sinon from 'sinon'
import React from 'react'

import Tab from 'src/modules/Tab/Tab'
import TabPane from 'src/modules/Tab/TabPane'
import * as common from 'test/specs/commonTests'
import { sandbox } from 'test/utils'

describe.only('Tab', () => {
  common.isConformant(Tab)
  common.hasSubComponents(Tab, [TabPane])

  const panes = [
    { menuItem: 'Tab 1', render: () => <Tab.Pane>Tab 1 Content</Tab.Pane> },
    { menuItem: 'Tab 2', render: () => <Tab.Pane>Tab 2 Content</Tab.Pane> },
    { menuItem: 'Tab 3', render: () => <Tab.Pane>Tab 3 Content</Tab.Pane> },
  ]

  describe.only('menu', () => {
    it('defaults to an attached tabular menu', () => {
      Tab.defaultProps
        .should.have.property('menu')
        .which.deep.equals({ attached: true, tabular: true })
    })

    it('passes the props to the Menu', () => {
      shallow(<Tab menu={{ 'data-foo': 'bar' }} />)
        .find('Menu')
        .should.have.props({ 'data-foo': 'bar' })
    })

    it('has an item for every menuItem in panes', () => {
      const items = shallow(<Tab panes={panes} />)
        .find('Menu')
        .shallow()
        .find('MenuItem')

      items.should.have.lengthOf(3)
      items.at(0).should.contain.text('Tab 1')
      items.at(1).should.contain.text('Tab 2')
      items.at(2).should.contain.text('Tab 3')
    })
  })

  describe('activeIndex', () => {
    it('is passed to the Menu', () => {
      const wrapper = mount(<Tab panes={panes} activeIndex={123} />)

      wrapper
        .find('Menu')
        .should.have.prop('activeIndex', 123)
    })

    it('is set when clicking an item', () => {
      const wrapper = mount(<Tab panes={panes} />)

      wrapper
        .find('MenuItem')
        .at(1)
        .simulate('click')
        .should.have.prop('active', true)

      wrapper
        .find('TabPane')
        .should.contain.text('Tab 2 Content', true)
    })

    it('can be set via props', () => {
      const wrapper = mount(<Tab panes={panes} activeIndex={1} />)

      wrapper
        .find('Menu')
        .should.have.prop('activeIndex', 1)

      wrapper
        .find('TabPane')
        .should.contain.text('Tab 2 Content', true)
    })
  })

  describe('onTabChange', () => {
    let spy
    beforeEach(() => {
      spy = sandbox.spy()
    })

    it('is called when a menu item is clicked', () => {
      const randomIndex = _.random(panes.length - 1)

      mount(<Tab onTabChange={spy}>{panes}</Tab>)
        .find('MenuItem')
        .at(randomIndex)
        .simulate('click')

      // Since React will have generated a key the returned tab won't match
      // exactly so match on the props instead.
      spy.should.have.been.calledWithMatch(
        sinon.match.any,
        tab => tab.props === panes[randomIndex].props
      )
    })
  })
})
