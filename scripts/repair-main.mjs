import { readFileSync, writeFileSync } from 'node:fs';

const path = 'src/main.jsx';
const text = readFileSync(path, 'utf8');
const repaired = text.replace('</div>}}\nfunction BudgetSection', '</div>}</section>}\nfunction BudgetSection');
if (repaired !== text) writeFileSync(path, repaired, 'utf8');
console.log('MasterObrix build guard checked main.jsx');
