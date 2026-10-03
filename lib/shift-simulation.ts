export const shiftEvents = [
 { id:'in', time:'21:58 · day 1', title:'Operator A arrives', kind:'punch', key:'A-in', direction:'in' },
 { id:'duplicate', time:'21:58 · day 1', title:'The same punch arrives twice', kind:'punch', key:'A-in', direction:'in' },
 { id:'ambiguous', time:'22:01 · day 1', title:'An uncertain match needs a person', kind:'ambiguous', key:'B-in', direction:'in' },
 { id:'offline', time:'06:00 · day 2', title:'The capture device goes offline', kind:'offline', key:'', direction:'out' },
 { id:'out', time:'06:04 · day 2', title:'Operator A checks out while offline', kind:'punch', key:'A-out', direction:'out' },
 { id:'online', time:'06:05 · day 2', title:'Connection restored; buffered punch replays', kind:'online', key:'', direction:'out' },
] as const;
export type ShiftState = { cursor:number; online:boolean; records:string[]; buffered:string[]; exception:'none'|'pending'|'accepted'|'dismissed'; history:string[] };
export const initialShift:ShiftState={cursor:0,online:true,records:[],buffered:[],exception:'none',history:[]};
export function shiftReducer(state:ShiftState, action:{type:'next'|'reset'|'accept'|'dismiss'|'clear'}):ShiftState {
 if(action.type==='reset') return {...initialShift};
 if(action.type==='clear') return {...initialShift,cursor:shiftEvents.length,history:['Sample report cleared. Reset to replay the shift.']};
 if(action.type==='accept'||action.type==='dismiss'){
  if(state.exception!=='pending')return state;
  return {...state,exception:action.type==='accept'?'accepted':'dismissed',records:action.type==='accept'?[...state.records,'B-in']:state.records,history:[...state.history,action.type==='accept'?'Supervisor accepted B’s sample punch.':'Supervisor dismissed the uncertain punch.']};
 }
 const event=shiftEvents[state.cursor]; if(!event)return state;
 let next={...state,cursor:state.cursor+1};let result='';
 if(event.kind==='ambiguous'){next.exception='pending';result='Held for review; excluded from attendance.';}
 else if(event.kind==='offline'){next.online=false;result='Device offline; subsequent punches stay in a local buffer.';}
 else if(event.kind==='online'){next.online=true;next.records=[...new Set([...state.records,...state.buffered])];next.buffered=[];result='Connection restored. Buffered punches replayed without duplicates.';}
 else if(state.records.includes(event.key)||state.buffered.includes(event.key)){result='Duplicate event ignored; one attendance record retained.';}
 else if(!state.online){next.buffered=[...state.buffered,event.key];result='Punch buffered. Not yet included in the report.';}
 else{next.records=[...state.records,event.key];result='Punch recorded.';}
 return {...next,history:[...state.history,`${event.time}: ${result}`]};
}
