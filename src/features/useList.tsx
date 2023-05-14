import { atom, useAtom } from "jotai";
import { useEffect, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";

export const keyName = "instant-markdown";

export const ListAtom = atom<Item[]>([]);
export const IsEnableAtom = atom<boolean>(false);
export const SelectedItemIdAtom = atom<string>("");

/**
 * リストを修正するhooks
 */
export const useList = () => {
  const [list, setList] = useAtom(ListAtom);
  const [isEnable, setIsEnable] = useAtom(IsEnableAtom);
  const [selectedItemId, setSelectedItemId] = useAtom(SelectedItemIdAtom);

  const selectedItem = useMemo(() => {
    if (list == null || list.length == 0 || selectedItemId == "") return null;
    return list.find((item) => item.id === selectedItemId);
  }, [list, selectedItemId]);

  // 初回に LocalStorage からデータを取得して設定する
  useEffect(() => {
    const data = getContent();
    if (data != null) {
      setList([...data]);
    }
    setIsEnable(true);
  }, []);

  // list が更新されたら LocalStorage を更新する
  useEffect(() => {
    if (!isEnable) return;
    if (list == null) return;
    localStorage.setItem(keyName, JSON.stringify(list, null, 2));
  }, [list]);

  const getContent = () => {
    const raw = localStorage.getItem(keyName);
    if (raw == null) return null;
    return JSON.parse(raw);
  };

  const onChange = (body: string) => {
    // 選択しているアイテムがなければ終了
    const targetItem = list.find((item) => item.id === selectedItemId);
    if (targetItem == null) return;

    // 本文の中の１つ目のタグの内容をタイトルに置き換える
    const title = (() => {
      const regex = /<[^>]*>([^<]*)<\/[^>]*>/;
      const match = body.match(regex);
      return match == null || match[1] === "" ? "no title" : match[1];
    })();

    // 更新対象のアイテムを作成
    const updateItem = {
      ...targetItem,
      title,
      body,
      updatedAt: new Date(),
    };

    // 選択中以外のアイテムはそのまま更新したいので取得
    const baseList = list.filter((item) => item.id !== selectedItemId);

    setList([...baseList, updateItem]);
  };

  const addItem = () => {
    const id = uuidv4();
    setList([
      ...list,
      {
        id,
        title: "no title",
        createdAt: new Date(),
        updatedAt: new Date(),
        body: "",
      },
    ]);
    setSelectedItemId(id);
  };

  const removeItem = (id: string) => {
    // 選択しているアイテムがなければ終了
    const targetItem = list.find((item) => item.id === id);
    if (targetItem == null) return;

    // 選択中以外のアイテム以外で更新
    const baseList = list.filter((item) => item.id !== id);
    setList([...baseList]);
  };

  return {
    list,
    selectedItemId,
    selectedItem,
    setList,
    setSelectedItemId,
    onChange,
    addItem,
    removeItem,
  };
};
