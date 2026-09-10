import test from 'node:test';
import assert from 'node:assert/strict';
import { getMaterialRegistrationState, getRegisteredMaterialQuantity, getUnregisteredMaterialCost } from './materialAccounting.js';

test('counts partial material registrations using source quantities', () => {
  const material = { id: 'm1', purchased: 10, price: 100 };
  const expenses = [
    { source: 'project-materials', sourceMaterialId: 'm1', sourceQuantity: 4, sourceUnitPrice: 100, amount: 400 },
    { source: 'project-materials', sourceMaterialId: 'm1', sourceQuantity: 2, sourceUnitPrice: 110, amount: 220 },
  ];
  assert.equal(getRegisteredMaterialQuantity(expenses, material), 6);
  assert.deepEqual(getMaterialRegistrationState(material, expenses), { purchased: 10, registered: 6, delta: 4, needsReview: false });
  assert.equal(getUnregisteredMaterialCost(material, expenses), 400);
});

test('uses historical unit price for legacy material expenses', () => {
  const material = { id: 'm2', purchased: 5, price: 100 };
  const expenses = [{ source: 'project-materials', sourceMaterialId: 'm2', amount: 180, sourceUnitPrice: 90 }];
  assert.equal(getRegisteredMaterialQuantity(expenses, material), 2);
  assert.equal(getUnregisteredMaterialCost(material, expenses), 300);
});

test('flags when registered quantity exceeds current purchase quantity', () => {
  const material = { id: 'm3', purchased: 2, price: 100 };
  const expenses = [{ source: 'project-materials', sourceMaterialId: 'm3', sourceQuantity: 3, amount: 300 }];
  assert.deepEqual(getMaterialRegistrationState(material, expenses), { purchased: 2, registered: 3, delta: -1, needsReview: true });
  assert.equal(getUnregisteredMaterialCost(material, expenses), 0);
});
