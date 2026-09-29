export const genres=['Todos','Hip Hop','Trap','Reggaetón','R&B','Lo-fi','Afrobeat'];
export const producers=[{id:'luna',name:'Luna Waves',tag:'Sonidos para después de medianoche.',city:'Santiago, Chile',initials:'LW',color:'#bab6fa'},{id:'nico',name:'Nico South',tag:'Del sur para el mundo.',city:'Buenos Aires, Argentina',initials:'NS',color:'#f0a474'},{id:'milo',name:'Milo Beats',tag:'Texturas cálidas. Ritmos con alma.',city:'Medellín, Colombia',initials:'MB',color:'#b4c5a1'}];
export const demoBeats=[
 {id:'original-01',title:'Original 01',producerId:'luna',genre:'Trap',bpm:140,key:'Fa menor',price:29,art:'midnight',color:'#b8a9df',plays:18400,audioFile:'songs/wild-original-01.mp3'},
 {id:'original-02',title:'Original 02',producerId:'nico',genre:'Reggaetón',bpm:96,key:'La menor',price:35,art:'costa',color:'#eb9b60',plays:12600,audioFile:'songs/wild-original-02.mp3'},
 {id:'original-03',title:'Original 03',producerId:'luna',genre:'R&B',bpm:82,key:'Do menor',price:25,art:'blue',color:'#7cabc6',plays:9400,audioFile:'songs/wild-original-03.mp3'},
 {id:'original-04',title:'Original 04',producerId:'milo',genre:'Hip Hop',bpm:92,key:'Re menor',price:30,art:'concrete',color:'#b9c291',plays:8200,audioFile:'songs/wild-original-04.mp3'},
 {id:'original-05',title:'Original 05',producerId:'milo',genre:'Lo-fi',bpm:75,key:'Sol mayor',price:19,art:'sunday',color:'#d8b68d',plays:6900,audioFile:'songs/wild-original-05.mp3'},
 {id:'original-06',title:'Original 06',producerId:'nico',genre:'Afrobeat',bpm:108,key:'Mi menor',price:32,art:'fuego',color:'#e27d70',plays:5800,audioFile:'songs/wild-original-06.mp3'},
 {id:'original-07',title:'Original 07',producerId:'luna',genre:'Trap',bpm:132,key:'Sol menor',price:29,art:'midnight',color:'#b8a9df',plays:5400,audioFile:'songs/wild-original-07.mp3'},
 {id:'original-08',title:'Original 08',producerId:'nico',genre:'Reggaetón',bpm:98,key:'Re menor',price:35,art:'costa',color:'#eb9b60',plays:5100,audioFile:'songs/wild-original-08.mp3'},
 {id:'original-09',title:'Original 09',producerId:'milo',genre:'Hip Hop',bpm:90,key:'La menor',price:30,art:'concrete',color:'#b9c291',plays:4900,audioFile:'songs/wild-original-09.mp3'},
 {id:'original-10',title:'Original 10',producerId:'luna',genre:'R&B',bpm:84,key:'Mi menor',price:25,art:'blue',color:'#7cabc6',plays:4700,audioFile:'songs/wild-original-10.mp3'},
 {id:'original-11',title:'Original 11',producerId:'milo',genre:'Lo-fi',bpm:78,key:'Do mayor',price:19,art:'sunday',color:'#d8b68d',plays:4300,audioFile:'songs/wild-original-11.mp3'},
 {id:'original-12',title:'Original 12',producerId:'nico',genre:'Afrobeat',bpm:106,key:'Fa menor',price:32,art:'fuego',color:'#e27d70',plays:4100,audioFile:'songs/wild-original-12.mp3'},
 {id:'original-13',title:'Original 13',producerId:'luna',genre:'Trap',bpm:138,key:'Si menor',price:29,art:'midnight',color:'#b8a9df',plays:3900,audioFile:'songs/wild-original-13.mp3'},
 {id:'original-14',title:'Original 14',producerId:'nico',genre:'Reggaetón',bpm:94,key:'La menor',price:35,art:'costa',color:'#eb9b60',plays:3700,audioFile:'songs/wild-original-14.mp3'},
 {id:'original-15',title:'Original 15',producerId:'milo',genre:'Hip Hop',bpm:100,key:'Re menor',price:30,art:'concrete',color:'#b9c291',plays:3500,audioFile:'songs/wild-original-15.aac'}
];
export function filterBeats(beats,{query='',genre='Todos',sort='popular',likedOnly=false,favorites=[]}={}){const q=query.toLocaleLowerCase();return beats.filter(b=>(genre==='Todos'||b.genre===genre)&&(!likedOnly||favorites.includes(b.id))&&`${b.title} ${b.producerName||producers.find(p=>p.id===b.producerId)?.name||''} ${b.genre} ${b.bpm}`.toLocaleLowerCase().includes(q)).sort((a,b)=>sort==='price'?a.price-b.price:sort==='new'?0:(b.plays||0)-(a.plays||0));}
export function splitPayment(price){const total=Math.round(price*100);const platform=Math.round(total*.1);return {total:total/100,platform:platform/100,producer:(total-platform)/100,currency:'USD'};}
export const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
