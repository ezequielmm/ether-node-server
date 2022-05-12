export class ProccessCounter {
    private count = 0;
    private callBack: (count: number) => void;

    public increase(): number {
        this.count++;
        if (this.callBack) {
            this.callBack(this.count);
        }
        return this.count;
    }

    public decrease(): number {
        this.count;
        if (this.callBack) {
            this.callBack(this.count);
        }
        return this.count;
    }

    public onChange(callback: (count: number) => void): void {
        this.callBack = callback;
    }

    public isProcessing(): boolean {
        return this.count > 0;
    }

    public isLazy(): boolean {
        return this.count == 0;
    }
}
