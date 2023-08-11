import BigNumber from 'bignumber.js';

export interface TokenData {
    type: string;
    identifier: string;
    name: string;
    ticker: string;
    owner: string;
    decimals: number;
    isPaused: boolean;
    assets: {
        website: string;
        description: string;
        status: string;
        pngUrl: string;
        svgUrl: string;
        priceSource: {
            type: string;
        };
        ledgerSignature: string;
    };

    transactions: number;
    accounts: number;
    canUpgrade: boolean;
    canMint: boolean;
    canBurn: boolean;
    canChangeOwner: boolean;
    canAddSpecialRoles: boolean;
    canPause: boolean;
    canFreeze: boolean;
    canWipe: boolean;
    price: BigNumber;
    marketCap: number;
    supply: string;
    circulatingSupply: string;
}

