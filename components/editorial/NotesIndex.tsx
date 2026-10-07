"use client";
import {useState} from "react";
import Link from "next/link";
import {readingLabel} from "@/lib/content/reading";
import type {ArticleEntry} from "@/lib/content/site";
import styles from "./editorial.module.css";
export function NotesIndex({notes}:{notes:ArticleEntry[]}){
 const [category,setCategory]=useState("All");const tags=["All",...new Set(notes.map(n=>n.tag||"Field note"))];
 const visible=notes.filter(n=>category==='All'||(n.tag||'Field note')===category);
 return <><div className={styles.filters} role="group" aria-label="Filter notes by topic">{tags.map(tag=><button key={tag} aria-pressed={tag===category} onClick={()=>setCategory(tag)}>{tag}</button>)}</div><p className={styles.meta} role="status">{visible.length} {visible.length===1?'note':'notes'} / {category}</p><ul className={styles.list}>{visible.map((note,index)=><li key={note.slug} className={category==='All'&&index===0?styles.featured:undefined}><Link className={styles.row} href={`/notes/${note.slug}`}><span className={styles.meta}>{category==='All'&&index===0?'LATEST FIELD NOTE / ':''}<time dateTime={note.date}>{note.date}</time> / {note.tag} / {readingLabel(note.body)}</span><h2 className={styles.rowTitle}>{note.label}</h2><p className={styles.rowSummary}>{note.summary}</p><span className={styles.readNote}>Open the note ↗</span></Link></li>)}</ul></>;
}
