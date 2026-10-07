"use client";
import { useAsk } from "./AskContext";
export function ContextAsk({question = "Why was this project built this way?"}:{question?:string}) {
 const {openAsk}=useAsk();
 return <button type="button" onClick={()=>openAsk(question)} className="my-8 rounded-full border border-accent-clay/40 px-6 py-3 text-sm text-ink hover:bg-butter">Ask about this decision ↗</button>;
}
