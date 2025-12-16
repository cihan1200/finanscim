export const calculateTotalExpenses = (expenses) => {
  return expenses.reduce(
    (sum, exp) => sum + (parseInt(exp.value) || 0),
    0
  );
};

export const isExpenseListValid = (expenses) => {
  return expenses.every(exp => exp.value !== "");
};

export const hasExpenseChanged = (current, initial) => {
  if (!initial) return false;
  if (current.length !== initial.length) return true;

  return current.some((exp, index) => {
    return (
      exp.name !== initial[index].name ||
      String(exp.value) !== String(initial[index].value)
    );
  });
};
