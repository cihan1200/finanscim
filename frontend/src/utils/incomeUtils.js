// src/utils/incomeUtils.js

export const calculateTotalIncome = (incomes) => {
  return incomes.reduce(
    (sum, income) => sum + (parseInt(income.value) || 0),
    0
  );
};

export const isIncomeListValid = (incomes) => {
  return incomes.every(income => income.value !== "");
};

export const hasIncomeChanged = (current, initial) => {
  if (!initial) return false;
  if (current.length !== initial.length) return true;

  return current.some((inc, index) => {
    return (
      inc.name !== initial[index].name ||
      String(inc.value) !== String(initial[index].value)
    );
  });
};
