import { DeviceLocation } from "./geolocation";

export interface DigitalIntakeDevice {
    deviceName: string,
    deviceId: string;
    geolocation: DeviceLocation;
}