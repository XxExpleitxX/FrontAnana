export abstract class AbstractBaseService<T> {
    abstract getAll(url: string): Promise<T[]>;
    abstract get(url: string, id: number): Promise<T | null>;
    abstract post(url: string, entity: T): Promise<T>;
    abstract put(url: string, id: number, entity: T): Promise<T | null>;
    abstract delete(url: string, id: number): Promise<void>;
}