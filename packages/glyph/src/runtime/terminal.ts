const ESC = "\x1b";
const CSI = `${ESC}[`;

export class Terminal {
  stdout: NodeJS.WriteStream;
  stdin: NodeJS.ReadStream;
  private wasRaw = false;
  private cleanedUp = false;

  constructor(
    stdout: NodeJS.WriteStream = process.stdout,
    stdin: NodeJS.ReadStream = process.stdin,
  ) {
    this.stdout = stdout;
    this.stdin = stdin;
  }

  get columns(): number {
    return this.stdout.columns || 80;
  }

  get rows(): number {
    return this.stdout.rows || 24;
  }

  enterRawMode(): void {
    if (this.stdin.isTTY) {
      this.wasRaw = this.stdin.isRaw;
      this.stdin.setRawMode(true);
      this.stdin.resume();
      this.stdin.setEncoding("utf-8");
    }
  }

  exitRawMode(): void {
    if (this.stdin.isTTY && !this.wasRaw) {
      this.stdin.setRawMode(false);
      this.stdin.pause();
    }
  }

  write(data: string): void {
    this.stdout.write(data);
  }

  hideCursor(): void {
    this.write(`${CSI}?25l`);
  }

  showCursor(): void {
    this.write(`${CSI}?25h`);
  }

  enterAltScreen(): void {
    this.write(`${CSI}?1049h`);
  }

  exitAltScreen(): void {
    this.write(`${CSI}?1049l`);
  }

  clearScreen(): void {
    this.write(`${CSI}2J${CSI}H`);
  }

  resetStyles(): void {
    this.write(`${CSI}0m`);
  }

  setup(): void {
    this.enterRawMode();
    this.enterAltScreen();
    this.hideCursor();
    this.clearScreen();

    this.installCleanupHandlers();
  }

  cleanup(): void {
    if (this.cleanedUp) return;
    this.cleanedUp = true;

    this.resetStyles();
    this.showCursor();
    this.exitAltScreen();
    this.exitRawMode();
  }

  private installCleanupHandlers(): void {
    const doCleanup = () => this.cleanup();

    process.on("exit", doCleanup);

    const handleSignal = (signal: NodeJS.Signals) => {
      doCleanup();
      process.kill(process.pid, signal);
    };

    process.once("SIGINT", () => handleSignal("SIGINT"));
    process.once("SIGTERM", () => handleSignal("SIGTERM"));

    process.on("uncaughtException", (err) => {
      doCleanup();
      console.error(err);
      process.exit(1);
    });

    process.on("unhandledRejection", (err) => {
      doCleanup();
      console.error(err);
      process.exit(1);
    });
  }

  onResize(handler: () => void): () => void {
    this.stdout.on("resize", handler);
    return () => {
      this.stdout.off("resize", handler);
    };
  }

  onData(handler: (data: string) => void): () => void {
    const listener = (data: Buffer | string) => {
      handler(typeof data === "string" ? data : data.toString("utf-8"));
    };
    this.stdin.on("data", listener);
    return () => {
      this.stdin.off("data", listener);
    };
  }
}
