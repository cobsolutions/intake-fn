export interface QuickIntakeRequest{
    requester?:string,
    deviceId?:string,
    action?:string,
    requestMetaData?:Record<string, any>
}