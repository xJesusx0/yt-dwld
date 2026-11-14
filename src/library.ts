export interface Library {
  findPath(id: string): string | null;
  save(id: string, path: string): void;
}

class MemoryLibrary implements Library {
  private library: Record<string, string> = {};
  findPath(id: string) {
    return this.library[id];
  }

  save(id: string, path: string) {
    this.library[id] = path;
  }
}

export const library: Library = new MemoryLibrary();
