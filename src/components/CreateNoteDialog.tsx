"use client";
import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Loader2, Plus } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";

type Props = {};

const CreateNoteDialog = (props: Props) => {
  const [input, setInput] = React.useState("");
  const router = useRouter();

  const uploadToFirebase = useMutation({
    mutationFn: async (noteId: string) => {
      const response = await axios.post("/api/uploadToFirebase", {
        noteId,
      });
      return response.data;
    },
  });

  const createNotebook = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/createNotebook", {
        name: input,
      });
      return response.data;
    },
  });

  // mutation is a function that hits an endpoint
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input === "") {
      window.alert("Please enter a name for your notebook");
      return;
    }
    createNotebook.mutate(undefined, {
      onSuccess: ({ note_id }) => {
        console.log("created new note: ", { note_id });
        // hit another endpoint to upload temp dalle url to permanent firebase url
        uploadToFirebase.mutate(note_id);
        router.push(`/notebook/${note_id}`);
      },
      onError: (error) => {
        console.error(error);
        window.alert("Failed to crate new notebook");
      },
    });
  };
  return (
    <Dialog>
      <DialogTrigger>
        <div className="border-dashed border-2 flex border-cyan-600 h-full rounded-lg items-center justify-center sm:flex-col hover:shadow-xl transition hover:-translate-y-1 flex-row p-4">
          <Plus className="w-6 h-6 text-cyan-600" strokeWidth={3} />
          <h2 className="font-semibold text-cyan-600 sm:mt-2">New Note Book</h2>
        </div>
      </DialogTrigger>
      <DialogContent className="bg-white rounded-lg">
        <DialogHeader>
          <DialogTitle className="font-semibold text-gray-600">
            New Note Book
          </DialogTitle>
          <DialogDescription>
            You can create a new note by clicking the button below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Name..."
            className="text-gray-600"
          />
          <div className="h-4"></div>
          <DialogFooter>
            <div className="flex items-center gap-2">
              <DialogClose asChild>
                <Button type="button" variant={"secondary"}>
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="bg-cyan-600"
                disabled={createNotebook.isPending}
              >
                {createNotebook.isPending && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Create
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNoteDialog;
