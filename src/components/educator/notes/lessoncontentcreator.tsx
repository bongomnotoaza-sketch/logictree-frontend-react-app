// LessonContentCreator.tsx
import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type LessonElement =
    | {
          index: number;
          type: "heading";
          heading: string;
      }
    | {
          index: number;
          type: "subheading";
          subheading: string;
      }
    | {
          index: number;
          type: "text";
          text: string;
      }
    | {
          index: number;
          type: "image";
          imageUrl: string;
      }
    | {
          index: number;
          type: "video";
          videoUrl: string;
      }
    | {
          index: number;
          type: "codebox";
          input: string;
          output: string;
      };

type ElementType = LessonElement["type"];

// A draft shape where every field is optional — easier for form editing
type DraftElement = {
    id: string;
    type: ElementType;
    heading?: string;
    subheading?: string;
    text?: string;
    imageUrl?: string;
    videoUrl?: string;
    input?: string;
    output?: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const uid = () => Math.random().toString(36).slice(2, 9);

const emptyDraft = (type: ElementType): DraftElement => {
    const base: DraftElement = { id: uid(), type };
    switch (type) {
        case "heading":
            base.heading = "";
            break;
        case "subheading":
            base.subheading = "";
            break;
        case "text":
            base.text = "";
            break;
        case "image":
            base.imageUrl = "";
            break;
        case "video":
            base.videoUrl = "";
            break;
        case "codebox":
            base.input = "";
            base.output = "Press run";
            break;
    }
    return base;
};

const ELEMENT_TYPES: { type: ElementType; label: string; icon: string }[] = [
    { type: "heading", label: "Heading", icon: "H1" },
    { type: "subheading", label: "Subheading", icon: "H2" },
    { type: "text", label: "Text", icon: "¶" },
    { type: "image", label: "Image", icon: "🖼" },
    { type: "video", label: "Video", icon: "▶" },
    { type: "codebox", label: "Code Box", icon: "</>" },
];

// ─── Component ────────────────────────────────────────────────────────────────

interface LessonContentCreatorProps {
    /** Optional lesson name shown in the header */
    lessonName?: string;
    /** Called whenever the content changes, with a ready-to-use LessonElement[] */
    onChange?: (content: LessonElement[]) => void;
    /** Optional initial content to edit */
    initialContent?: LessonElement[];
    /** Optional callback with the final content when user hits "Save" */
    onSave?: (content: LessonElement[]) => void;
}

export default function LessonContentCreator({
    lessonName,
    onChange,
    initialContent,
    onSave,
}: LessonContentCreatorProps) {
    const [drafts, setDrafts] = useState<DraftElement[]>(() =>
        initialContent
            ? initialContent.map((el) => ({ ...el, id: uid() } as DraftElement))
            : []
    );
    const [editingId, setEditingId] = useState<string | null>(null);

    // ── Drag-and-drop reorder state ──
    const [draggedId, setDraggedId] = useState<string | null>(null);
    const [dragOverId, setDragOverId] = useState<string | null>(null);

    // ── Convert drafts -> LessonElement[] and notify parent ──
    const syncParent = (next: DraftElement[]) => {
        if (!onChange) return;
        const cleaned = toLessonElements(next);
        onChange(cleaned);
    };

    const updateDrafts = (next: DraftElement[]) => {
        setDrafts(next);
        syncParent(next);
    };

    // ── CRUD operations ──
    const addElement = (type: ElementType) => {
        const draft = emptyDraft(type);
        const next = [...drafts, draft];
        updateDrafts(next);
        setEditingId(draft.id);
    };

    const updateElement = (id: string, patch: Partial<DraftElement>) => {
        const next = drafts.map((d) => (d.id === id ? { ...d, ...patch } : d));
        updateDrafts(next);
    };

    const removeElement = (id: string) => {
        const next = drafts.filter((d) => d.id !== id);
        updateDrafts(next);
    };

    const duplicateElement = (id: string) => {
        const idx = drafts.findIndex((d) => d.id === id);
        if (idx < 0) return;
        const copy: DraftElement = { ...drafts[idx], id: uid() };
        const next = [...drafts];
        next.splice(idx + 1, 0, copy);
        updateDrafts(next);
    };

    const clearAll = () => {
        if (!confirm("Delete all lesson content?")) return;
        updateDrafts([]);
    };

    const handleSave = () => {
        const cleaned = toLessonElements(drafts);
        // Replace local state with cleaned version (re-indexed)
        setDrafts(cleaned.map((el) => ({ ...el, id: uid() } as DraftElement)));
        onSave?.(cleaned);
    };

    // ── Drag-and-drop handlers ──
    const handleDragStart = (id: string) => (e: React.DragEvent) => {
        setDraggedId(id);
        e.dataTransfer.effectAllowed = "move";
        // Some browsers need data set for drag to work at all
        e.dataTransfer.setData("text/plain", id);
    };

    const handleDragEnter = (id: string) => (e: React.DragEvent) => {
        e.preventDefault();
        if (id !== draggedId) setDragOverId(id);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (targetId: string) => (e: React.DragEvent) => {
        e.preventDefault();
        if (draggedId && draggedId !== targetId) {
            const next = [...drafts];
            const fromIdx = next.findIndex((d) => d.id === draggedId);
            const toIdx = next.findIndex((d) => d.id === targetId);
            if (fromIdx >= 0 && toIdx >= 0) {
                const [moved] = next.splice(fromIdx, 1);
                next.splice(toIdx, 0, moved);
                updateDrafts(next);
            }
        }
        setDraggedId(null);
        setDragOverId(null);
    };

    const handleDragEnd = () => {
        setDraggedId(null);
        setDragOverId(null);
    };

    // ── Validation helper ──
    const isDraftValid = (d: DraftElement): boolean => {
        switch (d.type) {
            case "heading":
                return !!d.heading?.trim();
            case "subheading":
                return !!d.subheading?.trim();
            case "text":
                return !!d.text?.trim();
            case "image":
                return !!d.imageUrl?.trim();
            case "video":
                return !!d.videoUrl?.trim();
            case "codebox":
                return !!d.input?.trim();
            default:
                return false;
        }
    };

    const validCount = drafts.filter(isDraftValid).length;

    // ── Render ──
    return (
        <div className="w-full h-full flex flex-col bg-zinc-950">
            {/* ── Header ── */}
            <header className="sticky top-0 z-20 bg-zinc-950 backdrop-blur border-b border-green-900/50 px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
                <div>
                    <h1 className="text-lg font-semibold text-white">
                        {lessonName || "Lesson Content Creator"}
                    </h1>
                    <p className="text-xs text-green-400/70">
                        {drafts.length} element{drafts.length !== 1 && "s"} ·{" "}
                        {validCount} valid
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={clearAll}
                        disabled={drafts.length === 0}
                        className="px-3 py-1.5 text-sm rounded-md border border-green-800 text-green-300 hover:bg-green-900/30 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Clear
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={drafts.length === 0 || validCount === 0}
                        className="px-3 py-1.5 text-sm rounded-md bg-green-700 text-white hover:bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Save Lesson
                    </button>
                </div>
            </header>

            <div className="flex-1 flex flex-col lg:flex-row min-h-0 bg-black/60">
                {/* ── Sidebar: Add element palette ── */}
                <aside className="lg:w-56 shrink-0 border-b lg:border-b-0 lg:border-r border-green-900/50 bg-zinc-950 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-green-400/70 mb-2">
                        Add Element
                    </p>
                    <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 ">
                        {ELEMENT_TYPES.map((et) => (
                            <button
                                key={et.type}
                                onClick={() => addElement(et.type)}
                                className="flex items-center gap-2 px-3 py-2 rounded-md border border-green-900/50 hover:border-green-500 hover:bg-green-900/30 text-sm text-green-200 transition-colors"
                            >
                                <span className="w-7 h-7 flex items-center justify-center rounded bg-green-900/40 text-green-300 text-xs font-mono">
                                    {et.icon}
                                </span>
                                <span>{et.label}</span>
                            </button>
                        ))}
                    </div>
                </aside>

                {/* ── Main: Element list ── */}
                <main className="flex-1 overflow-y-auto p-3 sm:p-5 ">
                    {drafts.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-center">
                            <div className="max-w-sm">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-900/30 flex items-center justify-center text-3xl">
                                    📝
                                </div>
                                <h2 className="text-green-200 font-medium mb-1">
                                    No content yet
                                </h2>
                                <p className="text-sm text-green-400/60">
                                    Pick an element type from the sidebar to
                                    start building your lesson.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <ul className="flex flex-col gap-3">
                            {drafts.map((d, i) => (
                                <li
                                    key={d.id}
                                    onDragEnter={handleDragEnter(d.id)}
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop(d.id)}
                                    className={`rounded-lg transition-all ${
                                        dragOverId === d.id && draggedId !== d.id
                                            ? "ring-2 ring-green-500 ring-offset-2 ring-offset-black"
                                            : ""
                                    } ${draggedId === d.id ? "opacity-40" : ""}`}
                                >
                                    <ElementCard
                                        draft={d}
                                        position={i + 1}
                                        isEditing={editingId === d.id}
                                        isValid={isDraftValid(d)}
                                        onToggleEdit={() =>
                                            setEditingId(
                                                editingId === d.id ? null : d.id
                                            )
                                        }
                                        onChange={(patch) =>
                                            updateElement(d.id, patch)
                                        }
                                        onRemove={() => removeElement(d.id)}
                                        onDuplicate={() =>
                                            duplicateElement(d.id)
                                        }
                                        onDragStart={handleDragStart(d.id)}
                                        onDragEnd={handleDragEnd}
                                    />
                                </li>
                            ))}
                        </ul>
                    )}
                </main>
            </div>
        </div>
    );
}

// ─── Element Card ─────────────────────────────────────────────────────────────

interface ElementCardProps {
    draft: DraftElement;
    position: number;
    isEditing: boolean;
    isValid: boolean;
    onToggleEdit: () => void;
    onChange: (patch: Partial<DraftElement>) => void;
    onRemove: () => void;
    onDuplicate: () => void;
    onDragStart: (e: React.DragEvent) => void;
    onDragEnd: () => void;
}

function ElementCard({
    draft,
    position,
    isEditing,
    isValid,
    onToggleEdit,
    onChange,
    onRemove,
    onDuplicate,
    onDragStart,
    onDragEnd,
}: ElementCardProps) {
    const typeMeta = ELEMENT_TYPES.find((t) => t.type === draft.type)!;

    return (
        <div
            className={`rounded-lg border bg-black/40 shadow-sm transition-colors ${
                isValid ? "border-green-900/50" : "border-gray-500"
            }`}
        >
            {/* Card header */}
            <div className="flex items-center gap-2 px-3 py-2 border-b border-green-900/30">
                {/* Drag handle — only this element initiates dragging */}
                <span
                    draggable
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    title="Drag to reorder"
                    className="w-6 h-7 flex items-center justify-center rounded text-green-500/60 hover:text-green-300 hover:bg-green-900/30 cursor-grab active:cursor-grabbing shrink-0 select-none"
                >
                    ⠿
                </span>

                <span className="w-7 h-7 flex items-center justify-center rounded bg-green-900/40 text-green-300 text-xs font-mono shrink-0">
                    {typeMeta.icon}
                </span>
                <span className="text-sm font-medium text-green-200 capitalize">
                    {typeMeta.label}
                </span>
                <span className="text-xs text-green-500/50">#{position}</span>
                {!isValid && (
                    <span className="text-xs text-gray-400 bg-gray-800/50 px-1.5 py-0.5 rounded">
                        incomplete
                    </span>
                )}

                <div className="ml-auto flex items-center gap-1">
                    <IconButton title="Duplicate" onClick={onDuplicate}>
                        ⧉
                    </IconButton>
                    <IconButton title="Delete" danger onClick={onRemove}>
                        ✕
                    </IconButton>
                    <button
                        onClick={onToggleEdit}
                        className="ml-1 px-2 py-1 text-xs rounded border border-green-800 hover:bg-green-900/30 text-green-300"
                    >
                        {isEditing ? "Done" : "Edit"}
                    </button>
                </div>
            </div>

            {/* Card body */}
            <div className="p-3">
                {isEditing ? (
                    <ElementEditor draft={draft} onChange={onChange} />
                ) : (
                    <ElementPreview draft={draft} />
                )}
            </div>
        </div>
    );
}

// ─── Element Editor ───────────────────────────────────────────────────────────

function ElementEditor({
    draft,
    onChange,
}: {
    draft: DraftElement;
    onChange: (patch: Partial<DraftElement>) => void;
}) {
    switch (draft.type) {
        case "heading":
            return (
                <Field label="Heading text">
                    <input
                        autoFocus
                        value={draft.heading ?? ""}
                        onChange={(e) => onChange({ heading: e.target.value })}
                        placeholder="e.g. For Loops in Python"
                        className={inputClass}
                    />
                </Field>
            );
        case "subheading":
            return (
                <Field label="Subheading text">
                    <input
                        autoFocus
                        value={draft.subheading ?? ""}
                        onChange={(e) =>
                            onChange({ subheading: e.target.value })
                        }
                        placeholder="e.g. Basic Syntax"
                        className={inputClass}
                    />
                </Field>
            );
        case "text":
            return (
                <Field label="Paragraph text">
                    <textarea
                        autoFocus
                        rows={4}
                        value={draft.text ?? ""}
                        onChange={(e) => onChange({ text: e.target.value })}
                        placeholder="Write your paragraph here…"
                        className={`${inputClass} resize-y`}
                    />
                </Field>
            );
        case "image":
            return (
                <Field label="Image URL">
                    <input
                        autoFocus
                        value={draft.imageUrl ?? ""}
                        onChange={(e) => onChange({ imageUrl: e.target.value })}
                        placeholder="https://…"
                        className={inputClass}
                    />
                    {draft.imageUrl && (
                        <img
                            src={draft.imageUrl}
                            alt="preview"
                            className="mt-2 max-h-40 rounded border border-green-900/50 object-contain"
                        />
                    )}
                </Field>
            );
        case "video":
            return (
                <Field label="Video URL (YouTube, etc.)">
                    <input
                        autoFocus
                        value={draft.videoUrl ?? ""}
                        onChange={(e) => onChange({ videoUrl: e.target.value })}
                        placeholder="https://www.youtube.com/watch?v=…"
                        className={inputClass}
                    />
                </Field>
            );
        case "codebox":
            return (
                <div className="flex flex-col gap-3">
                    <Field label="Code (input)">
                        <textarea
                            autoFocus
                            rows={6}
                            value={draft.input ?? ""}
                            onChange={(e) => onChange({ input: e.target.value })}
                            placeholder={'for i in range(5):\n    print(i)'}
                            className={`${inputClass} font-mono text-sm resize-y`}
                        />
                    </Field>
                    <Field label="Expected output">
                        <textarea
                            rows={3}
                            value={draft.output ?? ""}
                            onChange={(e) =>
                                onChange({ output: e.target.value })
                            }
                            placeholder="Press run"
                            className={`${inputClass} font-mono text-sm resize-y`}
                        />
                    </Field>
                </div>
            );
        default:
            return null;
    }
}

// ─── Element Preview ──────────────────────────────────────────────────────────

function ElementPreview({ draft }: { draft: DraftElement }) {
    switch (draft.type) {
        case "heading":
            return (
                <h2 className="text-2xl font-bold text-white truncate">
                    {draft.heading || (
                        <span className="text-green-500/50 italic">
                            Untitled heading
                        </span>
                    )}
                </h2>
            );
        case "subheading":
            return (
                <h3 className="text-lg font-semibold text-green-200 truncate">
                    {draft.subheading || (
                        <span className="text-green-500/50 italic">
                            Untitled subheading
                        </span>
                    )}
                </h3>
            );
        case "text":
            return (
                <p className="text-green-100/80 whitespace-pre-wrap line-clamp-3">
                    {draft.text || (
                        <span className="text-green-500/50 italic">
                            No text yet
                        </span>
                    )}
                </p>
            );
        case "image":
            return draft.imageUrl ? (
                <img
                    src={draft.imageUrl}
                    alt="preview"
                    className="max-h-40 rounded border border-green-900/50 object-contain"
                />
            ) : (
                <span className="text-green-500/50 italic">No image URL</span>
            );
        case "video":
            return draft.videoUrl ? (
                <span className="text-sm text-green-400 break-all">
                    {draft.videoUrl}
                </span>
            ) : (
                <span className="text-green-500/50 italic">No video URL</span>
            );
        case "codebox":
            return (
                <pre className="text-xs bg-black/80 text-green-300 rounded p-3 overflow-x-auto max-h-40 border border-green-900/30">
                    <code>{draft.input || "// empty code"}</code>
                </pre>
            );
        default:
            return null;
    }
}

// ─── Small UI helpers ─────────────────────────────────────────────────────────

const inputClass =
    "w-full rounded-md border border-green-900/60 bg-black/60 px-3 py-2 text-sm text-green-100 placeholder-green-600/50 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-900/50";

function Field({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <label className="block">
            <span className="block text-xs font-medium text-green-400/70 mb-1">
                {label}
            </span>
            {children}
        </label>
    );
}

function IconButton({
    children,
    title,
    onClick,
    disabled,
    danger,
}: {
    children: React.ReactNode;
    title: string;
    onClick: () => void;
    disabled?: boolean;
    danger?: boolean;
}) {
    return (
        <button
            title={title}
            onClick={onClick}
            disabled={disabled}
            className={`w-7 h-7 flex items-center justify-center rounded text-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                danger
                    ? "text-red-400 hover:bg-red-900/30"
                    : "text-green-400/70 hover:bg-green-900/30"
            }`}
        >
            {children}
        </button>
    );
}

// ─── Draft -> LessonElement conversion ────────────────────────────────────────

function toLessonElements(drafts: DraftElement[]): LessonElement[] {
    const result: LessonElement[] = [];
    let index = 1;

    for (const d of drafts) {
        // Skip invalid entries so parent always gets clean data
        switch (d.type) {
            case "heading":
                if (!d.heading?.trim()) break;
                result.push({ index: index++, type: "heading", heading: d.heading });
                break;
            case "subheading":
                if (!d.subheading?.trim()) break;
                result.push({
                    index: index++,
                    type: "subheading",
                    subheading: d.subheading,
                });
                break;
            case "text":
                if (!d.text?.trim()) break;
                result.push({ index: index++, type: "text", text: d.text });
                break;
            case "image":
                if (!d.imageUrl?.trim()) break;
                result.push({
                    index: index++,
                    type: "image",
                    imageUrl: d.imageUrl,
                });
                break;
            case "video":
                if (!d.videoUrl?.trim()) break;
                result.push({
                    index: index++,
                    type: "video",
                    videoUrl: d.videoUrl,
                });
                break;
            case "codebox":
                if (!d.input?.trim()) break;
                result.push({
                    index: index++,
                    type: "codebox",
                    input: d.input,
                    output: d.output ?? "Press run",
                });
                break;
        }
    }

    return result;
}