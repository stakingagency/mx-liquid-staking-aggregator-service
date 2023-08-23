import { Module } from '@nestjs/common';
import { ProjectsInterface} from "../../../projects";
import { AvailableProjects } from "../../../projects";

@Module({})
export class ModuleFactory {
    static rootPath = '../../../projects';
    static getService(projectName: AvailableProjects): ProjectsInterface {
        if(!projectName) throw new Error(`Project name is required.`);
        if(!Object.values(AvailableProjects).includes(projectName)) throw new Error(`Project ${projectName} not found, check that projectName is added in AvailableProjects.`);
        const serviceName=`${projectName.charAt(0).toUpperCase() + projectName.slice(1)}Service`;
        const services = require(`${this.rootPath}/${projectName}/${projectName}.service`);

        if (services && services[`${serviceName}`]) {
            const ServiceClass = services[`${serviceName}`];
            return new ServiceClass();
        }
        throw new Error(`Service ${serviceName} not found.`);
    }
}
