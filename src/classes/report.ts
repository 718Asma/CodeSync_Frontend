export interface Report {
    _id: string;
    reporter: string;
    reported: string;
    reportedType: string;
    desc: string;
    timestamp: Date;
}