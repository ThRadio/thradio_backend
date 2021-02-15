import { Injectable } from '@nestjs/common';
import * as xmlrpc from 'xmlrpc';

@Injectable()
export class SupervisorService {
  private supervisor: xmlrpc.Client = xmlrpc.createClient({
    host: 'stations',
    port: 9001,
    path: '/RPC2',
  });

  listProcess() {
    this.supervisor.methodCall(
      'supervisor.getAllProcessInfo',
      null,
      (error, result) => {
        console.log(result);
      },
    );
  }

  getProcessInfo(name: string): Promise<any> {
    return new Promise((resolve) => {
      this.supervisor.methodCall(
        'supervisor.getProcessInfo',
        [name],
        (error, result) => {
          if (result) resolve(result);
        },
      );
    });
  }

  startProcess(name: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.supervisor.methodCall(
        'supervisor.startProcess',
        [name, true],
        (error, result) => {
          if (result) resolve(result);
        },
      );
    });
  }

  stopProcess(name: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.supervisor.methodCall(
        'supervisor.stopProcess',
        [name, true],
        (error, result) => {
          if (result) resolve(result);
        },
      );
    });
  }

  async restartProcess(name: string): Promise<boolean> {
    await this.stopProcess(name);
    await this.startProcess(name);
    return true;
  }

  async reloadSupervisor() {
    const reload = await this.reloadConfig();
    const [reload_added, reload_changed, reload_removed] = reload[0];

    // Add new
    if (reload_added) {
      for (const added of reload_added) {
        await this.addProcess(added);
      }
    }

    // Change
    if (reload_changed) {
      for (const changed of reload_changed) {
        await this.stopProcess(changed);
        await this.removeProcess(changed);
        await this.addProcess(changed);
      }
    }

    //Remove
    if (reload_removed) {
      for (const removed of reload_removed) {
        await this.stopProcess(removed);
        await this.removeProcess(removed);
      }
    }
  }

  addProcess(name: string) {
    return new Promise((resolve) => {
      this.supervisor.methodCall(
        'supervisor.addProcessGroup',
        [name],
        (error, result) => {
          if (error) console.log(error);
          if (result) {
            resolve(result);
          }
        },
      );
    });
  }

  removeProcess(name: string) {
    return new Promise((resolve) => {
      this.supervisor.methodCall(
        'supervisor.removeProcessGroup',
        [name],
        (error, result) => {
          if (error) console.log(error);
          if (result) {
            resolve(result);
          }
        },
      );
    });
  }

  reloadConfig() {
    return new Promise((resolve) => {
      this.supervisor.methodCall(
        'supervisor.reloadConfig',
        null,
        (error, result) => {
          if (error) console.log(error);
          if (result) {
            resolve(result);
          }
        },
      );
    });
  }
}
