import test from 'node:test';
import assert from 'node:assert/strict';
import { approvalReducer as reduce, initialState, scenarios } from '../lib/approval-simulation';
test('approval never implies verification',()=>{
 const state=reduce(initialState,{type:'select',id:'failed-check'});
 assert.deepEqual(reduce(state,{type:'approve'}).receipt,{outcome:'applied',verification:'failed',check:state.scenario.check});
});
test('stale baselines and protected paths refuse even approved proposals',()=>{
 for(const id of ['stale','protected']){
 const result=reduce(reduce(initialState,{type:'select',id}),{type:'approve'});
 assert.equal(result.receipt?.outcome,'refused'); assert.equal(result.receipt?.verification,'not-run');
 }
});
test('rejection, reset, scenario changes and repeated decisions preserve boundaries',()=>{
 for(const scenario of scenarios){
 const state=reduce(initialState,{type:'select',id:scenario.id});
 const rejected=reduce(state,{type:'reject'});
 assert.equal(rejected.receipt?.outcome,'rejected');assert.equal(rejected.receipt?.verification,'not-run');
 assert.equal(reduce(rejected,{type:'approve'}),rejected);
 assert.equal(reduce(rejected,{type:'reset'}).receipt,null);
 assert.equal(reduce(rejected,{type:'select',id:'clean'}).receipt,null);
 }
 assert.equal(reduce(initialState,{type:'approve'}).receipt?.verification,'passed');
});
