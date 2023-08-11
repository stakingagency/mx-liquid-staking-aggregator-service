import BigNumber from "bignumber.js";

export interface RecordData {
    timestamp: number;
    decimals: number;
    value: BigNumber;
}
