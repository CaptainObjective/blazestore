import { Where, useCollection, SortBy, SortType } from 'blazestore';
import { ChangeEventHandler, FormEventHandler, useState } from 'react';
import { Task, tasksCollection } from '../firebase/TaskCollection';
import { TaskListItem } from './Task';

export const App = () => {
  const [name, setName] = useState('');
  const [showAllTasks, setAllTasks] = useState(true);
  const [sortOrder, setSortOrder] = useState<SortType>('Ascending');

  const where: Where<Task> = showAllTasks ? { isDone: { is: !showAllTasks } } : {};
  const sortBy: SortBy<Task> = { name: sortOrder };
  const tasks = useCollection(tasksCollection, { where, sortBy });

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'Ascending' ? 'Descending' : 'Ascending');
  };

  const toggleShowAllTasks = () => {
    setAllTasks(!showAllTasks);
  };

  const handleNameChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setName(event.target.value);
  };

  const addNewTask: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    await tasksCollection.create({ name, isDone: false });
    setName('');
  };

  return (
    <main className="container">
      <h1>React example</h1>
      <form onSubmit={addNewTask}>
        <label>
          Task
          <input name="name" type="text" placeholder="Add new task..." value={name} onChange={handleNameChange} />
        </label>
        <button type="submit">Add</button>
      </form>
      <div className="filters">
        <button onClick={toggleShowAllTasks}>Show {showAllTasks ? 'all' : 'only in progress'}</button>
        <button onClick={toggleSortOrder}>Sort by name {sortOrder === 'Ascending' ? 'Z-A' : 'A-Z'}</button>
      </div>
      <ul>
        {tasks.map((task) => (
          <TaskListItem key={task.id} {...task} />
        ))}
      </ul>
    </main>
  );
};
