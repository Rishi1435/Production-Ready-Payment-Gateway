import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Transactions() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/v1/payments', {
      headers: {
        'X-Api-Key': 'key_test_abc123',
        'X-Api-Secret': 'secret_test_xyz789'
      }
    })
      .then(res => setTransactions(res.data))
      .catch(err => console.error(err));
  }, []);

  // Modal State
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundData, setRefundData] = useState({ id: null, maxAmount: 0 });
  const [refundAmount, setRefundAmount] = useState('');

  const openRefundModal = (t) => {
    setRefundData({ id: t.id, maxAmount: t.amount });
    setRefundAmount((t.amount / 100).toFixed(2));
    setShowRefundModal(true);
  };

  const submitRefund = async () => {
    const amount = parseFloat(refundAmount) * 100;
    if (isNaN(amount) || amount <= 0 || amount > refundData.maxAmount) {
      alert("Invalid refund amount. Cannot exceed original payment.");
      return;
    }

    try {
      await axios.post(`http://localhost:8000/api/v1/payments/${refundData.id}/refunds`,
        { amount: amount, reason: "Admin initiated via Dashboard" },
        { headers: { 'X-Api-Key': 'key_test_abc123', 'X-Api-Secret': 'secret_test_xyz789' } }
      );
      alert("Refund processed successfully!");
      setShowRefundModal(false);
      // Ideally refresh transactions here, for now force reload or just close
      window.location.reload();
    } catch (err) {
      const msg = err.response?.data?.error?.description || "Refund failed";
      alert(`Error: ${msg}`);
    }
  };

  return (
    <div className="container">
      <Link to="/dashboard" style={{ color: '#635bff', textDecoration: 'none' }}>← Back to Dashboard</Link>
      <h1 style={{ marginTop: '20px' }}>Transactions</h1>

      {/* Refund Modal Overlay */}
      {showRefundModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '8px', width: '300px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
            <h3>Refund Payment</h3>
            <p style={{ marginBottom: '10px', fontSize: '14px', color: '#555' }}>
              Payment ID: <span style={{ fontFamily: 'monospace' }}>{refundData.id}</span>
            </p>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>Amount (INR)</label>
              <input
                type="number"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
              <small style={{ color: '#666' }}>Max Refundable: ₹{(refundData.maxAmount / 100).toFixed(2)}</small>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setShowRefundModal(false)}
                style={{ padding: '8px 12px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#666' }}
              >
                Cancel
              </button>
              <button
                onClick={submitRefund}
                style={{ padding: '8px 16px', background: '#d93025', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Refund
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card" style={{ padding: '0', overflowX: 'auto' }}>
        <table data-test-id="transactions-table" style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #eee', background: '#f9fafb' }}>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', color: '#666' }}>ID</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', color: '#666' }}>ORDER</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', color: '#666' }}>AMOUNT</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', color: '#666' }}>METHOD</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', color: '#666' }}>STATUS</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', color: '#666' }}>DATE</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', color: '#666' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(t => (
              <tr key={t.id} data-test-id="transaction-row" data-payment-id={t.id} style={{ borderBottom: '1px solid #eee' }}>
                <td data-test-id="payment-id" style={{ padding: '12px', fontFamily: 'monospace', fontSize: '13px', maxWidth: '100px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={t.id}>
                  {t.id}
                </td>
                <td data-test-id="order-id" style={{ padding: '12px', fontFamily: 'monospace', fontSize: '13px', maxWidth: '100px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={t.order_id}>
                  {t.order_id}
                </td>
                <td data-test-id="amount" style={{ padding: '12px', fontWeight: '500' }}>₹{(t.amount / 100).toFixed(2)}</td>
                <td data-test-id="method" style={{ padding: '12px', textTransform: 'capitalize' }}>{t.method}</td>
                <td style={{ padding: '12px' }}>
                  <span
                    data-test-id="status"
                    className={`status-badge status-${t.status}`}
                    style={{ fontSize: '11px', padding: '2px 6px' }}
                  >
                    {t.status}
                  </span>
                </td>
                <td data-test-id="created-at" style={{ padding: '12px', fontSize: '13px', color: '#555' }}>
                  {new Date(t.created_at).toLocaleDateString()}
                </td>
                <td style={{ padding: '12px' }}>
                  {(t.status === 'success' || t.status === 'partially_refunded') && (
                    <button
                      onClick={() => openRefundModal(t)}
                      style={{
                        padding: '6px 10px',
                        background: '#fff',
                        color: '#d93025',
                        border: '1px solid #d93025',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '600',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Refund
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr><td colSpan="7" style={{ padding: '20px', textAlign: 'center', color: '#888' }}>No transactions found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Transactions;