import { Icon } from '@iconify/react';
import { TaskWithId, tasksCollection } from '../firebase/TaskCollection';

export const TaskListItem = ({ id, name, isDone }: TaskWithId) => {
  const title = isDone ? <s>{name}</s> : <span>{name}</span>;

  const toggleTaskCompletionIconName = isDone ? 'mdi:remove' : 'mdi:tick';
  const toggleTaskCompletionIconColor = isDone ? 'red' : 'green';
  const toggleTaskCompletion = () => {
    tasksCollection.update(id, { isDone: !isDone });
  };

  const deleteTask = () => {
    tasksCollection.delete(id);
  };

  return (
    <li>
      <div className="task">
        {title}
        <div className="icons">
          <Icon
            color={toggleTaskCompletionIconColor}
            icon={toggleTaskCompletionIconName}
            onClick={toggleTaskCompletion}
          />
          <Icon color="red" icon="mdi:trash" onClick={deleteTask} />
        </div>
      </div>
    </li>
  );
};
