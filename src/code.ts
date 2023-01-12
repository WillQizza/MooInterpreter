import { getInstructionFromMoo, isValidInstructionCode } from "./utils";

export enum MooInstruction {
  GOTO_PREVIOUS_MOO,
  MOVE_MEMORY_BACK,
  MOVE_MEMORY_FORWARD,
  EXECUTE_MEMORY_AS_INSTRUCTION,
  PRINT_OR_WRITE_ASCII,
  DECREMENT_MEMORY,
  INCREMENT_MEMORY,
  MARK,
  SET_MEMORY_TO_ZERO,
  READ_OR_WRITE_REGISTER,
  PRINT_INT,
  WRITE_INT,
  END_PROGRAM,
}

export class MooCode {
  private instructions: MooInstruction[];
  private lineNumber: number;

  constructor(code: string) {
    this.parseInstructions(code);
    this.lineNumber = 0;
  }
  
  /**
   * Retrieve the next moo instruction to parse.
   * @returns the next instruction
   */
  next(): MooInstruction {
    const instruction = this.instructions[this.getLine()];
    if (this.getLine() < this.instructions.length - 1) {
      this.gotoLine(this.getLine() + 1);
    }
    
    return instruction;
  }

  peek(): MooInstruction {
    return this.instructions[this.getLine()];
  }

  /**
   * Retrieve the current line number
   * @returns the current line number
   */
  getLine() {
    return this.lineNumber;
  }

  getInstruction(line: number) {
    return this.instructions[line];
  }

  /**
   * Move the line number pointer to a specific line.
   * @param line The line to jump to.
   */
  gotoLine(line: number) {
    if (line < 0 || line >= this.instructions.length) {
      throw new Error(`Line ${line} is out of range 0-${this.instructions.length}.`);
    }

    this.lineNumber = line;
  }

  /**
   * Parses all instructions from the moo code string provided.
   * @param code the code
   */
  private parseInstructions(code: string) {
    this.instructions = [];

    let currentInstructionText = code.substring(0, 3);
    while (code.length > 0) {
      if (isValidInstructionCode(currentInstructionText)) {
        // Remove the instruction from the remaining code to parse.
        code = code.slice(3);

        this.instructions.push(getInstructionFromMoo(currentInstructionText));
      } else {
        // Remove the first character from the code to parse.
        // It is considered irrelevant as it is not a proper command.
        code = code.slice(1);
      }

      // Get the first 3 letters of the remaining code to parse.
      currentInstructionText = code.substring(0, 3);
    }

    this.instructions.push(MooInstruction.END_PROGRAM);
  }
}