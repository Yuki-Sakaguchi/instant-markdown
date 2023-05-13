import { useCallback, useEffect, useMemo, useState } from "react";

export const keyName = "instant-markdown";

/**
 * リストを修正するhooks
 */
export const useList = () => {
  const [list, setList] = useState<Item[]>([]);
  const [selectedItemId, setSelectedItemId] = useState("");

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
    setList([...baseList, { ...newItem, body }]);
  };

  const addItem = () => {
    setList([
      ...list,
      {
        id: (list.length + 1).toString(),
        title: "title" + (list.length + 1),
        date: new Date(),
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
