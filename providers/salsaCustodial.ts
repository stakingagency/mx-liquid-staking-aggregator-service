import {GatewayService, LiquidStakingProviderInterface} from '@libs/common';
import {Injectable} from '@nestjs/common';
import {AddressUtils, BinaryUtils} from "@multiversx/sdk-nestjs-common";
import {Address} from "@multiversx/sdk-core/out";
import BigNumber from "bignumber.js";

@Injectable()
export class SalsaCustodial implements LiquidStakingProviderInterface {
    protected readonly salsaSc: string = 'erd1qqqqqqqqqqqqqpgqaqxztq0y764dnet95jwtse5u5zkg92sfacts6h9su3';
    protected readonly contracts = [this.salsaSc];
    protected readonly userDelegateKeyEnc: string = '757365725f64656c65676174696f6e';
    protected legldValue: BigNumber | null = null;

    constructor(private readonly gatewayService: GatewayService) {
    }

    public async getAddressStake(_address: string): Promise<{ stake: string }> {
        if (!_address || !AddressUtils.isAddressValid(_address)) {
            return {stake: "0"};
        }

        const leglValue = await this.getLegldValue();
        const response = await this.gatewayService.get(`address/${this.salsaSc}/key/${this.userDelegateKeyEnc + new Address(_address).hex()}`);
        if (!response || !response.value) {
            return {stake: "0"};
        }

        const decodedValue = BinaryUtils.hexToNumber(response.value);
        if (!decodedValue) {
            return {stake: "0"};
        }

        return {stake: new BigNumber(decodedValue).multipliedBy(leglValue).toFixed()};
    }

    public async getStakingAddresses(): Promise<string[]> {
        const response = await this.gatewayService.get(`address/${this.salsaSc}/keys`);
        if (!response || !response.pairs) {
            return [];
        }

        const pairs: [key: string] = response.pairs;
        const pairsKeys = Object.keys(pairs).filter(key => key.includes(this.userDelegateKeyEnc));
        const addressList: string[] = [];

        for (const pairKey of pairsKeys) {
            const address = this.getEncodedAddress(pairKey);
            if (address) {
                addressList.push(address);
            }
        }

        return addressList;
    }

    public getStakingContracts(): Promise<string[]> {
        return Promise.resolve(this.contracts);
    }

    private async getLegldValue(): Promise<BigNumber> {
        if (this.legldValue) {
            return this.legldValue;
        }

        this.legldValue = await this.setTokenLegldValue();
        return this.legldValue;
    }

    private async setTokenLegldValue(): Promise<BigNumber> {
        let tokenSupply = new BigNumber(0);
        let stakedAmount = new BigNumber(0);
        const [tokenSupplyResult, stakedAmountResult] = await Promise.all([
            this.gatewayService.query({scAddress: this.salsaSc, funcName: "getLiquidTokenSupply"}),
            this.gatewayService.query({scAddress: this.salsaSc, funcName: "getTotalEgldStaked"})
        ])

        if (tokenSupplyResult && tokenSupplyResult.returnData.length === 1) {
            tokenSupply = new BigNumber(BinaryUtils.hexToNumber(BinaryUtils.base64ToHex(tokenSupplyResult.returnData[0])));
        }

        if (stakedAmountResult && stakedAmountResult.returnData.length === 1) {
            stakedAmount = new BigNumber(BinaryUtils.hexToNumber(BinaryUtils.base64ToHex(stakedAmountResult.returnData[0])));
        }

        return stakedAmount.dividedBy(tokenSupply);
    }

    private getEncodedAddress(encodedString: string): string | undefined {
        if (!encodedString || !encodedString.includes(this.userDelegateKeyEnc)) {
            return undefined;
        }

        const decodedAddress = Address.fromHex(encodedString.replace(this.userDelegateKeyEnc, '')).bech32();
        if (!AddressUtils.isAddressValid(decodedAddress)) {
            return undefined;
        }

        return decodedAddress;
    }
}
