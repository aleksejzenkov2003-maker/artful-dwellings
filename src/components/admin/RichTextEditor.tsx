import { useRef, useCallback, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Undo,
  Redo,
  Heading1,
  Heading2,
  Heading3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Начните вводить текст...",
  className,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  // Initialize content
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, []);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  }, [handleInput]);

  const handleFormat = useCallback((tag: string) => {
    execCommand("formatBlock", tag);
  }, [execCommand]);

  const handleLink = useCallback(() => {
    const url = window.prompt("Введите URL ссылки:");
    if (url) {
      execCommand("createLink", url);
    }
  }, [execCommand]);

  return (
    <div className={cn("border rounded-lg overflow-hidden bg-background", className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/30">
        {/* Undo/Redo */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => execCommand("undo")}
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => execCommand("redo")}
        >
          <Redo className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Headings */}
        <Toggle
          size="sm"
          onPressedChange={() => handleFormat("h1")}
        >
          <Heading1 className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          onPressedChange={() => handleFormat("h2")}
        >
          <Heading2 className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          onPressedChange={() => handleFormat("h3")}
        >
          <Heading3 className="h-4 w-4" />
        </Toggle>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Text Formatting */}
        <Toggle
          size="sm"
          onPressedChange={() => execCommand("bold")}
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          onPressedChange={() => execCommand("italic")}
        >
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          onPressedChange={() => execCommand("underline")}
        >
          <UnderlineIcon className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          onPressedChange={() => execCommand("strikeThrough")}
        >
          <Strikethrough className="h-4 w-4" />
        </Toggle>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Color Picker */}
        <input
          type="color"
          onChange={(e) => execCommand("foreColor", e.target.value)}
          className="w-8 h-8 rounded cursor-pointer border"
          title="Цвет текста"
        />

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Alignment */}
        <Toggle
          size="sm"
          onPressedChange={() => execCommand("justifyLeft")}
        >
          <AlignLeft className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          onPressedChange={() => execCommand("justifyCenter")}
        >
          <AlignCenter className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          onPressedChange={() => execCommand("justifyRight")}
        >
          <AlignRight className="h-4 w-4" />
        </Toggle>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Lists */}
        <Toggle
          size="sm"
          onPressedChange={() => execCommand("insertUnorderedList")}
        >
          <List className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          onPressedChange={() => execCommand("insertOrderedList")}
        >
          <ListOrdered className="h-4 w-4" />
        </Toggle>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Links */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleLink}
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        className="min-h-[200px] p-4 focus:outline-none prose prose-sm max-w-none"
        onInput={handleInput}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />

      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: hsl(var(--muted-foreground));
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
