import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "../ui/dialog";
import { Button } from "../ui/button";

export const DialogDeleteTask = ({ open, onClose, onDelete }: any) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Confirm exclusion</DialogTitle>
        <DialogDescription>Are you sure you want to delete this task?</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose>
          <Button>Cancel</Button>
        </DialogClose>
        <Button onClick={onDelete} className="bg-red-500">Confirm</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);