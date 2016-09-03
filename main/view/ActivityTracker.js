const {ObservableEvent} = require('lsd-observable')

class ActivityTracker {
    constructor() {
        this.uiEvent = new ObservableEvent()
        this.windowEvent = new ObservableEvent()
        document.addEventListener('click', e => this.uiEvent.send(e));
        document.addEventListener('mousemove', e => this.uiEvent.send(e));
        document.addEventListener('keypress', e => this.uiEvent.send(e));
        document.addEventListener('visibilitychange', e => this.windowEvent.send(!document.hidden))
    }
}

module.exports = ActivityTracker