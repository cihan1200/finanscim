import "../../styles/Dashboard/IncomeTracker.css";
import { useState, useEffect, useCallback, useMemo } from "react";
import IncomeSaveSuccess from "../Popups/IncomeSaveSuccess";
import IncomeConfirmDelete from "../Popups/IncomeConfirmDelete";
import LoadingSpinner from "../Layouts/LoadingSpinner";

import {
  fetchIncomes,
  saveIncomes,
  deleteIncome,
} from "../../services/incomeService";

import {
  calculateTotalIncome,
  isIncomeListValid,
  hasIncomeChanged,
} from "../../utils/incomeUtils";

const isMongoId = (id) => /^[a-f\d]{24}$/i.test(id);

export default function IncomeTracker({ onTotalChange }) {
  const [incomes, setIncomes] = useState([]);
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  useEffect(() => {
    let isMounted = true;
    fetchIncomes(token)
      .then(res => {
        if (!isMounted) return;
        const loaded = res.data.map(i => ({
          id: i._id,
          name: i.name,
          value: i.value,
        }));
        setIncomes(loaded);
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

  const totalIncome = useMemo(
    () => calculateTotalIncome(incomes),
    [incomes]
  );

  const isEmpty = useMemo(
    () => incomes.length === 0,
    [incomes]
  );

  const allDeletedButUnsaved = useMemo(() => {
    return incomes.length === 0 && initialData?.length > 0;
  }, [incomes, initialData]);

  const canSave = useMemo(() => {
    return (
      hasIncomeChanged(incomes, initialData) &&
      isIncomeListValid(incomes)
    );
  }, [incomes, initialData]);

  useEffect(() => {
    onTotalChange(totalIncome);
  }, [totalIncome, onTotalChange]);

  const handleSave = useCallback(async () => {
    if (saving) return;
    setSaving(true);
    try {
      await saveIncomes(token, incomes);
      setInitialData(incomes);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2500);
    } catch (error) {
      console.error("Save error:", error);
      alert("Kaydederken bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  }, [incomes, token, saving]);

  const handleAddIncome = () => {
    setIncomes(prev => [
      ...prev,
      { id: crypto.randomUUID(), name: "Ek Gelir", value: "" },
    ]);
  };

  const handleIncomeChange = (id, field, value) => {
    setIncomes(prev =>
      prev.map(income =>
        income.id === id ? { ...income, [field]: value } : income
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
      setIncomes(prev => prev.filter(income => income.id !== id));
      return;
    }
    try {
      await deleteIncome(token, id);
      setIncomes(prev => prev.filter(income => income.id !== id));
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
    <div className="income-tracker-container">
      {showSuccess && <IncomeSaveSuccess />}
      {itemToDelete && (
        <IncomeConfirmDelete
          confirm={confirmRemove}
          cancel={cancelRemove}
        />
      )}
      <div className="income-tracker-title">Gelir Takibi</div>
      {isEmpty ? (
        <div className="income-empty-state">
          <p>Henüz girilmiş bir geliriniz yok.</p>

          <div className="empty-state-buttons">
            <button
              className="add-first-income-button"
              onClick={handleAddIncome}
            >
              <span>+</span> Gelir Ekle
            </button>
            {allDeletedButUnsaved && (
              <button
                className={`save-income-button ${saving ? "disabled" : ""}`}
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
          {incomes.map(income => (
            <div key={income.id} className="income-additional-group">
              <div className="income-input-wrapper">
                <div className="income-input-name">
                  <label>GELİR ADI</label>
                  <input
                    value={income.name}
                    onChange={e =>
                      handleIncomeChange(income.id, "name", e.target.value)
                    }
                  />
                </div>
                <div className="income-input-value">
                  <label>MİKTAR (₺)</label>
                  <input
                    type="number"
                    value={income.value}
                    onChange={e =>
                      handleIncomeChange(income.id, "value", e.target.value)
                    }
                  />
                </div>
              </div>
              <button
                className="remove-income-button"
                onClick={() => initiateRemove(income.id)}
              >
                &times;
              </button>
            </div>
          ))}
          <div className="income-tracker-buttons">
            <button
              className="add-income-button"
              onClick={handleAddIncome}
            >
              <span>+</span> Ek Gelir Ekle
            </button>

            <button
              className={`save-income-button ${!canSave || saving ? "disabled" : ""
                }`}
              onClick={handleSave}
              disabled={!canSave || saving}
            >
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </>
      )}
      <div className="total-income">
        <span>Toplam Aylık Gelir</span>
        <strong>₺{totalIncome.toLocaleString("tr-TR")}</strong>
      </div>
    </div>
  );
}
