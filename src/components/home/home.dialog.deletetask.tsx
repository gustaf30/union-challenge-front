import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import { Button } from "../ui/button";

export const DialogDeleteTask = ({
  deleteDialogOpen,
  setDeleteDialogOpen,
  darkMode,
  handleDeleteTask,
}: any) => {
  return (
    <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
      <DialogContent
        className={`${
          darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
        }`}
      >
        <DialogHeader>
          <DialogTitle>Confirm exclusion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this task?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>
            <Button
              className={`${
                darkMode
                  ? "bg-blue-950 hover:bg-blue-900"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white transition-colors duration-200 ease-in-out px-4 py-2 ml-2 rounded-md`}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleDeleteTask}
            className={`${
              darkMode
                ? "bg-red-900 hover:bg-red-800"
                : "bg-red-500 hover:bg-red-600"
            } text-white transition-colors duration-200 ease-in-out px-4 py-2 ml-2 rounded-md`}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
