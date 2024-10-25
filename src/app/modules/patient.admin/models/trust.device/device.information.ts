import { DeviceLocation } from "./geolocation";

export interface DeviceInformation{
    deviceName:string,
    deviceId:string,
    geolocation:DeviceLocation;
}