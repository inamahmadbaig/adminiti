import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const CollectFee = () => {
    const location = useLocation();
    const preselectedStudent = location.state?.studentName || '';

    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState('');
    const [tradeFilter, setTradeFilter] = useState('All');
    const [yearFilter, setYearFilter] = useState('All');
    const [selectedStudent, setSelectedStudent] = useState(preselectedStudent);
    
    const [paymentData, setPaymentData] = useState({
        amount: '', mode: 'Cash', date: new Date().toISOString().split('T')[0], remark: ''
    });

    const [showReceipt, setShowReceipt] = useState(false);
    const [receiptData, setReceiptData] = useState(null);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        const res = await axios.get('/api/students');
        setStudents(res.data.filter(s => !s.deletedAt));
    };

    const getSelectedStudentObj = () => students.find(s => s.name === selectedStudent);

    const generateReceipt = async () => {
        if (!selectedStudent || !paymentData.amount) return alert("Select student and enter amount");
        try {
            const res = await axios.post(`/api/payments/${selectedStudent}`, {
                amount: parseFloat(paymentData.amount),
                mode: paymentData.mode,
                date: paymentData.date,
                remark: paymentData.remark
            });
            const st = getSelectedStudentObj();
            setReceiptData({ student: st, payment: res.data });
            setShowReceipt(true);
        } catch (error) {
            console.error(error);
            alert("Failed to process payment");
        }
    };

    const filteredStudents = students.filter(st => {
        if (yearFilter !== 'All' && String(st.admYear) !== yearFilter) return false;
        if (tradeFilter !== 'All' && st.trade !== tradeFilter) return false;
        if (search && !st.name.toLowerCase().includes(search.toLowerCase()) && !String(st.appNo).toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    const years = ['All', ...new Set(students.map(s => s.admYear))].filter(Boolean);
    const trades = ['All', ...new Set(students.map(s => s.trade))].filter(Boolean);
    
    const stObj = getSelectedStudentObj();
    const baseFee = stObj ? stObj.totalFee : '';

    if (showReceipt && receiptData) {
        const { student, payment } = receiptData;
        const totalPaid = (student.payments || []).reduce((sum, p) => sum + p.amount, 0) + payment.amount;
        const bal = student.totalFee - totalPaid;
        
        return (
            <div className="receipt-preview-area" style={{ display: 'flex' }}>
                <div className="receipt-action-btns no-print" style={{ width: '100%', maxWidth: '210mm', display: 'flex', gap: '10px', justifyContent: 'flex-end', marginBottom: '10px' }}>
                    <button className="btn-main" onClick={() => setShowReceipt(false)} style={{ background: 'white', color: 'var(--text-main)', border: '1px solid #ccc', width: 'auto' }}><i className="fa-solid fa-arrow-left"></i> Back</button>
                    <button className="btn-main" onClick={() => window.print()} style={{ width: 'auto' }}><i className="fa-solid fa-print"></i> Print Dual Receipt</button>
                </div>
                <div className="receipt-paper">
                    {/* Office Copy */}
                    <div className="r-half">
                        <div className="r-watermark">SUNSHINE ITI</div>
                        <h2 style={{ textAlign: 'center', margin: '0 0 5px 0' }}>SUNSHINE PRIVATE ITI</h2>
                        <p style={{ textAlign: 'center', fontSize: '12px', margin: '0 0 15px 0' }}>Office Copy - Fee Receipt</p>
                        <table style={{ width: '100%', marginBottom: '10px' }}>
                            <tbody>
                                <tr><td><strong>Receipt No:</strong> {payment.id}</td><td style={{ textAlign: 'right' }}><strong>Date:</strong> {payment.date}</td></tr>
                                <tr><td><strong>Name:</strong> {student.name}</td><td style={{ textAlign: 'right' }}><strong>App/Roll:</strong> {student.appNo}</td></tr>
                                <tr><td><strong>Course:</strong> {student.trade}</td><td style={{ textAlign: 'right' }}><strong>Mode:</strong> {payment.mode}</td></tr>
                            </tbody>
                        </table>
                        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000' }}>
                            <thead><tr><th style={{ border: '1px solid #000', padding: '5px' }}>Description</th><th style={{ border: '1px solid #000', padding: '5px', textAlign: 'right' }}>Amount</th></tr></thead>
                            <tbody>
                                <tr><td style={{ border: '1px solid #000', padding: '5px' }}>Course Fee ({payment.remark})</td><td style={{ border: '1px solid #000', padding: '5px', textAlign: 'right' }}>₹{payment.amount}</td></tr>
                            </tbody>
                        </table>
                        <p style={{ textAlign: 'right', marginTop: '10px' }}><strong>Total Balance Due:</strong> ₹{bal}</p>
                    </div>
                    <div className="cut-line">✂----------------------------- CUT HERE -----------------------------✂</div>
                    {/* Student Copy */}
                    <div className="r-half">
                        <div className="r-watermark">SUNSHINE ITI</div>
                        <h2 style={{ textAlign: 'center', margin: '0 0 5px 0' }}>SUNSHINE PRIVATE ITI</h2>
                        <p style={{ textAlign: 'center', fontSize: '12px', margin: '0 0 15px 0' }}>Student Copy - Fee Receipt</p>
                        <table style={{ width: '100%', marginBottom: '10px' }}>
                            <tbody>
                                <tr><td><strong>Receipt No:</strong> {payment.id}</td><td style={{ textAlign: 'right' }}><strong>Date:</strong> {payment.date}</td></tr>
                                <tr><td><strong>Name:</strong> {student.name}</td><td style={{ textAlign: 'right' }}><strong>App/Roll:</strong> {student.appNo}</td></tr>
                                <tr><td><strong>Course:</strong> {student.trade}</td><td style={{ textAlign: 'right' }}><strong>Mode:</strong> {payment.mode}</td></tr>
                            </tbody>
                        </table>
                        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000' }}>
                            <thead><tr><th style={{ border: '1px solid #000', padding: '5px' }}>Description</th><th style={{ border: '1px solid #000', padding: '5px', textAlign: 'right' }}>Amount</th></tr></thead>
                            <tbody>
                                <tr><td style={{ border: '1px solid #000', padding: '5px' }}>Course Fee ({payment.remark})</td><td style={{ border: '1px solid #000', padding: '5px', textAlign: 'right' }}>₹{payment.amount}</td></tr>
                            </tbody>
                        </table>
                        <p style={{ textAlign: 'right', marginTop: '10px' }}><strong>Total Balance Due:</strong> ₹{bal}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="card no-print">
            <div className="card-header"><h2 className="card-title"><i className="fa-solid fa-money-check-dollar"></i> Process New Payment</h2></div>
            <div className="form-grid">
                
                <div className="form-group full">
                    <label>Filter & Select Student</label>
                    <div style={{ display: 'flex', gap: '15px', marginBottom: '10px', flexWrap: 'wrap' }}>
                        <input type="text" placeholder="Search Name..." value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1, minWidth: '200px', padding: '10px' }} />
                        <select className="filter-dropdown" value={tradeFilter} onChange={e => setTradeFilter(e.target.value)} style={{ padding: '10px', width: 'auto' }}>
                            {trades.map(t => <option key={t} value={t}>{t === 'All' ? 'All Trades' : t}</option>)}
                        </select>
                        <select className="filter-dropdown" value={yearFilter} onChange={e => setYearFilter(e.target.value)} style={{ padding: '10px', width: 'auto' }}>
                            {years.map(y => <option key={y} value={y}>{y === 'All' ? 'All Years' : y}</option>)}
                        </select>
                    </div>
                    <select value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)}>
                        <option value="">-- Select Student --</option>
                        {filteredStudents.map(st => {
                            const bal = st.totalFee - (st.payments || []).reduce((sum, p) => sum + p.amount, 0);
                            return <option key={st.name} value={st.name}>{st.name} ({st.trade}) - Bal: ₹{bal}</option>
                        })}
                    </select>
                </div>

                <div className="form-group"><label>Course Base Fee</label><input type="number" value={baseFee} readOnly style={{ background: 'rgba(0,0,0,0.05)' }} /></div>
                
                <div className="form-group">
                    <label>
                        Amount Paying Now (₹) 
                        <span style={{ float: 'right', display: 'flex', gap: '10px', color: 'var(--primary)', fontWeight: 800, fontSize: '12px' }}>
                            <span style={{ cursor: 'pointer' }} onClick={() => setPaymentData({ ...paymentData, amount: 3000, remark: '1st Installment' })}><i className="fa-solid fa-plus"></i> 1st (3K)</span>
                            <span style={{ cursor: 'pointer' }} onClick={() => setPaymentData({ ...paymentData, amount: 4000, remark: '2nd Installment' })}><i className="fa-solid fa-plus"></i> 2nd (4K)</span>
                            <span style={{ cursor: 'pointer' }} onClick={() => setPaymentData({ ...paymentData, amount: 5000, remark: '3rd Installment' })}><i className="fa-solid fa-plus"></i> 3rd (5K)</span>
                        </span>
                    </label>
                    <input type="number" placeholder="Enter amount..." value={paymentData.amount} onChange={e => setPaymentData({ ...paymentData, amount: e.target.value })} required />
                </div>

                <div className="form-group">
                    <label>Payment Mode</label>
                    <select value={paymentData.mode} onChange={e => setPaymentData({ ...paymentData, mode: e.target.value })}>
                        <option value="Cash">Cash</option><option value="UPI">UPI (PhonePe/Paytm)</option><option value="Bank Transfer">Bank Transfer</option>
                    </select>
                </div>
                <div className="form-group"><label>Receipt Date</label><input type="date" value={paymentData.date} onChange={e => setPaymentData({ ...paymentData, date: e.target.value })} required /></div>
                <div className="form-group full"><label>Remark (Optional)</label><input type="text" placeholder="e.g., 1st Installment, Quarterly Fee..." value={paymentData.remark} onChange={e => setPaymentData({ ...paymentData, remark: e.target.value })} /></div>
                <div className="form-group full"><button className="btn-main" onClick={generateReceipt}><i className="fa-solid fa-print"></i> Generate & Save Receipt</button></div>
            </div>
        </div>
    );
};

export default CollectFee;
