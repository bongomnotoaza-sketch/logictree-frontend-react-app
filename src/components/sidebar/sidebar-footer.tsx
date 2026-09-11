import { useState } from "react";
import { Send, Sparkles, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function SidebarFooter() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const speak = async (text: string) => {
    try {
      const res = await fetch("http://localhost:8004/speak", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);

        console.error(
          "CUBE TTS error:",
          data?.error || "Speech request failed."
        );

        return;
      }

      // Get the MP3 returned by ElevenLabs
      const audioBlob = await res.blob();

      // Create a temporary browser URL for the audio
      const audioUrl = URL.createObjectURL(audioBlob);

      const audio = new Audio(audioUrl);

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = () => {
        URL.revokeObjectURL(audioUrl);
        console.error("CUBE audio playback failed.");
      };

      await audio.play();

    } catch (error) {
      console.error("CUBE TTS error:", error);
    }
  };


  const askCube = async () => {
    if (!query.trim() || loading) return;

    const question = query.trim();

    setLoading(true);
    setOpen(true);
    setResponse("");

    try {
      // ====================================================
      // Ask CUBE
      // ====================================================

      const res = await fetch(
        "http://localhost:8004/query",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: question,
          }),
        }
      );

      const data = await res.json();


      // ====================================================
      // Handle CUBE response
      // ====================================================

      if (!data.ok) {
        const errorMessage =
          data.error ||
          "I couldn't find an answer.";

        setResponse(errorMessage);

        // Speak error response too
        await speak(errorMessage);

      } else {
        const answer =
          data.definition ||
          `I identified this as ${data.prediction}.`;

        setResponse(answer);

        // ==================================================
        // Automatically speak the answer
        // ==================================================

        await speak(answer);
      }

    } catch (error) {

      console.error(
        "CUBE error:",
        error
      );

      const errorMessage =
        "I couldn't connect to CUBE.";

      setResponse(errorMessage);

      await speak(errorMessage);

    } finally {

      setLoading(false);
    }
  };


  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      askCube();
    }
  };


  return (
    <div className="relative">

      {/* ================================================== */}
      {/* CUBE response popup */}
      {/* ================================================== */}

      {open && (
        <div className="absolute bottom-full left-3 right-3 mb-3 overflow-hidden rounded-2xl border border-zinc-800 bg-[#161616] shadow-2xl">

          {/* Popup header */}

          <div className="flex items-center justify-between border-b border-zinc-800 px-3 py-2.5">

            <div className="flex items-center gap-2">

              <Sparkles className="h-4 w-4 text-emerald-400" />

              <span className="text-xs font-medium text-white">
                CUBE
              </span>

            </div>

            <button
              onClick={() => setOpen(false)}
              className="rounded-md p-1 text-zinc-500 hover:bg-zinc-900 hover:text-white"
              aria-label="Close CUBE response"
            >
              <X className="h-3.5 w-3.5" />
            </button>

          </div>


          {/* Response */}

          <div className="max-h-48 overflow-y-auto p-3">

            <p className="text-xs leading-5 text-zinc-300">
              {loading
                ? "CUBE is thinking..."
                : response}
            </p>

          </div>

        </div>
      )}


      <Separator className="bg-zinc-800" />


      {/* ================================================== */}
      {/* CUBE input */}
      {/* ================================================== */}

      <div className="p-3">

        <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-[#161616] px-3 py-2 focus-within:border-emerald-500/50">

          <Sparkles className="h-4 w-4 shrink-0 text-emerald-400" />

          <input
            type="text"
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            onKeyDown={handleKeyDown}
            placeholder={
              loading
                ? "CUBE is thinking..."
                : "Ask CUBE..."
            }
            disabled={loading}
            className="min-w-0 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-zinc-600"
          />

          <button
            onClick={askCube}
            disabled={
              !query.trim() ||
              loading
            }
            className="shrink-0 text-zinc-500 transition hover:text-emerald-400 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Ask CUBE"
          >
            <Send className="h-4 w-4" />
          </button>

        </div>

      </div>

    </div>
  );
}