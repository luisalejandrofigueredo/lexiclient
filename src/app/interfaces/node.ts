import { NodeConnections } from "./node-connections";
export interface Node {
    _id?:string,
    name:string,
    final:boolean,
    nodeConnection?:NodeConnections[],
    __v?:number
}