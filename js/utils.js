function randomInteger(min, max) {
    const rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}

class Event {
    constructor(name) {
        this.name = name;
        this.callbacks = [];
    }
    registerCallback(callback) {
        this.callbacks.push(callback);
    }
}

class Reactor {
    constructor() {
        this.events = {};
    }
    registerEvent(eventName) {
        var event = new Event(eventName);
        this.events[eventName] = event;
    }
    dispatchEvent(eventName, eventArgs) {
        this.events[eventName].callbacks.forEach((callback) => {
            callback(eventArgs);
        });
    }
    addEventListener(eventName, callback) {
        this.events[eventName].registerCallback(callback);
    }
}
const customEvents = new Reactor();

export { customEvents, randomInteger };
