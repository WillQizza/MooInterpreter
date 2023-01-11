export class MooEnvironment {
  private memory: number[];
  private memoryCapacity: number;
  private memoryPointer: number;

  constructor(memory: number) {
    this.memoryCapacity = memory;
    
    this.reset();
  }

  reset() {
    this.memory = new Array(this.memoryCapacity).fill(0);
    this.memoryPointer = 0;
  }

  run(code: string) {

  }

}