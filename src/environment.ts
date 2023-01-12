import { EventEmitter } from "stream";
import { intToMooInstruction, MooCode, MooInstruction } from "./code";

export class MooEnvironment extends EventEmitter {
  private memory: number[];
  private memoryCapacity: number;
  private memoryPointer: number;
  private register: number;

  private running: boolean;

  constructor(memory: number) {
    super();

    this.memoryCapacity = memory;
    this.reset();
  }

  /**
   * Resets all data associated with current environment.
   */
  reset() {
    if (this.running) {
      throw new Error("Cannot reset memory while program is still running.");
    }

    this.memory = new Array(this.memoryCapacity).fill(0);
    this.memoryPointer = 0;
    this.register = 0;
  }

  write(data: Buffer) {

  }

  /**
   * Interprets and runs the provided COW code.
   * @param code the code
   * @returns a promise that is fulfilled whenever 
   */
  async run(code: string) {
    if (this.running) {
      throw new Error("Cannot run new code until program has finished running.");
    }
    this.running = true;
    
    const exec = new MooCode(code);

    let instruction = exec.next();
    do {
      const shouldEndProgram = await this.runInstructionAndReturnIfShouldStop(exec, instruction);

      if (shouldEndProgram) {
        // Program has finished running the code.
        break;
      }
    } while ((instruction = exec.next()) !== MooInstruction.END_PROGRAM);

    this.running = false;
    this.emit("end");
  }

  /**
   * Executes an instruction.
   * @param instruction the instruction to run
   * @returns whether or not the program should be stopped. (if END_PROGRAM is executed)
   */
  private async runInstructionAndReturnIfShouldStop(exec: MooCode, instruction: MooInstruction) {
    switch (instruction) {
      case MooInstruction.GOTO_PREVIOUS_MOO: {
        // Jump to the previous MOO.
        // Start our search from the instruction before our last instruction.

        let currentLine = exec.getLine();
        while (currentLine >= 0) {
          exec.gotoLine(currentLine);
          if (exec.peek() === MooInstruction.MARK) {
            if (currentLine === 0 || exec.getInstruction(currentLine - 1) !== MooInstruction.MARK) {
              break; 
            }
          }
          currentLine--;
        }

        if (currentLine === -1) {
          throw new Error("Attempted to jump to previous marker where none exists.");
        }
      }
      break;
      case MooInstruction.MOVE_MEMORY_BACK:
        if (this.memoryPointer === 0) {
          throw new Error("Attempted to move memory pointer below 0.");
        }
        this.memoryPointer--;
        break;
      case MooInstruction.MOVE_MEMORY_FORWARD:
        if (this.memoryPointer + 1 >= this.memoryCapacity) {
          throw new Error("Attempted to move memory pointer beyond capacity.");
        }
        this.memoryPointer++;
        break;
      case MooInstruction.EXECUTE_MEMORY_AS_INSTRUCTION: {
        const memoryInstruction = intToMooInstruction(this.memory[this.memoryPointer]);

        if (memoryInstruction === MooInstruction.EXECUTE_MEMORY_AS_INSTRUCTION) {
          throw new Error("Attempted to execute memory as instruction while memory refers back to executing memory as instruction.");
        }

        return (await this.runInstructionAndReturnIfShouldStop(exec, memoryInstruction));
      }
      case MooInstruction.PRINT_OR_WRITE_ASCII: {
        const memoryData = this.memory[this.memoryPointer];

        if (memoryData === 0) {
          // Write ASCII from input
          // TODO
          // this.memory[this.memoryPointer] = ;
        } else {
          // print ASCII
          this.output(String.fromCharCode(memoryData));
        }
      }
      break;
      case MooInstruction.DECREMENT_MEMORY:
        this.memory[this.memoryPointer]--;
        break;
      case MooInstruction.INCREMENT_MEMORY:
        this.memory[this.memoryPointer]++;
        break;
      case MooInstruction.MARK: {
        const currentMemoryBlock = this.memory[this.memoryPointer];

        if (currentMemoryBlock === 0) {
          // Skip to the instruction after the next GOTO_PREVIOUS_MOO.
          // Skip the next instruction
          exec.next();
          while (exec.peek() !== MooInstruction.GOTO_PREVIOUS_MOO) {
            if (exec.peek() === MooInstruction.END_PROGRAM) {
              throw new Error("Was unable to find a point to jump from a marker.");
            }
            exec.next();
          }
          exec.next();
        }
      }
      break;
      case MooInstruction.SET_MEMORY_TO_ZERO:
        this.memory[this.memoryPointer] = 0;
        break;
      case MooInstruction.READ_OR_WRITE_REGISTER:
        if (this.register === 0) {
          // Write current memory to register
          this.register = this.memory[this.memoryPointer];
        } else {
          // Write register to memory
          this.memory[this.memoryPointer] = this.register;
          this.register = 0;
        }
        break;
      case MooInstruction.PRINT_INT:
        this.output(this.memory[this.memoryPointer]);
        break;
      case MooInstruction.WRITE_INT:
        // TODO
        break;
      case MooInstruction.END_PROGRAM:
        return true;
    }

    return false;
  }

  private output(data: any) {
    this.emit("data", Buffer.from(data.toString()));
  }

}