import "../../styles/Dashboard/ExpenseTracker.css";
import { useState, useEffect, useCallback, useMemo } from "react";
import LoadingSpinner from "../Layouts/LoadingSpinner";
import ExpenseConfirmDelete from "../Popups/ExpenseConfirmDelete";
import ExpenseSaveSuccess from "../Popups/ExpenseSaveSuccess";
import {
  fetchExpenses,
  saveExpenses,
  deleteExpense,
} from "../../services/expenseService";
import {
  calculateTotalExpenses,
  isExpenseListValid,
  hasExpenseChanged,
} from "../../utils/expenseUtils";

const isMongoId = (id) => /^[a-f\d]{24}$/i.test(id);

export default function ExpenseTracker({ onTotalChange }) {
  const [expenses, setExpenses] = useState([]);
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  useEffect(() => {
    let isMounted = true;
    fetchExpenses(token)
      .then(res => {
        if (!isMounted) return;
        const loaded = res.data.map(exp => ({
          id: exp._id,
          name: exp.name,
          value: exp.value,
        }));
        setExpenses(loaded);
        setInitialData(loaded);
        setLoading(false);
      })
      .catch(err => {
        console.error("Load error:", err);
        setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [token]);

  const totalExpenses = useMemo(
    () => calculateTotalExpenses(expenses),
    [expenses]
  );

  const isEmpty = useMemo(
    () => expenses.length === 0,
    [expenses]
  );

  const allDeletedButUnsaved = useMemo(() => {
    return expenses.length === 0 && initialData?.length > 0;
  }, [expenses, initialData]);

  const canSave = useMemo(() => {
    return (
      hasExpenseChanged(expenses, initialData) &&
      isExpenseListValid(expenses)
    );
  }, [expenses, initialData]);

  useEffect(() => {
    onTotalChange(totalExpenses);
  }, [totalExpenses, onTotalChange]);

  const handleSave = useCallback(async () => {
    if (saving) return;
    setSaving(true);
    try {
      await saveExpenses(token, expenses);
      setInitialData(expenses);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2500);
    } catch (error) {
      console.error("Save error:", error);
      alert("Hata oluştu.");
    } finally {
      setSaving(false);
    }
  }, [expenses, token, saving]);

  const handleAddExpense = () => {
    setExpenses(prev => [
      ...prev,
      { id: crypto.randomUUID(), name: "Gider", value: "" },
    ]);
  };

  const handleExpenseChange = (id, field, value) => {
    setExpenses(prev =>
      prev.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    );
  };

  const initiateRemove = (id) => {
    setItemToDelete(id);
  };

  const confirmRemove = async () => {
    if (!itemToDelete) return;

    const id = itemToDelete;
    setItemToDelete(null);

    if (!isMongoId(id)) {
      setExpenses(prev => prev.filter(exp => exp.id !== id));
      return;
    }

    try {
      await deleteExpense(token, id);
      setExpenses(prev => prev.filter(exp => exp.id !== id));
    } catch (error) {
      console.error(
        "Delete error:",
        error.response?.data || error.message
      );
    }
  };

  const cancelRemove = () => {
    setItemToDelete(null);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="expense-tracker-container">
      {showSuccess && <ExpenseSaveSuccess />}
      {itemToDelete && (
        <ExpenseConfirmDelete
          confirm={confirmRemove}
          cancel={cancelRemove}
        />
      )}
      <div className="expense-tracker-title">Gider Takibi</div>
      {isEmpty ? (
        <div className="expense-empty-state">
          <p>Henüz girilmiş bir gideriniz yok.</p>
          <div className="empty-state-buttons">
            <button
              className="add-first-expense-button"
              onClick={handleAddExpense}
            >
              <span>+</span> Gider Ekle
            </button>
            {allDeletedButUnsaved && (
              <button
                className={`save-expense-button ${saving ? "disabled" : ""}`}
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Kaydediliyor..." : "Silinenleri Kaydet"}
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          {expenses.map(exp => (
            <div key={exp.id} className="expense-additional-group">
              <div className="expense-input-wrapper">
                <div className="expense-input-name">
                  <label>GİDER ADI</label>
                  <input
                    value={exp.name}
                    onChange={e =>
                      handleExpenseChange(exp.id, "name", e.target.value)
                    }
                  />
                </div>
                <div className="expense-input-value">
                  <label>MİKTAR (₺)</label>
                  <input
                    type="number"
                    value={exp.value}
                    onChange={e =>
                      handleExpenseChange(exp.id, "value", e.target.value)
                    }
                  />
                </div>
              </div>
              <button
                className="remove-expense-button"
                onClick={() => initiateRemove(exp.id)}
              >
                &times;
              </button>
            </div>
          ))}
          <div className="expense-tracker-buttons">
            <button className="add-expense-button" onClick={handleAddExpense}>
              <span>+</span> Ek Gider Ekle
            </button>
            <button
              className={`save-expense-button ${!canSave || saving ? "disabled" : ""
                }`}
              onClick={handleSave}
              disabled={!canSave || saving}
            >
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </>
      )}
      <div className="total-expenses">
        <span>Toplam Aylık Gider</span>
        <strong>₺{totalExpenses.toLocaleString("tr-TR")}</strong>
      </div>
    </div>
  );
}
