LSD Views
=========

LSD Views provides a set of high-level [React](https://facebook.github.io/react/) components designed
for use in the view part of [LSD](https://github.com/lightweight-software-development/lsd-overview) applications.
They enable large chunks of functionality to be defined with a single element.

For example, the `EntityListWithView` component, combined with some supporting definitions, displays a list of
objects of a certain type, and when one is selected, shows the object in an edit view, and takes care of saving
the changes to the application state.

Most of the components rely heavily on metadata about the business object classes defined with the
[LSD Metadata](https://github.com/lightweight-software-development/lsd-metadata) classes.  
Many also need:
- an `EntityManager` for the business object class that knows how to get, list and save instances
- a `NavigationManager` that knows how to navigate to the correct view for instances of that class

The aim is that these manager objects and the metadata define what is unique about each business object
class, and the parts of the functionality that are the same for each type of business object
are taken care of by the view component.

The view created can be customised by passing in other components as properties or child elements.

### Examples of components in use
This element will fill the whole page apart from the navigation bar with a list of Accounts and a view beside that to edit the currently selected one:

```javascript
   <EntityListWithView entityManager={this.getEntityManager(Account)} entityViewType={AccountView}
                                navigationManager={this.getNavigationManager(Account)}/>
```

By default, the edit view uses the `EntityView` component, but in this example that is overridden with a 
custom `AccountView` component that is defined like this:

```javascript
let AccountView = React.createClass({

    render: function () {
        const postingsView = <EntityTable propertiesToShow={["date", "description, itemLink=transaction", "type", "amount"]} />
        return <EntityView {...this.props} propertyViews={{postings: postingsView}}/>
    }
})

AccountView.propTypes = EntityView.propTypes
```

It shows a standard `EntityView` but overrides which properties are shown and the type of view used to display one of the properties.

