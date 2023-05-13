import { FC, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useList } from "./useList";

export const Tiptap: FC = () => {
  const { selectedItem } = useList();
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "メモを書きましょう！",
      }),
    ],
  });

  useEffect(() => {
    if (editor == null || selectedItem == null) return;
    editor.commands.setContent(selectedItem.body);
  }, [selectedItem, editor]);

  return (
    <div className="h-screen p-4">
      <EditorContent className="h-full" editor={editor} />
    </div>
  );
};
