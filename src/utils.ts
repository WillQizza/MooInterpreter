import { MooInstruction } from "./code";

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

/**
   * Checks if the specified string is considered a valid instruction code.
   * @param code the string to check
   * @returns if it is considered a valid instruction
   */
export function isValidInstructionCode(code: string) {
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
export function getInstructionFromMoo(instruction: string): MooInstruction {
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