import { DeviceInformation } from "./device.information"

export interface DeviceTokenRequest{
    token:string
    clinicId:string,
    deviceInformation:DeviceInformation
}
