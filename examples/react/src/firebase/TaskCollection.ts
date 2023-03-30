import { Collection, WithId } from 'blazestore';
import { db } from './setup';

export type Task = { name: string; isDone: boolean };
export type TaskWithId = WithId<Task>;

export const tasksCollection = new Collection<Task>('tasks', db);
