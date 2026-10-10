export const steps = ['bagger','laster','kran','kran'];
export const initial = () => ({version:1,step:0,roof:null});
export function restore(raw) { try {const s=JSON.parse(raw);return s?.version===1 && Number.isInteger(s.step) && s.step>=0 && s.step<=4 && [null,'rot','blau','gruen'].includes(s.roof) && (!s.roof || s.step===4) ? s : initial();} catch {return initial();} }
export function act(state,tool) { return state.step<4 && steps[state.step]===tool ? {...state,step:state.step+1} : state; }
export function paint(state,color) {return state.step===4 && ['rot','blau','gruen'].includes(color) ? {...state,roof:color}:state;}
