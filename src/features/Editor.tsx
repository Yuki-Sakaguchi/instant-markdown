import { FC, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useList } from "./useList";
import Image from "next/image";

/**
 * エディターコンポーネント
 */
export const Tiptap: FC = () => {
  const { selectedItem, onChange } = useList();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "メモを書きましょう！",
      }),
    ],
    onUpdate(data) {
      onChange(data.editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor == null || selectedItem == null) return;
    editor.commands.setContent(selectedItem.body);
  }, [selectedItem, editor]);

  return (
    <div className="h-full pl-4 py-4">
      {selectedItem == null ? (
        <div className="h-full flex justify-center items-center">
          <div>
            <Image
              className="mx-auto mb-3"
              src="/images/undraw_programmer_re_owql.svg"
              alt=""
              width="200"
              height="200"
              priority={true}
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
