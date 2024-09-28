export class InterlayerDataManager<D = null> {
  public data: D | null = null;
  public extensions: InterlayerDataManagerExtension[];
  public code = 0;

  constructor(data: D | null = null) {
    this.data = data;
    this.extensions = [];
  }

  public addData(data: D): void {
    this.data = data;
  }
  public addError(
    message: string,
    key: string | null = null,
    code: number | null = null,
  ): void {
    this.code = code ?? 1;
    this.extensions.push(new InterlayerDataManagerExtension(message, key));
  }
  public hasError(): boolean {
    return this.code !== 0;
  }
}

class InterlayerDataManagerExtension {
  public readonly message: string;
  public readonly key: string | null;
  constructor(message: string, key: string | null = null) {
    this.message = message;
    this.key = key;
  }
}
