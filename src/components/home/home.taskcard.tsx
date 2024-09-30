import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Card } from "../ui/card";
import { Button } from "../ui/button";

const formatDueDate = (date?: Date): string => {
  if (!date) return "No due date provided";

  const parsedDate = new Date(date);
  return !isNaN(parsedDate.getTime())
    ? parsedDate.toLocaleDateString()
    : "Invalid date";
};

export const TaskCard = ({
  search,
  darkMode,
  tasks,
  router,
  setTaskToDelete,
  setDeleteDialogOpen,
  setTasks,
}: any) => {
  const openDeleteDialog = (taskId: string) => {
    setTaskToDelete(taskId);
    setDeleteDialogOpen(true);
  };

  const handleDragEnd = (result: any) => {
    const { source, destination } = result;
    if (!destination) return;

    const reorderedTasks = Array.from(tasks);
    const [removed] = reorderedTasks.splice(source.index, 1);
    reorderedTasks.splice(destination.index, 0, removed);

    setTasks(reorderedTasks);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="tasksList">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {tasks
              .filter((task: { title: string }) =>
                task.title.toLowerCase().includes(search.toLowerCase())
              )
              .map((task: any, index: any) => (
                <Draggable
                  key={task.id}
                  draggableId={task.id.toString()}
                  index={index}
                >
                  {(provided) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`${
                        darkMode
                          ? "bg-gray-950 hover:bg-gray-900"
                          : "bg-white hover:bg-gray-100"
                      } transition-colors duration-300 ease-in-out shadow-lg p-4`}
                    >
                      <h2 className="text-xl font-semibold mb-2">
                        {task.title}
                      </h2>
                      <p
                        className={`${
                          darkMode ? "text-gray-300" : "text-gray-600"
                        } text-sm mb-4 font-bold`}
                      >
                        {task.description}
                      </p>
                      <p
                        className={`text-sm text-gray-600 mb-4 font-bold ${
                          new Date(formatDueDate(task.dueDate)) <= new Date()
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {formatDueDate(task.dueDate)}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => router.push(`/edit/${task.id}`)}
                            className={`${
                              darkMode
                                ? "bg-blue-950 hover:bg-blue-900"
                                : "bg-blue-500 hover:bg-blue-600"
                            } text-white px-4 py-2 rounded-md transition-colors duration-200 ease-in-out`}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => openDeleteDialog(task.id)} // Esta função agora está sendo chamada corretamente
                            className={`${
                              darkMode
                                ? "bg-red-900 text-white hover:bg-red-800"
                                : "bg-red-500 text-white hover:bg-red-600"
                            } px-4 py-2 rounded-md transition-colors duration-200 ease-in-out`}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </Card>
                  )}
                </Draggable>
              ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
