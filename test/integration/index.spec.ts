import { Shell } from '../../src';

function prettyLog(msg: any) {
  console.log(JSON.stringify(msg, null, 2));
}

describe('Shell', () => {
  it('runs', async () => {

    // temp 

    const commands = [
      'ls',
      'cd bin',
      'ls',
      // 'sleep 5s',
      'expo rt AWS_PROFILE=dev',
      'export',
    ];
  
    const shell = new Shell(['docker', ['exec', '-i', 'e263f2ccee7f', '/bin/sh']], {
      endOnNonZeroCode: true,
    });

    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      await shell.send(command);
    }

    shell.end();

    prettyLog(shell.output);

  });
});