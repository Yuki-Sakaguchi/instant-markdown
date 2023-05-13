import { atom, useAtom } from "jotai";
import { useEffect, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";

export const keyName = "instant-markdown";

export const ListAtom = atom<Item[]>([]);
export const SelectedItemIdAtom = atom<string>("");

/**
 * リストを修正するhooks
 */
export const useList = () => {
  const [list, setList] = useAtom(ListAtom);
  const [selectedItemId, setSelectedItemId] = useAtom(SelectedItemIdAtom);

  const selectedItem = useMemo(() => {
    console.log(selectedItemId);
    if (list == null || list.length == 0 || selectedItemId == "") return null;
    return list.find((item) => item.id === selectedItemId);
  }, [list, selectedItemId]);

  // 初回に LocalStorage からデータを取得して設定する
  useEffect(() => {
    const data = getContent();
    if (data != null) {
      console.log("初回", data);
      setList([...data]);
    }
  }, []);

  // list が更新されたら LocalStorage を更新する
  useEffect(() => {
    if (list == null || list.length === 0) return;
    localStorage.setItem(keyName, JSON.stringify(list, null, 2));
  }, [list]);

  const getContent = () => {
    const raw = localStorage.getItem(keyName);
    if (raw == null) return null;
    return JSON.parse(raw);
  };

  const onChange = (body: string) => {
    const newItem = list.find((item) => item.id === selectedItemId);
    if (newItem == null) return;
    const baseList = list.filter((item) => item.id !== selectedItemId);
    setList([...baseList, { ...newItem, body, updatedAt: new Date() }]);
  };

  const addItem = () => {
    setList([
      ...list,
      {
        id: uuidv4(),
        title: "no title...",
        createdAt: new Date(),
        updatedAt: new Date(),
        body: "",
      },
    ]);
  };

  return {
    list,
    selectedItemId,
    selectedItem,
    setList,
    setSelectedItemId,
    addItem,
    onChange,
  };
};
