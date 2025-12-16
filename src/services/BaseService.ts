import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { AbstractBaseService } from './AbstractBaseService';

export default abstract class BaseService<T> extends AbstractBaseService<T> {
    private axiosInstance = axios.create({
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
    });

    protected async request(path: string, config: AxiosRequestConfig): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.axiosInstance(path, config);
            return response.data;
        } catch (error) {
            console.error('Request error:', error);
            return Promise.reject(error);
        }
    }

    protected async requestAll(path: string, config: AxiosRequestConfig): Promise<T[]> {
        try {
            const response: AxiosResponse<T[]> = await this.axiosInstance(path, config);
            return response.data;
        } catch (error) {
            console.error('RequestAll error:', error);
            return Promise.reject(error);
        }
    }

    async get(url: string, id: number): Promise<T> {
        const path = `${url}/${id}`;
        return this.request(path, { method: 'GET' });
    }

    async getAll(url: string): Promise<T[]> {
        return this.requestAll(url, { method: 'GET' });
    }

    async post(url: string, data: T): Promise<T> {
        return this.request(url, {
            method: 'POST',
            data,
        });
    }

    async put(url: string, id: number, data: T): Promise<T> {
        const path = `${url}/${id}`;
        return this.request(path, {
            method: 'PUT',
            data,
        });
    }

    async delete(url: string, id: number): Promise<void> {
        const path = `${url}/${id}`;
        try {
            await this.axiosInstance.delete(path);
        } catch (error) {
            console.error('Delete error:', error);
            throw new Error('Error al eliminar el elemento');
        }
    }
}
