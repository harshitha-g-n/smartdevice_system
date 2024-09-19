// Observer Pattern - Subject class
class Subject {
    constructor() {
        this.observers = [];
    }

    addObserver(observer) {
        this.observers.push(observer);
    }

    removeObserver(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    notify(data) {
        this.observers.forEach(observer => observer.update(data));
    }
}

// Observer interface
class Observer {
    update(data) {
        throw 'Observer update method should be implemented';
    }
}

// Factory Method - Smart Device Factory
class SmartDeviceFactory {
    static createDevice(type, id) {
        switch (type) {
            case 'light':
                return new Light(id);
            case 'thermostat':
                return new Thermostat(id);
            case 'door':
                return new DoorLock(id);
            default:
                throw new Error('Unknown device type');
        }
    }
}

// Base Smart Device class
class SmartDevice extends Observer {
    constructor(id, type) {
        super();
        this.id = id;
        this.type = type;
        this.status = 'off';
    }

    turnOn() {
        this.status = 'on';
    }

    turnOff() {
        this.status = 'off';
    }

    getStatus() {
        return `${this.type} ${this.id} is ${this.status}`;
    }
}

// Light device class
class Light extends SmartDevice {
    constructor(id) {
        super(id, 'Light');
    }
}

// Thermostat device class
class Thermostat extends SmartDevice {
    constructor(id, temperature = 70) {
        super(id, 'Thermostat');
        this.temperature = temperature;
    }

    setTemperature(temp) {
        this.temperature = temp;
        console.log(`Thermostat ${this.id} set to ${temp} degrees.`);
    }

    getStatus() {
        return `Thermostat ${this.id} is set to ${this.temperature} degrees.`;
    }
}

// Door lock device class
class DoorLock extends SmartDevice {
    constructor(id) {
        super(id, 'Door');
        this.status = 'locked';
    }

    lock() {
        this.status = 'locked';
    }

    unlock() {
        this.status = 'unlocked';
    }

    getStatus() {
        return `Door ${this.id} is ${this.status}`;
    }
}

// Proxy Pattern - Access control for smart devices
class DeviceProxy {
    constructor(device) {
        this.device = device;
    }

    turnOn() {
        console.log(`Accessing device ${this.device.id} via proxy...`);
        this.device.turnOn();
    }

    turnOff() {
        console.log(`Accessing device ${this.device.id} via proxy...`);
        this.device.turnOff();
    }

    getStatus() {
        return this.device.getStatus();
    }
}

// Scheduler class to manage scheduled tasks
class Scheduler {
    constructor() {
        this.scheduledTasks = [];
    }

    setSchedule(device, time, command) {
        this.scheduledTasks.push({ device, time, command });
        console.log(`Scheduled ${command} for device ${device.id} at ${time}`);
    }

    getSchedule() {
        return this.scheduledTasks;
    }
}

// Automation Trigger class
class Automation {
    constructor() {
        this.triggers = [];
    }

    addTrigger(condition, action) {
        this.triggers.push({ condition, action });
        console.log(`Added trigger: ${condition} -> ${action}`);
    }

    getTriggers() {
        return this.triggers;
    }

    checkTriggers(thermostat) {
        this.triggers.forEach(trigger => {
            const [property, operator, value] = trigger.condition.split(' ');
            if (property === 'temperature' && operator === '>' && thermostat.temperature > parseInt(value)) {
                console.log(`Trigger met: ${trigger.condition}. Executing: ${trigger.action}`);
            }
        });
    }
}

// Smart Home System - Central Hub
class SmartHomeSystem extends Subject {
    constructor() {
        super();
        this.devices = [];
        this.scheduler = new Scheduler();
        this.automation = new Automation();
    }

    addDevice(type, id) {
        const device = SmartDeviceFactory.createDevice(type, id);
        this.devices.push(device);
        this.addObserver(device);
    }

    turnOn(deviceId) {
        const device = this.devices.find(d => d.id === deviceId);
        if (device) {
            device.turnOn();
            this.notify({ action: 'turnOn', deviceId });
        }
    }

    turnOff(deviceId) {
        const device = this.devices.find(d => d.id === deviceId);
        if (device) {
            device.turnOff();
            this.notify({ action: 'turnOff', deviceId });
        }
    }

    setSchedule(deviceId, time, command) {
        const device = this.devices.find(d => d.id === deviceId);
        if (device) {
            this.scheduler.setSchedule(device, time, command);
        }
    }

    addTrigger(condition, action) {
        this.automation.addTrigger(condition, action);
    }

    checkTriggers() {
        const thermostat = this.devices.find(d => d.type === 'Thermostat');
        if (thermostat) {
            this.automation.checkTriggers(thermostat);
        }
    }

    getStatusReport() {
        return this.devices.map(device => device.getStatus()).join('\n');
    }
}

// Example Usage

const homeSystem = new SmartHomeSystem();
homeSystem.addDevice('light', 1);
homeSystem.addDevice('thermostat', 2);
homeSystem.addDevice('door', 3);

homeSystem.turnOn(1);
homeSystem.setSchedule(2, "06:00", "Turn On");
homeSystem.addTrigger("temperature > 75", "turnOff(1)");

console.log(homeSystem.getStatusReport());
console.log(homeSystem.scheduler.getSchedule());
homeSystem.checkTriggers();
