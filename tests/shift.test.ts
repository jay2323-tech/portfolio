import test from 'node:test';
import assert from 'node:assert/strict';
import {shiftReducer as reduce,initialShift} from '../lib/shift-simulation';
test('duplicates do not add records; uncertain punches need human resolution',()=>{
 let s=reduce(initialShift,{type:'next'});s=reduce(s,{type:'next'});assert.deepEqual(s.records,['A-in']);
 s=reduce(s,{type:'next'});assert.equal(s.exception,'pending');assert.equal(s.records.length,1);
 const accepted=reduce(s,{type:'accept'});assert.equal(accepted.records.length,2);assert.equal(reduce(accepted,{type:'accept'}),accepted);
 assert.equal(reduce(s,{type:'dismiss'}).records.length,1);
});
test('offline punches are withheld until replay, reset and clear remove old decisions',()=>{
 let s=initialShift;for(let i=0;i<5;i++)s=reduce(s,{type:'next'});
 assert.equal(s.online,false);assert.deepEqual(s.buffered,['A-out']);assert.deepEqual(s.records,['A-in']);
 s=reduce(s,{type:'next'});assert.equal(s.online,true);assert.deepEqual(s.buffered,[]);assert.deepEqual(s.records,['A-in','A-out']);
 assert.equal(reduce(s,{type:'next'}),s);assert.deepEqual(reduce(s,{type:'reset'}),initialShift);
 const cleared=reduce(s,{type:'clear'});assert.equal(cleared.records.length,0);assert.equal(cleared.exception,'none');assert.deepEqual(reduce(cleared,{type:'reset'}),initialShift);
});
