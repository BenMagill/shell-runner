import { spawn, ChildProcessWithoutNullStreams } from 'child_process';

// TODO: implement options such as exit if fails
// TODO: fix errors going in the wrong output sometimes, 
//       may have to wait longer or always push to stderr and wait for it

const COMMAND_FINISHED = 'PIPELINE_COMMAND_DONE';
const COMMAND_STATUS = 'PIPELINE_COMMAND_STATUS_';

export type Spawn = [string, string[]];

export type Options = {
  endOnNonZeroCode?: boolean,
};

export type CommandOutput = {
  input: string,
  data: string[],
  error: string[],
  message: string,
  statusCode: string,
};

export class Shell {
  session: ChildProcessWithoutNullStreams;
  
  options: Options;

  output: CommandOutput[] = [];

  stopped = false;

  constructor(
    spawnCommand: Spawn,
    options?: Options,
  ) {
    this.session = spawn(...spawnCommand);
    this.session.stdout.setEncoding('utf8');
    this.session.stderr.setEncoding('utf8');

    this.options = options ? options : {};
  }

  private async readStdout(): Promise<string> {
    return new Promise((resolve) => {
      this.session.stdout.once('data', data => {
        resolve(data);
      });
    });
  }

  async send(command: string) {
    if (this.stopped) return;

    const result: CommandOutput = {
      input: command,
      data: [],
      error: [],
      message: '',
      statusCode: '',
    };
  
    this.session.stdin.write(`${command}\n`);
    this.session.stdin.write(`echo "${COMMAND_STATUS}$?"\n`);
    this.session.stdin.write(`echo "${COMMAND_FINISHED}"\n`);
    
    let commandDone = false;

    while (!commandDone) {
      const data = await this.readStdout();
      result.data.push(data);
  
      if (data.includes(COMMAND_FINISHED)) {
        commandDone = true;
  
        const joinedData = result.data.join('');
  
        const [message, other] = joinedData.split(COMMAND_STATUS);
        const [code] = other.split(COMMAND_FINISHED);
  
        result.statusCode = code.trim();
        result.message = message;
  
        const error = this.session.stderr.read();
        if (error) {
          result.error = error;
          result.message += error;
        }

        if (this.options.endOnNonZeroCode && result.statusCode !== '0') {
          this.stopped = true;
          this.end();
        }
      }
    }

    this.output.push(result);
    return result;
  }

  end() {
    this.session.stdin.end();
  }
}
