import React, { useEffect, useMemo, useState } from "react";

import {
  EditorState,
  convertFromRaw,
  convertToRaw,
  RichUtils,
  KeyBindingUtil,
  getDefaultKeyBinding,
  AtomicBlockUtils,
  SelectionState,
} from "draft-js";

import Editor from "@draft-js-plugins/editor";

import createInlineToolbarPlugin, {
  Separator,
} from "@draft-js-plugins/inline-toolbar";

import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
} from "@draft-js-plugins/buttons";

import createImagePlugin from "@draft-js-plugins/image";

import "draft-js/dist/Draft.css";
import "@draft-js-plugins/inline-toolbar/lib/plugin.css";
import "@draft-js-plugins/image/lib/plugin.css";

const keyName = "instant-markdown";

/**
 * Draft.jsを使ったエディター
 */
export default function DraftJSEditor() {
  const [plugins, InlineToolbar] = useMemo(() => {
    const inlineToolbarPlugin = createInlineToolbarPlugin();
    const imagePlugin = createImagePlugin();
    return [
      [inlineToolbarPlugin, imagePlugin],
      inlineToolbarPlugin.InlineToolbar,
    ];
  }, []);

  const [editorEnable, setEditorEnable] = useState(false);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const { hasCommandModifier } = KeyBindingUtil;

  useEffect(() => {
    const data = getContent();
    if (data != null) {
      const content = EditorState.createWithContent(data);
      setEditorState(content);
    }
    setEditorEnable(true);
  }, []);

  const saveContent = () => {
    if (!localStorage.setItem) return;
    const contentState = editorState.getCurrentContent();
    const raw = convertToRaw(contentState);
    localStorage.setItem(keyName, JSON.stringify(raw, null, 2));
  };

  const getContent = () => {
    if (!localStorage.getItem) return;
    const raw = localStorage.getItem(keyName);
    if (raw == null) return null;
    return convertFromRaw(JSON.parse(raw));
  };

  const handleKeyCommand = (command: any, editorState: any) => {
    console.log(command);

    // 保存コマンド
    if (command === "myeditor-save") {
      saveContent();
      return "handled";
    }

    // その他ユーティル系のコマンド（太字など）
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }

    return "not-handled";
  };

  const myKeyBindingFn = (e: any) => {
    if (e.keyCode === 83 && hasCommandModifier(e)) {
      return "myeditor-save";
    }
    return getDefaultKeyBinding(e);
  };

  const onChange = (value: any) => {
    setEditorState(value);
  };

  const handleDroppedFiles = async (
    selection: SelectionState,
    files: Blob[]
  ) => {
    console.log(files);
    const f = (await convertToBase64(files[0])) as string;
    insertImage(f);
  };

  const insertImage = (url: string) => {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      "image",
      "IMMUTABLE",
      { src: url }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity,
    });
    onChange(
      AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " ")
    );
  };

  const convertToBase64 = (file: any) => {
    return new Promise((resolve, reject) => {
      const render = new FileReader();
      render.onload = (event) => {
        console.log(event);
        const base64 = event.target?.result;
        if (base64) {
          resolve(base64);
        } else {
          reject("");
        }
      };
      render.readAsDataURL(file);
    });
  };

  return (
    <>
      {editorEnable && (
        <div className="post">
          <Editor
            editorState={editorState}
            onChange={onChange}
            plugins={plugins}
            handleKeyCommand={handleKeyCommand}
            keyBindingFn={myKeyBindingFn}
            handleDroppedFiles={handleDroppedFiles}
          />
          <InlineToolbar>
            {(externalProps) => (
              <>
                <ItalicButton {...externalProps} />
                <BoldButton {...externalProps} />
                <UnderlineButton {...externalProps} />
                <Separator />
                <HeadlineOneButton {...externalProps} />
                <HeadlineTwoButton {...externalProps} />
                <HeadlineThreeButton {...externalProps} />
              </>
            )}
          </InlineToolbar>
        </div>
        // <Editor
        //   placeholder="保存も送信もしません"
        //   editorKey="test-key"
        //   editorState={editorState}
        //   onChange={setEditorState}
        //   handleKeyCommand={handleKeyCommand}
        //   keyBindingFn={myKeyBindingFn}
        // />
      )}
      <button
        className="border rounded-sm px-4 py-2"
        onClick={() => saveContent()}
      >
        保存
      </button>
    </>
  );
}
