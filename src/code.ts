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

/**
 * Converts an integer into it's respective instruction if one exists.
 * @param instruction the integer
 * @returns instruction or null
 */
export function intToMooInstruction(instruction: number): MooInstruction {
  switch (instruction) {
    case 0:
      return MooInstruction.GOTO_PREVIOUS_MOO;
    case 1:
      return MooInstruction.MOVE_MEMORY_BACK;
    case 2:
      return MooInstruction.MOVE_MEMORY_FORWARD;
    case 3:
      return MooInstruction.EXECUTE_MEMORY_AS_INSTRUCTION;
    case 4:
      return MooInstruction.PRINT_OR_WRITE_ASCII;
    case 5:
      return MooInstruction.DECREMENT_MEMORY;
    case 6:
      return MooInstruction.INCREMENT_MEMORY;
    case 7:
      return MooInstruction.MARK;
    case 8:
      return MooInstruction.SET_MEMORY_TO_ZERO;
    case 9:
      return MooInstruction.READ_OR_WRITE_REGISTER;
    case 10:
      return MooInstruction.PRINT_INT;
    case 11:
      return MooInstruction.WRITE_INT;
    default:
      return MooInstruction.END_PROGRAM;
  }
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
   * Checks if the specified string is considered a valid instruction code.
   * @param code the string to check
   * @returns if it is considered a valid instruction
   */
  private isValidInstructionCode(code: string) {
    switch (code) {
      case "moo":
      case "mOo":
      case "moO":
      case "mOO":
      case "Moo":
      case "MOo":
      case "MoO":
      case "MOO":
      case "OOO":
      case "MMM":
      case "OOM":
      case "oom":
        return true;
      default:
        return false;
    }
  }

  /**
   * Converts an instruction string to it's corresponding moo code
   * Otherwise throws an error as invalid parsing has occurred.
   * @param instruction the string to convert
   * @returns the moo instruction
   */
  private getInstructionFromMoo(instruction: string): MooInstruction {
    switch (instruction) {
      case "moo":
        return MooInstruction.GOTO_PREVIOUS_MOO;
      case "mOo":
        return MooInstruction.MOVE_MEMORY_BACK;
      case "moO":
        return MooInstruction.MOVE_MEMORY_FORWARD;
      case "mOO":
        return MooInstruction.EXECUTE_MEMORY_AS_INSTRUCTION;
      case "Moo":
        return MooInstruction.PRINT_OR_WRITE_ASCII;
      case "MOo":
        return MooInstruction.DECREMENT_MEMORY;
      case "MoO":
        return MooInstruction.INCREMENT_MEMORY;
      case "MOO":
        return MooInstruction.MARK;
      case "OOO":
        return MooInstruction.SET_MEMORY_TO_ZERO;
      case "MMM":
        return MooInstruction.READ_OR_WRITE_REGISTER;
      case "OOM":
        return MooInstruction.PRINT_INT;
      case "oom":
        return MooInstruction.WRITE_INT;
      default:
        throw new Error("Invalid instruction parsed.");
    }
  }

  /**
   * Parses all instructions from the moo code string provided.
   * @param code the code
   */
  private parseInstructions(code: string) {
    this.instructions = [];

    let currentInstructionText = code.substring(0, 3);
    while (code.length > 0) {
      if (this.isValidInstructionCode(currentInstructionText)) {
        // Remove the instruction from the remaining code to parse.
        code = code.slice(3);

        this.instructions.push(this.getInstructionFromMoo(currentInstructionText));
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