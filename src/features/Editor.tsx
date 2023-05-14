import { FC, useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useList } from "./useList";
import Image from "next/image";
import { TrashIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";

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
        メモはあなたのブラウザに保存されます。
        <br />
        サーバーには一切送信されませんので安心してお使いください！
        <br />
        <br />※ まだβ版なので頻繁に機能が変更されたり、追加されたりします。
      </p>
    </div>
  );
};

function useComposing() {
  const [isComposing, setIsComposing] = useState(false);

  // IME入力中かどうかを判定する処理
  useEffect(() => {
    window.addEventListener("compositionstart", startHandler);
    window.addEventListener("compositionend", endHander);
    return () => {
      window.removeEventListener("compositionstart", startHandler);
      window.removeEventListener("compositionend", endHander);
    };
  }, []);

  function startHandler() {
    setIsComposing(true);
  }

  function endHander() {
    setIsComposing(false);
  }

  return {
    isComposing,
    setIsComposing,
  };
}

/**
 * エディターコンポーネント
 */
export const Tiptap: FC = () => {
  const { selectedItem, onChange, removeItem } = useList();
  const { isComposing } = useComposing();
  const [updateTimer, setUpdateTimer] = useState<NodeJS.Timeout>();
  const [cursorPoint, setCursorPoint] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "メモを書きましょう！",
      }),
    ],
    onUpdate,
  });

  /**
   * データの更新処理
   *
   * 更新するたびに実行しないように setTimeout を用いて一番最後の update 時のみに動くように調整
   * IME入力中の場合にも変更を無視する
   * また、更新時のカーソルの位置も保存して、データ更新後に使う
   */
  function onUpdate() {
    if (editor == null) return;
    if (updateTimer) clearTimeout(updateTimer);
    setUpdateTimer(
      setTimeout(() => {
        if (isComposing) return;
        setCursorPoint(editor?.state.selection.anchor);
        onChange(editor.getHTML());
      }, 400)
    );
  }

  function deleteItem() {
    if (selectedItem == null) return;
    if (confirm("記事を削除してもよろしいでしょうか？")) {
      removeItem(selectedItem.id);
    }
  }

  function formatDate(date: Date) {
    return format(new Date(date), "yyyy-MM-dd HH:mm:ss");
  }

  // IME判定後もアップデート処理を実行
  useEffect(() => {
    onUpdate();
  }, [isComposing]);

  // データが更新されたら反映する
  useEffect(() => {
    if (editor == null || selectedItem == null) return;
    editor.commands.setContent(selectedItem.body);
    editor.commands.focus(cursorPoint);
    if (!editor.isFocused) editor.commands.focus();
  }, [selectedItem, editor]);

  return (
    <div className="h-full pl-4">
      {selectedItem == null ? (
        <div className="h-full flex justify-center items-center">
          <AboutView />
        </div>
      ) : (
        <div className="overflow-scroll relative h-full flex flex-col py-4">
          <div className="mb-4">
            <time className="block text-xs text-gray-400">
              作成日 : {formatDate(selectedItem.createdAt)}
            </time>
            <time className="block text-xs text-gray-400">
              更新日 : {formatDate(selectedItem.updatedAt)}
            </time>
          </div>
          <EditorContent className="flex-1" editor={editor} />
          <button
            className="absolute top-3 right-3 p-2 transition-opacity opacity-50 hover:opacity-100"
            onClick={deleteItem}
          >
            <TrashIcon className="w-[20px]" />
          </button>
        </div>
      )}
    </div>
  );
};
