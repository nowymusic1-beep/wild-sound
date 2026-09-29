import test from 'node:test';
import assert from 'node:assert/strict';
import {filterBeats,demoBeats,splitPayment,escapeHTML} from './core.js';
test('búsqueda por productor, BPM y género con filtros combinados',()=>{assert.equal(filterBeats(demoBeats,{query:'luna'}).length,2);assert.equal(filterBeats(demoBeats,{query:'140',genre:'Trap'}).length,1);assert.equal(filterBeats(demoBeats,{query:'140',genre:'R&B'}).length,0);});
test('favoritos y orden por precio',()=>{assert.deepEqual(filterBeats(demoBeats,{likedOnly:true,favorites:['b3','b1'],sort:'price'}).map(b=>b.id),['b3','b1']);});
test('el reparto 90/10 conserva el total en centavos',()=>{for(const price of [29,35,19.99,1.05,10000]){const s=splitPayment(price);assert.equal(Math.round((s.platform+s.producer)*100),Math.round(price*100));assert.equal(s.platform,Math.round(price*10)/100);}});
test('los datos de catálogo se escapan como texto',()=>{assert.equal(escapeHTML('<img onerror="alert(1)">'), '&lt;img onerror=&quot;alert(1)&quot;&gt;');});
