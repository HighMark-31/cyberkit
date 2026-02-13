import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Terminal as TerminalIcon, Minimize2, Maximize2, X } from 'lucide-react';

interface FileSystem {
  [key: string]: string | FileSystem;
}

const INITIAL_FS: FileSystem = {
  'home': {
    'user': {
      'documents': {
        'secret.txt': 'TOP SECRET DATA\nDO NOT SHARE',
        'notes.txt': 'Buy milk\nHack the planet',
        'todo.md': '- [ ] Fix bugs\n- [ ] Deploy'
      },
      'downloads': {},
      'projects': {
        'cyberkit': {
          'README.md': '# CyberKit\nThe best security suite.'
        }
      }
    }
  },
  'etc': {
    'passwd': 'root:x:0:0:root:/root:/bin/bash\nuser:x:1000:1000:user:/home/user:/bin/bash',
    'hosts': '127.0.0.1 localhost',
    'resolv.conf': 'nameserver 8.8.8.8'
  },
  'bin': {},
  'usr': {},
  'var': {
    'log': {
      'syslog': 'System initialized...',
      'auth.log': 'Failed password for root from 192.168.1.55'
    }
  }
};

interface Command {
  name: string;
  description: string;
  action: (args: string[], context: TerminalContext) => string | JSX.Element;
}

interface TerminalContext {
  cwd: string;
  setCwd: (path: string) => void;
  fs: FileSystem;
  history: string[];
}

export const Terminal = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<{ cmd: string, res: string | JSX.Element }[]>([]);
  const [cwd, setCwd] = useState('/home/user');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [output]);

  const resolvePath = (path: string, currentCwd: string): string => {
    if (path.startsWith('/')) return path;
    if (path === '~') return '/home/user';
    const parts = currentCwd.split('/').filter(Boolean);
    const newParts = path.split('/').filter(Boolean);
    
    for (const part of newParts) {
      if (part === '.') continue;
      if (part === '..') {
        parts.pop();
      } else {
        parts.push(part);
      }
    }
    return '/' + parts.join('/');
  };

  const getFsNode = (path: string, fs: FileSystem): any => {
    if (path === '/') return fs;
    const parts = path.split('/').filter(Boolean);
    let current: any = fs;
    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        return null;
      }
    }
    return current;
  };

  const commands: Record<string, Command> = {
    help: {
      name: 'help',
      description: 'List available commands',
      action: () => (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          {Object.values(commands).map(c => (
            <div key={c.name}><span className="text-primary">{c.name}</span> - {c.description}</div>
          ))}
        </div>
      )
    },
    clear: {
      name: 'clear',
      description: 'Clear terminal output',
      action: () => {
        setOutput([]);
        return '';
      }
    },
    ls: {
      name: 'ls',
      description: 'List directory contents',
      action: (args, ctx) => {
        const targetPath = args[0] ? resolvePath(args[0], ctx.cwd) : ctx.cwd;
        const node = getFsNode(targetPath, INITIAL_FS);
        
        if (!node || typeof node !== 'object') {
          return `ls: cannot access '${targetPath}': No such file or directory`;
        }
        
        return (
          <div className="flex flex-wrap gap-4">
            {Object.keys(node).map(item => {
              const isDir = typeof node[item] === 'object';
              return (
                <span key={item} className={isDir ? 'text-blue-400 font-bold' : 'text-white'}>
                  {item}{isDir ? '/' : ''}
                </span>
              );
            })}
          </div>
        );
      }
    },
    cd: {
      name: 'cd',
      description: 'Change directory',
      action: (args, ctx) => {
        const target = args[0] || '~';
        const newPath = resolvePath(target, ctx.cwd);
        const node = getFsNode(newPath, INITIAL_FS);
        
        if (node && typeof node === 'object') {
          ctx.setCwd(newPath);
          return '';
        }
        return `cd: ${target}: No such file or directory`;
      }
    },
    pwd: {
      name: 'pwd',
      description: 'Print working directory',
      action: (_, ctx) => ctx.cwd
    },
    cat: {
      name: 'cat',
      description: 'Concatenate and print files',
      action: (args, ctx) => {
        if (!args[0]) return 'usage: cat [file]';
        const targetPath = resolvePath(args[0], ctx.cwd);
        const node = getFsNode(targetPath, INITIAL_FS);
        
        if (typeof node === 'string') return node;
        if (typeof node === 'object') return `cat: ${args[0]}: Is a directory`;
        return `cat: ${args[0]}: No such file or directory`;
      }
    },
    whoami: { name: 'whoami', description: 'Print effective userid', action: () => 'root' },
    date: { name: 'date', description: 'Print system date and time', action: () => new Date().toString() },
    echo: { name: 'echo', description: 'Display a line of text', action: (args) => args.join(' ') },
    history: {
      name: 'history',
      description: 'Display command history',
      action: (_, ctx) => (
        <div className="whitespace-pre-wrap">
          {ctx.history.map((cmd, i) => `${i + 1}  ${cmd}`).join('\n')}
        </div>
      )
    },
    ping: { name: 'ping', description: 'Send ICMP ECHO_REQUEST', action: (args) => `PING ${args[0] || 'localhost'} (127.0.0.1): 56 data bytes\n64 bytes from 127.0.0.1: icmp_seq=0 ttl=64 time=0.045 ms` },
    ifconfig: { name: 'ifconfig', description: 'Configure a network interface', action: () => 'eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500\n        inet 192.168.1.105  netmask 255.255.255.0  broadcast 192.168.1.255' },
    ip: { name: 'ip', description: 'Show / manipulate routing, devices', action: () => '1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000\n    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00' },
    netstat: { name: 'netstat', description: 'Print network connections', action: () => 'Active Internet connections (w/o servers)\nProto Recv-Q Send-Q Local Address           Foreign Address         State' },
    curl: { name: 'curl', description: 'Transfer a URL', action: (args) => args[0] ? `<html>\n  <body>\n    <h1>Response from ${args[0]}</h1>\n  </body>\n</html>` : 'curl: try \'curl --help\' or \'curl --manual\' for more information' },
    wget: { name: 'wget', description: 'Non-interactive network downloader', action: (args) => args[0] ? `Downloading '${args[0]}'... \n100%[===================>] 1.2M  --.-KB/s    in 0.05s` : 'wget: missing URL' },
    ssh: { name: 'ssh', description: 'OpenSSH SSH client', action: (args) => args[0] ? `Connecting to ${args[0]}...\nPermission denied (publickey).` : 'usage: ssh destination' },
    nmap: { name: 'nmap', description: 'Network exploration tool', action: (args) => `Starting Nmap 7.92 ( https://nmap.org ) at ${new Date().toLocaleTimeString()}\nNmap scan report for ${args[0] || 'localhost'}\nHost is up (0.00034s latency).\nNot shown: 998 closed tcp ports (conn-refused)\nPORT   STATE SERVICE\n80/tcp open  http\n443/tcp open https` },
    
    ps: { name: 'ps', description: 'Report a snapshot of the current processes', action: () => '  PID TTY          TIME CMD\n 1337 pts/0    00:00:00 bash\n 1338 pts/0    00:00:00 ps' },
    top: { name: 'top', description: 'Display Linux processes', action: () => 'top - 10:00:00 up 1 day,  2:30,  1 user,  load average: 0.00, 0.01, 0.05' },
    uname: { name: 'uname', description: 'Print system information', action: (args) => args.includes('-a') ? 'Linux cyberkit 5.15.0-generic #1 SMP Thu Jan 1 00:00:00 UTC 2024 x86_64 GNU/Linux' : 'Linux' },
    hostname: { name: 'hostname', description: 'Show or set the system\'s host name', action: () => 'cyberkit' },
    uptime: { name: 'uptime', description: 'Tell how long the system has been running', action: () => ' 10:00:00 up 1 day,  2:30,  1 user,  load average: 0.00, 0.01, 0.05' },
    free: { name: 'free', description: 'Display amount of free and used memory', action: () => '              total        used        free      shared  buff/cache   available\nMem:        8192000     2048000     4096000       10000     2048000     5894000' },
    df: { name: 'df', description: 'Report file system disk space usage', action: () => 'Filesystem     1K-blocks    Used Available Use% Mounted on\n/dev/sda1      100000000 5000000  95000000   5% /' },
    du: { name: 'du', description: 'Estimate file space usage', action: () => '4\t./Documents\n8\t.' },
    id: { name: 'id', description: 'Print user and group IDs', action: () => 'uid=0(root) gid=0(root) groups=0(root)' },
    env: { name: 'env', description: 'Run a program in a modified environment', action: () => 'SHELL=/bin/bash\nTERM=xterm-256color\nUSER=root\nPATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin' },
    
    mkdir: { name: 'mkdir', description: 'Make directories', action: () => 'Permission denied (read-only filesystem)' },
    rm: { name: 'rm', description: 'Remove files or directories', action: () => 'Permission denied (read-only filesystem)' },
    cp: { name: 'cp', description: 'Copy files and directories', action: () => 'Permission denied (read-only filesystem)' },
    mv: { name: 'mv', description: 'Move (rename) files', action: () => 'Permission denied (read-only filesystem)' },
    touch: { name: 'touch', description: 'Change file timestamps', action: () => 'Permission denied (read-only filesystem)' },
    grep: { name: 'grep', description: 'Print lines matching a pattern', action: (args) => args[0] ? '' : 'usage: grep [pattern] [file]' },
    head: { name: 'head', description: 'Output the first part of files', action: () => '' },
    tail: { name: 'tail', description: 'Output the last part of files', action: () => '' },
    less: { name: 'less', description: 'Opposite of more', action: () => 'Missing filename' },
    more: { name: 'more', description: 'File perusal filter for crt viewing', action: () => 'Missing filename' },
    
    matrix: { name: 'matrix', description: 'Enter the matrix', action: () => <span className="text-green-500 animate-pulse">Wake up, Neo...</span> },
    sl: { name: 'sl', description: 'Steam Locomotive', action: () => '🚂🚃🚃🚃🚃' },
    cowsay: { name: 'cowsay', description: 'Configurable speaking cow', action: (args) => {
        const text = args.join(' ') || 'Moo';
        return `
 __________________
< ${text} >
 ------------------
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||
        `;
    }},
    fortune: { name: 'fortune', description: 'Print a random, hopefully interesting, adage', action: () => 'You will write great code today.' },
    banner: { name: 'banner', description: 'Print large banner', action: (args) => args.join(' ').toUpperCase() },
    rev: { name: 'rev', description: 'Reverse lines of a file or stdin', action: (args) => args.join(' ').split('').reverse().join('') },
    factor: { name: 'factor', description: 'Factor numbers', action: (args) => args[0] ? `${args[0]}: ${args[0]}` : 'missing operand' },
    yes: { name: 'yes', description: 'Output a string repeatedly until killed', action: () => 'y\ny\ny\ny\n...' },
    
    sqlmap: { name: 'sqlmap', description: 'Automatic SQL injection tool', action: () => '[*] starting at 10:00:00\n[!] legal disclaimer: Usage of sqlmap for attacking targets without prior mutual consent is illegal.\n[*] testing connection to the target URL' },
    nikto: { name: 'nikto', description: 'Web server scanner', action: () => '- Nikto v2.1.6\n+ Target Host: localhost\n+ Target Port: 80\n+ Start Time: 2024-01-01 10:00:00' },
    hydra: { name: 'hydra', description: 'Login cracker', action: () => 'Hydra v9.1 (c) 2020 by van Hauser/THC\n[DATA] max 16 tasks per 1 server, overall 16 tasks, 1 login try (l:1/p:1), ~0 tries per task\n[STATUS] attack finished' },
    msfconsole: { name: 'msfconsole', description: 'Metasploit Framework', action: () => '     =[ metasploit v6.0.0-dev                          ]\n+ -- --=[ 2048 exploits - 1105 auxiliary - 344 post       ]\n+ -- --=[ 562 payloads - 45 encoders - 10 nops            ]\n\nmsf6 >' },
    wireshark: { name: 'wireshark', description: 'Network protocol analyzer', action: () => 'Running Wireshark GUI...' },
    'aircrack-ng': { name: 'aircrack-ng', description: '802.11 WEP / WPA-PSK key cracker', action: () => 'Aircrack-ng 1.6 \n\n[00:00:00] Tested 0 keys (got 0 IVs)' },
    john: { name: 'john', description: 'John the Ripper password cracker', action: () => 'John the Ripper 1.9.0-jumbo-1 OMP [linux-gnu 64-bit AVX2 AC] \nLoaded 1 password hash (Descrypt, traditional crypt(3) [DES 128/128 AVX-512])' },
    hashcat: { name: 'hashcat', description: 'Advanced password recovery', action: () => 'hashcat (v6.1.1) starting...\n\nOpenCL API (OpenCL 2.1 PoCL 1.6, None+Asserts, LLVM 11.0.0, RELOC, SLEEF, DISTRO, POCL_DEBUG)' },
    
    vi: { name: 'vi', description: 'Screen oriented (visual) display editor', action: () => 'VIM - Vi IMproved\n\nversion 8.2\nby Bram Moolenaar et al.' },
    vim: { name: 'vim', description: 'Vi IMproved, a programmers text editor', action: () => 'VIM - Vi IMproved' },
    nano: { name: 'nano', description: 'Nano\'s ANOther editor, an enhanced free Pico clone', action: () => 'GNU nano 5.4' },
    emacs: { name: 'emacs', description: 'GNU Emacs', action: () => 'Welcome to GNU Emacs' },
    
    alias: { name: 'alias', description: 'Define or display aliases', action: () => 'alias ls=\'ls --color=auto\'' },
    unalias: { name: 'unalias', description: 'Remove alias definitions', action: () => '' },
    export: { name: 'export', description: 'Set export attribute for shell variables', action: () => '' },
    unset: { name: 'unset', description: 'Unset values and attributes of shell variables', action: () => '' },
    bg: { name: 'bg', description: 'Move jobs to background', action: () => 'no current job' },
    fg: { name: 'fg', description: 'Move job to foreground', action: () => 'no current job' },
    jobs: { name: 'jobs', description: 'Display status of jobs', action: () => '' },
    kill: { name: 'kill', description: 'Terminate a process', action: () => 'kill: usage: kill [-s sigspec | -n signum | -sigspec] pid | jobspec ... or kill -l [sigspec]' },
    pkill: { name: 'pkill', description: 'Look up or signal processes based on name', action: () => '' },
    killall: { name: 'killall', description: 'Kill processes by name', action: () => '' },
    shutdown: { name: 'shutdown', description: 'Halt, power-off or reboot the machine', action: () => 'Shutdown scheduled for Fri 2024-01-01 10:00:00 UTC' },
    reboot: { name: 'reboot', description: 'Reboot the system', action: () => 'Rebooting...' },
    halt: { name: 'halt', description: 'Stop the system', action: () => 'System halted' },
    poweroff: { name: 'poweroff', description: 'Power off the system', action: () => 'Power down' },
    man: { name: 'man', description: 'An interface to the system reference manuals', action: (args) => args[0] ? `No manual entry for ${args[0]}` : 'What manual page do you want?' },
    info: { name: 'info', description: 'Read Info documents', action: () => '' },
    whatis: { name: 'whatis', description: 'Display one-line manual page descriptions', action: (args) => args[0] ? `${args[0]}: nothing appropriate` : 'whatis what?' },
    whereis: { name: 'whereis', description: 'Locate the binary, source, and manual page files', action: (args) => args[0] ? `${args[0]}: /usr/bin/${args[0]}` : '' },
    which: { name: 'which', description: 'Locate a command', action: (args) => args[0] ? `/usr/bin/${args[0]}` : '' },
    wc: { name: 'wc', description: 'Print newline, word, and byte counts', action: () => '0 0 0' },
    sort: { name: 'sort', description: 'Sort lines of text files', action: () => '' },
    uniq: { name: 'uniq', description: 'Report or omit repeated lines', action: () => '' },
    cut: { name: 'cut', description: 'Remove sections from each line of files', action: () => '' },
    paste: { name: 'paste', description: 'Merge lines of files', action: () => '' },
    tr: { name: 'tr', description: 'Translate or delete characters', action: () => '' },
    sed: { name: 'sed', description: 'Stream editor', action: () => '' },
    awk: { name: 'awk', description: 'Pattern scanning and processing language', action: () => '' },
    find: { name: 'find', description: 'Search for files in a directory hierarchy', action: () => '' },
    locate: { name: 'locate', description: 'Find files by name', action: () => '' },
    tar: { name: 'tar', description: 'An archiving utility', action: () => 'tar: You must specify one of the -Acdtrux, --delete or --test-label options' },
    gzip: { name: 'gzip', description: 'Compress or expand files', action: () => '' },
    gunzip: { name: 'gunzip', description: 'Compress or expand files', action: () => '' },
    zip: { name: 'zip', description: 'Package and compress (archive) files', action: () => '' },
    unzip: { name: 'unzip', description: 'List, test and extract compressed files in a ZIP archive', action: () => '' },
    chmod: { name: 'chmod', description: 'Change file mode bits', action: () => 'chmod: missing operand' },
    chown: { name: 'chown', description: 'Change file owner and group', action: () => 'chown: missing operand' },
    chgrp: { name: 'chgrp', description: 'Change group ownership', action: () => 'chgrp: missing operand' },
    umask: { name: 'umask', description: 'Set file mode creation mask', action: () => '0022' },
    sudo: { name: 'sudo', description: 'Execute a command as another user', action: (args) => args.length ? 'sudo: effective uid is not 0, is /usr/bin/sudo on a file system with the \'nosuid\' option set or an NFS file system without root privileges?' : 'usage: sudo -h | -K | -k | -V | -v' },
    su: { name: 'su', description: 'Change user ID or become superuser', action: () => 'Password:' },
    passwd: { name: 'passwd', description: 'Change user password', action: () => 'Changing password for user.' },
    useradd: { name: 'useradd', description: 'Create a new user or update default new user information', action: () => 'Permission denied' },
    usermod: { name: 'usermod', description: 'Modify a user account', action: () => 'Permission denied' },
    userdel: { name: 'userdel', description: 'Delete a user account and related files', action: () => 'Permission denied' },
    groupadd: { name: 'groupadd', description: 'Create a new group', action: () => 'Permission denied' },
    groupdel: { name: 'groupdel', description: 'Delete a group', action: () => 'Permission denied' },
    groupmod: { name: 'groupmod', description: 'Modify a group definition', action: () => 'Permission denied' },
    apt: { name: 'apt', description: 'Command-line interface', action: () => 'apt 2.0.2 (amd64)' },
    'apt-get': { name: 'apt-get', description: 'APT package handling utility', action: () => 'apt 2.0.2 (amd64)' },
    dpkg: { name: 'dpkg', description: 'Package manager for Debian', action: () => '' },
    rpm: { name: 'rpm', description: 'RPM Package Manager', action: () => '' },
    yum: { name: 'yum', description: 'Yellowdog Updater Modified', action: () => '' },
    dnf: { name: 'dnf', description: 'Dandified YUM', action: () => '' },
    pacman: { name: 'pacman', description: 'Package manager utility', action: () => '' },
    brew: { name: 'brew', description: 'The missing package manager for macOS', action: () => '' },
    npm: { name: 'npm', description: 'Node package manager', action: () => '8.0.0' },
    node: { name: 'node', description: 'Node.js JavaScript runtime', action: () => 'v16.0.0' },
    python: { name: 'python', description: 'Python language interpreter', action: () => 'Python 3.9.5' },
    python3: { name: 'python3', description: 'Python language interpreter', action: () => 'Python 3.9.5' },
    perl: { name: 'perl', description: 'The Perl 5 language interpreter', action: () => 'v5.32.1' },
    ruby: { name: 'ruby', description: 'Interpreted object-oriented scripting language', action: () => 'ruby 3.0.0' },
    gcc: { name: 'gcc', description: 'GNU project C and C++ compiler', action: () => 'gcc: fatal error: no input files' },
    'g++': { name: 'g++', description: 'GNU project C and C++ compiler', action: () => 'g++: fatal error: no input files' },
    make: { name: 'make', description: 'GNU make utility', action: () => 'make: *** No targets specified and no makefile found.  Stop.' },
    git: { name: 'git', description: 'The stupid content tracker', action: () => 'usage: git [--version] [--help] [-C <path>] ...' },
    docker: { name: 'docker', description: 'Docker container runtime', action: () => 'Usage:  docker [OPTIONS] COMMAND' },
    kubectl: { name: 'kubectl', description: 'Kubernetes command line tool', action: () => 'kubectl controls the Kubernetes cluster manager' },
    screen: { name: 'screen', description: 'Screen manager with VT100/ANSI terminal emulation', action: () => '[screen is terminating]' },
    tmux: { name: 'tmux', description: 'Terminal multiplexer', action: () => '[exited]' },
    lsof: { name: 'lsof', description: 'List open files', action: () => '' },
    strace: { name: 'strace', description: 'Trace system calls and signals', action: () => '' },
    dmesg: { name: 'dmesg', description: 'Print or control the kernel ring buffer', action: () => '' },
    journalctl: { name: 'journalctl', description: 'Query the systemd journal', action: () => 'No journal files were found.' },
    systemctl: { name: 'systemctl', description: 'Control the systemd system and service manager', action: () => '' },
    service: { name: 'service', description: 'Run a System V init script', action: () => '' },
    crontab: { name: 'crontab', description: 'Maintain crontab files for individual users', action: () => 'no crontab for user' },
    at: { name: 'at', description: 'Queue, examine, or delete jobs for later execution', action: () => 'garbled time' },
    base64: { name: 'base64', description: 'Base64 encode/decode data and print to standard output', action: (args) => args[0] ? btoa(args[0]) : '' },
    md5sum: { name: 'md5sum', description: 'Compute and check MD5 message digest', action: () => 'd41d8cd98f00b204e9800998ecf8427e  -' },
    sha256sum: { name: 'sha256sum', description: 'Compute and check SHA256 message digest', action: () => 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855  -' },
    dd: { name: 'dd', description: 'Convert and copy a file', action: () => '0+0 records in\n0+0 records out' },
    ln: { name: 'ln', description: 'Make links between files', action: () => 'ln: missing file operand' },
    diff: { name: 'diff', description: 'Compare files line by line', action: () => 'diff: missing operand' },
    tee: { name: 'tee', description: 'Read from standard input and write to standard output and files', action: () => '' },
    xargs: { name: 'xargs', description: 'Build and execute command lines from standard input', action: () => '' },
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const cmd = input.trim();
      setCommandHistory(prev => [...prev, cmd]);
      setHistoryIndex(-1);
      setInput('');

      if (!cmd) return;

      if (cmd === 'clear') {
        commands.clear.action([], { cwd, setCwd, fs: INITIAL_FS, history: commandHistory });
        return;
      }

      const [cmdName, ...args] = cmd.split(' ');
      const command = commands[cmdName];

      const result = command 
        ? command.action(args, { cwd, setCwd, fs: INITIAL_FS, history: commandHistory })
        : `Command not found: ${cmdName}. Type 'help' for available commands.`;

      setOutput(prev => [...prev, { cmd, res: result }]);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = Math.min(commandHistory.length - 1, historyIndex + 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
        if (newIndex === commandHistory.length - 1) {
           // Maybe clear if we go past end? But logic implies we stay on last.
           // To replicate real terminal, if we go past latest, empty input.
        }
      }
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] max-h-[800px] w-full p-6">
      <Card className="h-full bg-black/90 border-white/10 shadow-2xl overflow-hidden flex flex-col font-mono text-sm">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
          <div className="flex items-center gap-2">
            <TerminalIcon className="h-4 w-4 text-primary" />
            <span className="text-white/80 font-medium">root@cyberkit:~</span>
          </div>
          <div className="flex items-center gap-2">
            <Minimize2 className="h-4 w-4 text-muted-foreground hover:text-white cursor-pointer" />
            <Maximize2 className="h-4 w-4 text-muted-foreground hover:text-white cursor-pointer" />
            <X className="h-4 w-4 text-muted-foreground hover:text-red-500 cursor-pointer" />
          </div>
        </div>

        {/* Terminal Body */}
        <div className="flex-1 p-4 overflow-auto" ref={scrollRef} onClick={() => inputRef.current?.focus()}>
          <div className="space-y-1">
            <div className="text-muted-foreground mb-4">
              Welcome to CyberKit Terminal v1.0.0<br/>
              Type 'help' to see available commands.<br/>
              System ready.
            </div>

            {output.map((entry, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center gap-2 text-primary">
                  <span>root@cyberkit:{cwd}$</span>
                  <span className="text-white">{entry.cmd}</span>
                </div>
                <div className="text-white/80 whitespace-pre-wrap break-words pl-4 border-l-2 border-white/5">
                  {entry.res}
                </div>
              </div>
            ))}

            <div className="flex items-center gap-2 text-primary">
              <span>root@cyberkit:{cwd}$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent border-none outline-none text-white placeholder-transparent focus:ring-0 p-0"
                autoFocus
                spellCheck="false"
                autoComplete="off"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
