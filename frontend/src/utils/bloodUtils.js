export function calculateTotalUnits(bloodBanks) {
  if (!Array.isArray(bloodBanks)) return 0;

  return bloodBanks.reduce((total, bank) => {
    const inventory = Array.isArray(bank?.inventory) ? bank.inventory : [];
    const subtotal = inventory.reduce(
      (sum, bloodGroup) => sum + (bloodGroup?.units_available || 0),
      0
    );
    return total + subtotal;
  }, 0);
}