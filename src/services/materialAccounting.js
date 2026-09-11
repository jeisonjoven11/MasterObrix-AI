export function getMaterialSourceExpenses(expenses, materialId, currency) {
  if (!Array.isArray(expenses) || !materialId) return [];
  return expenses.filter((expense) => {
    if (expense?.source !== 'project-materials' || expense?.sourceMaterialId !== materialId) return false;
    return !currency || !expense.currency || expense.currency === currency;
  });
}

export function getRegisteredMaterialQuantity(expenses, material, materialId = material?.id) {
  const currency = material?.currency;
  return getMaterialSourceExpenses(expenses, materialId, currency).reduce((total, expense) => {
    const explicit = Number(expense?.sourceQuantity);
    if (Number.isFinite(explicit) && explicit > 0) return total + explicit;

    const amount = Number(expense?.amount);
    const historicalPrice = Number(expense?.sourceUnitPrice);
    if (Number.isFinite(amount) && amount > 0 && historicalPrice > 0) return total + amount / historicalPrice;

    const currentPrice = Number(material?.price);
    if (Number.isFinite(amount) && amount > 0 && currentPrice > 0) return total + amount / currentPrice;

    return total;
  }, 0);
}

export function getMaterialRegistrationState(material, expenses) {
  const purchased = Math.max(0, Number(material?.purchased) || 0);
  const registered = Math.max(0, getRegisteredMaterialQuantity(expenses, material));
  return {
    purchased,
    registered,
    delta: purchased - registered,
    needsReview: registered > purchased,
  };
}

export function getUnregisteredMaterialCost(material, expenses) {
  const { delta } = getMaterialRegistrationState(material, expenses);
  const price = Math.max(0, Number(material?.price) || 0);
  return Math.max(0, delta) * price;
}
