import { FC, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useList } from "./useList";
import Image from "next/image";

export const Tiptap: FC = () => {
  const { selectedItem, selectedItemId } = useList();
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "メモを書きましょう！",
      }),
    ],
  });

  useEffect(() => {
    console.log(selectedItem, selectedItemId);
    if (editor == null || selectedItem == null) return;
    editor.commands.setContent(selectedItem.body);
  }, [selectedItem, editor]);

  return (
    <div className="h-screen p-4">
      {selectedItem == null ? (
        <div className="h-full flex justify-center items-center">
          <div>
            <Image
              className="mx-auto mb-3"
              src="/images/undraw_programmer_re_owql.svg"
              alt=""
              width="200"
              height="200"
            />
            <p className="text-center text-[#adb5bd] leading-7">
              メモはサーバーには送信されません。
              <br />
              安心してお使いください！
            </p>
          </div>
        </div>
      ) : (
        <EditorContent className="h-full" editor={editor} />
      )}
    </div>
  );
};
