const assert=require('node:assert/strict');
const M=require('../动画/gear.js');
const wrap=a=>Math.atan2(Math.sin(a),Math.cos(a));
let samples=0;
for(const ha of [1,.35,M.limitHeight()])for(const delta of [0,.5,1]){
 const p=M.pair(ha,delta);
 assert(Math.abs(p.g1.rb/p.g2.rb-20/30)<1e-12);
 for(let t=0;t<3;t+=.003){
  const [a,b]=M.rotations(p,t);
  for(const q of M.contacts(p,t)){
   const r1=Math.hypot(q.x,q.y),r2=Math.hypot(q.x-p.a,q.y);
   assert(r1>=p.g1.rb-1e-8&&r1<=p.g1.ra+1e-8);
   assert(r2>=p.g2.rb-1e-8&&r2<=p.g2.ra+1e-8);
   // 接触点必须同时落在主动轮正侧渐开线与从动轮对应侧渐开线上。
   const f1=a+q.j*2*Math.PI/p.g1.z+M.half(p.g1,r1);
   const f2=b-q.j*2*Math.PI/p.g2.z+M.half(p.g2,r2);
   assert(Math.abs(wrap(Math.atan2(q.y,q.x)-f1))<1e-8);
   assert(Math.abs(wrap(Math.atan2(q.y,q.x-p.a)-f2))<1e-8);
   samples++;
  }
 }
}
const p=M.pair();let total=0,counts=new Set();const N=10000;
for(let i=0;i<N;i++){let n=M.contacts(p,(i+.5)/N).length;counts.add(n);total+=n}
assert.deepEqual([...counts].sort(),[1,2]);assert(Math.abs(total/N-p.epsilon)<1/N);
assert(Math.abs(M.pair(M.limitHeight()).epsilon-1)<1e-10);
assert(M.contacts(M.pair(.35),.8).length===0);
assert(M.pair(1,1).epsilon<M.pair().epsilon);
console.log(`通过：${samples} 个接触点同时落在两齿廓上；平均接触数、临界齿高、空档与中心距趋势正确。`);
