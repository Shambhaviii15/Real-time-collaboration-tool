// EditorRoom.tsx
import React, { useRef, useEffect } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";
import Editor from "@monaco-editor/react";

type Props = { roomId: string; username: string };
export default function EditorRoom({ roomId, username }: Props) {
  const editorRef = useRef<ReturnType<typeof Editor> | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider(
      process.env.REACT_APP_WS_URL || "ws://localhost:1234",
      roomId,
      ydoc
    );

    provider.awareness.setLocalStateField("user", {
      name: username,
      color: "#" + Math.floor(Math.random()*16777215).toString(16),
    });

    const yText = ydoc.getText("codetext");
    const monacoModel = editorRef.current.getModel();
    if (!monacoModel) return;

    const binding = new MonacoBinding(
      yText,
      monacoModel,
      new Set([editorRef.current]),
      provider.awareness
    );

    return () => {
      binding.destroy();
      provider.disconnect();
      ydoc.destroy();
    };
  }, [roomId, username]);

  return (
    <Editor
      height="80vh"
      defaultLanguage="javascript"
      defaultValue="// Start coding..."
      onMount={(editor) => { editorRef.current = editor; }}
      options={{ minimap: { enabled: false } }}
    />
  );
}
