const instruction_set = new Map([
	["+", "increment current memory value"],
	["-", "decrement current memory value"],
	[">", "increment memory pointer"],
	["<", "decrement memory pointer"],
	[".", "write current memory to output"],
	[",", "read to current memory"],
	["[", "push loop stack if current memory != 0"],
	["]", "loop if current memory != 0"],
]);


let program_pointer = 0;

let memory = [];
let memory_pointer = 0;
let output_buffer = "";

let skipping_loop = false;
let loopStack = {
  values: [],
  get: (i) => { return loopStack.values[i] },
  getTop: () => { return loopStack.values[loopStack.values.length - 1] },
  push: (value) => {
    loopStack.values.push(value);
    drawStackPushArrow = 1;
  },
  pop: () => {
    drawStackPopArrow = 1;
    let value = loopStack.values.pop();
    if (value != undefined) {
      return value;
    }
  },
  reset: () => {
    loopStack.values = [];
  }
};

function* Compile (script, buffer_size) {
  memory = Array(buffer_size).fill(0);
  memory_pointer = 0;
  output_buffer = "";

  let skipping_loop = false;
  loopStack.reset();
  
  program_loop: for (program_pointer = 0, program_end = script.length; program_pointer < program_end; program_pointer++) {    
    let char = script[program_pointer];
    visited[program_pointer]++;

    if (char == '[') {
      if (memory[memory_pointer] !== 0)
        loopStack.push(program_pointer);
      else
        skipping_loop = true;
    }
    else if (char == ']') {
      if (skipping_loop) {
        skipping_loop = false;
        continue program_loop;
      }

      if (memory[memory_pointer] !== 0)
        program_pointer = loopStack.getTop();
      else
        loopStack.pop();
    }

    if (skipping_loop == false) {
      switch (char) {
        case "+": memory[memory_pointer]++; break;
        case "-": memory[memory_pointer]--; break;
        case ">": memory_pointer++; break;
        case "<": memory_pointer--; break;
        case ".": output_buffer += String.fromCharCode((memory[memory_pointer])); break;
        case ",": memory[memory_pointer] = prompt()[0].charCodeAt(); break;
        default: break;
      }

      if (memory_pointer < 0 || memory_pointer >= memory_size) {
        console.error(`memory address ${memory_pointer} invalid!`);
        break program_loop;
      }
    }
    
    yield;
  }

  return output_buffer;
}