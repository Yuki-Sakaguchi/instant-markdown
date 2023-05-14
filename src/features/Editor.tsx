import { FC, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useList } from "./useList";
import Image from "next/image";
import { TrashIcon } from "@heroicons/react/24/outline";

const AboutView: FC = () => {
  return (
    <div>
      <Image
        className="mx-auto mb-3"
        src="/images/undraw_programmer_re_owql.svg"
        alt=""
        width="200"
        height="200"
        priority={true}
      />
      <p className="text-center text-gray-600 leading-7">
        ようこそ！
        <br />
        「Instant Note」へ！
        <br />
        <br />
        メモはあなたのブラウザの保存されます。
        <br />
        サーバーには一切送信されませんので安心してお使いください！
        <br />
        <br />※ まだβ版なので頻繁に機能が変更されたり、追加されたりします。
      </p>
    </div>
  );
};

/**
 * エディターコンポーネント
 */
export const Tiptap: FC = () => {
  const { selectedItem, onChange, removeItem } = useList();

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
    editor.commands.focus();
  }, [selectedItem, editor]);

  const deleteItem = () => {
    if (selectedItem == null) return;
    if (confirm("記事を削除してもよろしいでしょうか？")) {
      removeItem(selectedItem.id);
    }
  };

  return (
    <div className="h-full pl-4 py-4">
      {selectedItem == null ? (
        <div className="h-full flex justify-center items-center">
          <AboutView />
        </div>
      ) : (
        <div className="relative">
          <EditorContent className="h-full" editor={editor} />
          <button
            className="absolute -top-2 right-2 p-2 transition-opacity opacity-50 hover:opacity-100"
            onClick={deleteItem}
          >
            <TrashIcon className="w-[20px]" />
          </button>
        </div>
      )}
    </div>
  );
};
