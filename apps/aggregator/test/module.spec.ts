import {ProjectsInterface} from "../src";
import {ModuleFactory} from "../src/module-factory";
import * as process from "process";

describe('Dynamic Modules', () => {
    let service: ProjectsInterface;

    console.log(process.argv);

    // eslint-disable-next-line require-await
    beforeAll(async () => {
        const moduleName = process.env.MODULE_NAME || 'Sample'; // default to 'Sample' if no env provided
        service = ModuleFactory.getService(moduleName);
        console.log('service', service);
        console.log('service', service.getStakingAddresses());
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should not have empty staking address list', async() => {
        const stakingAddresses = await service.getStakingAddresses();
        expect(stakingAddresses.length).toBeGreaterThan(0);
    });

    it('should not have empty staking contract list', async() => {
        const stakingContracts = await service.getStakingContracts();
        expect(stakingContracts.length).toBeGreaterThan(0);
    });
});
