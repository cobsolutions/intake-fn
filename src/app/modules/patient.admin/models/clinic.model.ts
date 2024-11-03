import { BasicAddress } from "src/app/models/common/basic.address"
import { DeviceLocation } from "./trust.device/geolocation"

export interface Clinic{
    id:number|null,
    name:string|null,
    address:string,
    clinicAddress?: BasicAddress
    selected?:boolean
    status?:boolean
    geolocation?:DeviceLocation,
    createdAt?:number
}