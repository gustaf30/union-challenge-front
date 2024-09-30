import { Draggable } from 'react-beautiful-dnd';
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";

export const TaskCard = ({ task, index, darkMode, onDelete }: any) => (
  <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
    {(provided) => (
      <Card
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className={`${darkMode ? 'bg-gray-950 hover:bg-gray-900' : 'bg-white hover:bg-gray-100'} shadow-lg p-4`}
      >
        <h2 className="text-xl font-semibold mb-2">{task.title}</h2>
        <p className="text-sm text-gray-600 mb-4">{task.description}</p>
        <p className="text-sm text-gray-600 mb-4">{task.dueDate}</p>
        <div className="flex justify-between items-center">
          {renderBadge(task.status)}
          <Button onClick={onDelete} className={`${darkMode ? 'bg-red-900' : 'bg-red-500'} px-4 py-2`}>Delete</Button>
        </div>
      </Card>
    )}
  </Draggable>
);

const renderBadge = (status: any) => {
  switch (status) {
    case '0':
      return <Badge color='yellow'>Pending</Badge>;
    case '1':
      return <Badge color="blue">In Progress</Badge>;
    case '2':
      return <Badge color="green">Completed</Badge>;
    default:
      return null;
  }
};
