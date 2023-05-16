import { Dispatch, FC, useEffect, useState } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TiptapImage from "@tiptap/extension-image";
import { useList } from "./useList";
import Image from "next/image";
import { TrashIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { handleDropImage } from "@/utils/ImageLoader";
import Modal from "react-modal";
import { SetStateAction } from "jotai";
Modal.setAppElement("#__next");

/**
 * エディター以外のデフォルト表示
 */
const AboutView: FC = () => {
  return (
    <div className="px-5">
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

/**
 * コマンドのショートカットを表示するモーダル
 */
const CommandModal: FC<{
  isOpenModal: boolean;
  setIsOpenModal: Dispatch<SetStateAction<boolean>>;
}> = ({ isOpenModal, setIsOpenModal }) => {
  const commandList = [
    { name: "太字", shortcut: ["⌘", "b"] },
    { name: "斜字", shortcut: ["⌘", "i"] },
    { name: "打ち消し線", shortcut: ["⌘", "shift", "x"] },
    { name: "コード", shortcut: ["⌘", "e"] },
  ];
  return (
    <Modal
      isOpen={isOpenModal}
      overlayClassName="absolute inset-0 bg-opacity-75 bg-white"
      parentSelector={() => document.querySelector("#editor")!}
      shouldCloseOnOverlayClick={true}
      onRequestClose={() => setIsOpenModal(false)}
    >
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                コマンド
              </th>
              <th scope="col" className="px-6 py-3">
                ショートカット
              </th>
            </tr>
          </thead>
          <tbody>
            {commandList.map(({ name, shortcut }, index) => (
              <tr
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                key={index}
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {name}
                </th>
                <td className="px-6 py-4">
                  <p
                    className="flex"
                    dangerouslySetInnerHTML={{
                      __html: shortcut
                        .map(
                          (command) =>
                            "<pre style='background-color: rgba(0, 0, 0, 0.1); padding: 2px 6px; margin: 0 4px; border-radius: 2px'>" +
                            command +
                            "</pre>"
                        )
                        .join("+"),
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Modal>
  );
};

/**
 * IMEかどうか判定するhooks
 */
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
  const [isOpenModal, setIsOpenModal] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TiptapImage.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: "border",
        },
      }),
      Placeholder.configure({
        placeholder: "メモを書きましょう！",
      }),
    ],
    editorProps: {
      handleDrop: handleDropImage,
    },
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

  // 初回にモーダルの配置を設定する
  useEffect(() => {}, []);

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
    <div id="editor" className="relative h-full pl-4">
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
            <hr className="w-[200px] mt-4 border-0 border-dashed border-t-2" />
          </div>
          <EditorContent className="flex-1" editor={editor} />
          <div className="flex flex-col absolute top-3 right-3 p-2">
            <button
              className="transition-opacity opacity-50 hover:opacity-100"
              onClick={deleteItem}
            >
              <TrashIcon className="w-[20px]" />
            </button>
            <button
              className="mt-5 transition-opacity opacity-50 hover:opacity-100"
              onClick={() => setIsOpenModal(true)}
            >
              <ExclamationCircleIcon className="w-[20px]" />
            </button>
          </div>
          <CommandModal
            isOpenModal={isOpenModal}
            setIsOpenModal={setIsOpenModal}
          />
        </div>
      )}
    </div>
  );
};
