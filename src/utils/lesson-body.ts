// utils/lesson-body.ts
import type { LessonElement } from "@/components/educator/notes/lessoncontentcreator";

const BASE = "/notes/lesson-bodies/create/";
const DEFAULT_LESSON_ID = 1;

function toPayload(el: LessonElement): { type: string; content: string } {
    switch (el.type) {
        case "heading":    return { type: "heading",    content: el.heading };
        case "subheading": return { type: "subheading", content: el.subheading };
        case "text":       return { type: "text",       content: el.text };
        case "image":      return { type: "image",      content: el.imageUrl };
        case "video":      return { type: "video",      content: el.videoUrl };
        case "codebox":
            return {
                type: "codebox",
                content: JSON.stringify({ input: el.input, output: el.output }),
            };
    }
}

function getCsrfToken(): string {
    const match = document.cookie.match(/csrftoken=([^;]+)/);
    return match ? match[1] : "";
}

export async function createLessonBody(
    el: LessonElement,
    lessonId: number = DEFAULT_LESSON_ID
) {
    const { type, content } = toPayload(el);
    const res = await fetch(BASE, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCsrfToken(),
        },
        credentials: "include",
        body: JSON.stringify({
            lessonid: lessonId,
            type,
            content,
            index: el.index,
        }),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(
            `Failed to create ${el.type} #${el.index}: ${JSON.stringify(err)}`
        );
    }
    return res.json() as Promise<{ id: number; message: string }>;
}

export async function saveLessonContent(
    elements: LessonElement[],
    lessonId: number = DEFAULT_LESSON_ID      // ← added 2nd param
) {
    const results: { id: number; message: string }[] = [];
    for (const el of elements) {
        results.push(await createLessonBody(el, lessonId));
    }
    return results;
}