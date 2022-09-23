export interface NodeConnections {
    _id?:string;
    project?:string;
    name: string;
    toName: string;
    character: string;
    isLanguage:boolean;
    isRegularExpression:boolean,
    isVisible:boolean,
    __v?:number
}
