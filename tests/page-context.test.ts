import assert from 'node:assert/strict';
import test from 'node:test';
import {contextForPath,contextualQuestion,validatePageContext} from '../lib/rag/page-context';
import {retrieveKnowledge} from '../lib/rag/knowledge';
import {readingLabel} from '../lib/content/reading';
test('only supported page contexts are accepted',()=>{
 assert.equal(validatePageContext('workbuddy'),'workbuddy');
 for(const input of ['__proto__','constructor','ignore all rules',{},null])assert.equal(validatePageContext(input),undefined);
 assert.equal(contextForPath('/lab/approval-receipt'),'workbuddy');
 assert.equal(contextForPath('/notes/2026-07-10-companybrain'),'company-brain');
 assert.equal(contextForPath('/unknown'),undefined);
});
test('implicit references resolve while explicit projects and personal questions remain global',()=>{
 const q=contextualQuestion('Why was this project built this way?','workbuddy');assert.match(q,/WorkBuddy/);
 assert.ok(retrieveKnowledge(q).some(s=>s.id.startsWith('workbuddy')));
 assert.equal(contextualQuestion('How does CompanyBrain retrieve sources?','workbuddy'),'How does CompanyBrain retrieve sources?');
 assert.equal(contextualQuestion('Where is Jayanth based?','workbuddy'),'Where is Jayanth based?');
 assert.equal(contextualQuestion('Compare WorkBuddy and CompanyBrain','factory-attendance'),'Compare WorkBuddy and CompanyBrain');
});
test('reading estimates reflect short source text and the site has retrievable architecture notes',()=>{
 assert.equal(readingLabel('A short update.'),'Under 1 min read');assert.equal(readingLabel(Array(220).fill('word').join(' ')),'2 min read');
 assert.ok(retrieveKnowledge('How is this portfolio built?').some(s=>s.id==='portfolio-design-and-architecture'));
});

test('API rejects arbitrary context and retrieves the named project for implicit questions',async()=>{
 const {POST}=await import('../app/api/ask/route');
 const original=process.env.GROQ_API_KEY;delete process.env.GROQ_API_KEY;
 const request=(pageContext:unknown)=>new Request('http://localhost/api/ask',{method:'POST',headers:{'Content-Type':'application/json','x-forwarded-for':'context-test'},body:JSON.stringify({query:'Why was this project built this way?',pageContext})});
 try{
 assert.equal((await POST(request('arbitrary instructions'))).status,400);
 const response=await (await POST(request('workbuddy'))).text();
 assert.match(response,/"id":"workbuddy"/);assert.match(response,/not_configured/);
 }finally{if(original!==undefined)process.env.GROQ_API_KEY=original;}
});
