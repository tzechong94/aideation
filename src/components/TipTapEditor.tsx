"use client";
import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import TipTapMenuBar from "./TipTapMenuBar";
import { Button } from "./ui/button";
import { useDebounce } from "./useDebounce";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { NoteType } from "@/lib/db/schema";
import Text from "@tiptap/extension-text";
import { useCompletion } from "ai/react";

type Props = { note: NoteType };

const TipTapEditor = ({ note }: Props) => {
  const [editorState, setEditorState] = React.useState(
    note.editorState || `<h1>${note.name}</h1>`
  );

  const { complete, completion } = useCompletion({
    api: "/api/completion",
  });

  const saveNote = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/saveNote", {
        noteId: note.id,
        editorState,
      });
      return response.data;
    },
  });

  const customText = Text.extend({
    addKeyboardShortcuts() {
      return {
        "Shift-a": () => {
          // take last 30 words
          const prompt = this.editor.getText().split(" ").slice(-30).join(" ");
          console.log(prompt, "prompt for ai");
          complete(prompt);
          console.log("activate AI");
          return true;
        },
      };
    },
  });

  const editor = useEditor({
    autofocus: true,
    extensions: [StarterKit, customText],
    content: editorState,
    onUpdate: ({ editor }) => {
      setEditorState(editor.getHTML());
    },
  });

  const lastCompletion = React.useRef("");

  //   const token = React.useMemo(() => {
  //     if (!completion) return;
  //     if (lastCompletion.current === undefined) {
  //       lastCompletion.current = "";
  //     }

  //     const diff = completion.slice(lastCompletion.current.length);
  //     console.log("last completion", lastCompletion.current);
  //     console.log("diff", diff);
  //     lastCompletion.current = completion;
  //     return diff;
  //   }, [completion]);

  React.useEffect(() => {
    // get individual word to insert into editor
    if (!editor || !completion) return;
    const diff = completion.slice(lastCompletion.current.length);
    lastCompletion.current = completion;

    // console.log("token", token);
    editor.commands.insertContent(diff);
    // console.log(completion);
  }, [completion, editor]);

  const debounceEditorState = useDebounce(editorState, 500);

  React.useEffect(() => {
    // save to db
    if (debounceEditorState === "") return;
    saveNote.mutate(undefined, {
      onSuccess: (data) => {
        console.log("success update!", data);
      },
      onError: (err) => {
        console.error(err);
      },
    });
    console.log(debounceEditorState);
  }, [debounceEditorState]);
  return (
    <>
      <div className="flex text-gray-600">
        {editor && <TipTapMenuBar editor={editor} />}
        <Button disabled variant={"outline"} className="bg-white">
          {saveNote.isPending ? "Saving..." : "Saved"}
        </Button>
      </div>

      <div className="prose text-gray-600">
        <EditorContent editor={editor} />
      </div>
    </>
  );
};

export default TipTapEditor;
