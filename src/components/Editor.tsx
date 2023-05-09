import React, { useEffect, useMemo, useState } from "react";
import {
  EditorState,
  convertFromRaw,
  convertToRaw,
  RichUtils,
  KeyBindingUtil,
  getDefaultKeyBinding,
} from "draft-js";

import Editor, { createEditorStateWithText } from "@draft-js-plugins/editor";

import createInlineToolbarPlugin, {
  Separator,
} from "@draft-js-plugins/inline-toolbar";
import "@draft-js-plugins/inline-toolbar/lib/plugin.css";

import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
} from "@draft-js-plugins/buttons";

import "@draft-js-plugins/inline-toolbar/lib/plugin.css";
import "draft-js/dist/Draft.css";

const keyName = "instant-markdown";

export default function DraftJSEditor() {
  const [plugins, InlineToolbar] = useMemo(() => {
    const inlineToolbarPlugin = createInlineToolbarPlugin();
    return [[inlineToolbarPlugin], inlineToolbarPlugin.InlineToolbar];
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
      setEditorState(RichUtils.toggleBlockType(content, "header-one"));
      // setEditorState(createEditorStateWithText());
    }
    setEditorEnable(true);
  }, []);

  const saveContent = () => {
    const contentState = editorState.getCurrentContent();
    const raw = convertToRaw(contentState);
    localStorage.setItem(keyName, JSON.stringify(raw, null, 2));
  };

  const getContent = () => {
    const raw = localStorage.getItem(keyName);
    if (raw == null) return null;
    return convertFromRaw(JSON.parse(raw));
  };

  const handleKeyCommand = (command: any, editorState: any) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  // const handleKeyCommand = (command: any, editorState: any) => {
  //   // 保存コマンド
  //   if (command === "myeditor-save") {
  //     saveContent();
  //     return "handled";
  //   }
  //   // その他ユーティル系のコマンド（太字など）
  //   const newState = RichUtils.handleKeyCommand(editorState, command);
  //   if (newState) {
  //     setEditorState(newState);
  //     return "handled";
  //   }
  //   return "not-handled";
  // };

  const myKeyBindingFn = (e: any) => {
    if (e.keyCode === 83 && hasCommandModifier(e)) {
      return "myeditor-save";
    }
    return getDefaultKeyBinding(e);
  };

  const onChange = (value: any) => {
    setEditorState(value);
  };

  return (
    <>
      {editorEnable && (
        <>
          <Editor
            editorState={editorState}
            onChange={onChange}
            plugins={plugins}
          />
          <InlineToolbar>
            {(externalProps) => (
              <>
                <ItalicButton {...externalProps} />
                <BoldButton {...externalProps} />
                <UnderlineButton {...externalProps} />
                {/* <Separator {...externalProps} /> */}
                <HeadlineOneButton {...externalProps} />
                <HeadlineTwoButton {...externalProps} />
                <HeadlineThreeButton {...externalProps} />
              </>
            )}
          </InlineToolbar>
        </>
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
