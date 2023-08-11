import {Module} from '@nestjs/common';
import {  ProjectsInterface} from "../projects";

@Module({})
export class ModuleFactory {
    static async create(moduleName: string): Promise<ProjectsInterface> {
        const importedModule = await import(`../projects/${moduleName}/${moduleName}.module`);
        const className = Object.keys(importedModule).find(name => /Module$/.test(name));
        if (className) {
            return new importedModule[className]();
        }
        throw new Error('Module not found or incorrectly structured.');
    }

    static getService(moduleName: string): ProjectsInterface {
        const services = require(`../projects/${moduleName}/${moduleName}.service`);

        if (services && services[`${moduleName}Service`]) {
            const ServiceClass = services[`${moduleName}Service`];
            return new ServiceClass();  // instantiate the service class
        }

        throw new Error(`Service ${moduleName}Service not found. Check if it's exported correctly from ${moduleName}.service.ts.`);
    }

}
