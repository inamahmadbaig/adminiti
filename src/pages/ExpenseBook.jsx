import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ExpenseBook = () => {
    const [expenses, setExpenses] = useState([]);
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0], category: 'Marketing', amount: '', description: ''
    });

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        const res = await axios.get('/api/expenses');
        setExpenses(res.data);
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const saveExpense = async () => {
        if (!formData.amount || !formData.description) return alert("Fill all details");
        try {
            await axios.post('/api/expenses', {
                ...formData,
                amount: parseFloat(formData.amount)
            });
            alert("Expense saved");
            setFormData({ ...formData, amount: '', description: '' });
            fetchExpenses();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <div className="card">
                <div className="card-header"><h2 className="card-title"><i className="fa-solid fa-wallet"></i> Log New Expense</h2></div>
                <div className="form-grid">
                    <div className="form-group"><label>Expense Date</label><input type="date" name="date" value={formData.date} onChange={handleChange} required /></div>
                    <div className="form-group">
                        <label>Category</label>
                        <select name="category" value={formData.category} onChange={handleChange}>
                            <option value="Marketing">Marketing (Ads/Videos)</option>
                            <option value="Transport">Transport (Fuel/Toll)</option>
                            <option value="Maintenance">Maintenance & Parts</option>
                            <option value="Utility">Utility (Electricity/Water)</option>
                            <option value="Operations">Operations</option>
                            <option value="Miscellaneous">Miscellaneous</option>
                        </select>
                    </div>
                    <div className="form-group"><label>Amount (₹)</label><input type="number" name="amount" placeholder="Amount spent..." value={formData.amount} onChange={handleChange} /></div>
                    <div className="form-group"><label>Description</label><input type="text" name="description" placeholder="E.g., Facebook Ads, Printer Parts..." value={formData.description} onChange={handleChange} /></div>
                    <div className="form-group full"><button className="btn-main" style={{ background: 'var(--danger)' }} onClick={saveExpense}><i className="fa-solid fa-plus"></i> Save Expense Record</button></div>
                </div>
            </div>
            
            <div className="card">
                <div className="card-header"><h2 className="card-title"><i className="fa-solid fa-receipt"></i> Recent Expenses</h2></div>
                <div className="table-wrapper">
                    <table style={{ width: '100%' }}>
                        <thead><tr><th>Date</th><th>Category</th><th>Description</th><th>Amount</th></tr></thead>
                        <tbody>
                            {expenses.map((exp, i) => (
                                <tr key={i}>
                                    <td>{exp.date}</td>
                                    <td>{exp.category}</td>
                                    <td>{exp.description}</td>
                                    <td style={{ fontWeight: 600, color: 'var(--danger)' }}>₹{exp.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ExpenseBook;
