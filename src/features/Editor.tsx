import { FC, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

type Props = {
  item?: Item;
};

export const Tiptap: FC<Props> = ({ item }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Hello World!</p>",
  });

  useEffect(() => {
    if (editor == null || item == null) return;
    editor.commands.setContent(item.body);
  }, [item, editor]);

  return (
    <div className="h-screen p-4">
      <EditorContent className="h-full" editor={editor} />
    </div>
  );
};
