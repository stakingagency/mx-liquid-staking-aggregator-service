import {ProjectsInterface} from "../src";
import {ModuleFactory} from "../src/module-factory";
import * as process from "process";
import {AvailableProjects} from "../../projects/avaialble-projects";

describe('Dynamic Modules', () => {
    let service: ProjectsInterface;

    // eslint-disable-next-line require-await
    beforeAll(async () => {
        const module: AvailableProjects = process.env.MODULE_NAME as AvailableProjects || AvailableProjects.Sample; // default to 'Sample' if no env provided
        service = ModuleFactory.getService(module);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(service).toHaveProperty('getAddressStake');
        expect(service).toHaveProperty('getStakingAddresses');
        expect(service).toHaveProperty('getStakingContracts');
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
