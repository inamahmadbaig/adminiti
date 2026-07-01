import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [search, setSearch] = useState('');
    const [tradeFilter, setTradeFilter] = useState('All');
    const [yearFilter, setYearFilter] = useState('All');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const resSt = await axios.get('/api/students');
            setStudents(resSt.data.filter(s => !s.deletedAt));
            if (user?.role === 'ROLE_ADMIN') {
                const resEx = await axios.get('/api/expenses');
                setExpenses(resEx.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const deleteStudent = async (name) => {
        if (window.confirm(`Delete ${name}?`)) {
            await axios.delete(`/api/students/${name}`);
            fetchData();
        }
    };

    // Derived State
    const years = ['All', ...new Set(students.map(s => s.admYear))].filter(Boolean);
    const trades = ['All', ...new Set(students.map(s => s.trade))].filter(Boolean);

    let tStudents = 0, tCol = 0, tPending = 0;
    const filteredStudents = students.filter(st => {
        if (yearFilter !== 'All' && String(st.admYear) !== yearFilter) return false;
        if (tradeFilter !== 'All' && st.trade !== tradeFilter) return false;
        if (search && !st.name.toLowerCase().includes(search.toLowerCase()) && !String(st.appNo).toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    filteredStudents.forEach(st => {
        const paid = (st.payments || []).reduce((sum, p) => sum + (p.amount || 0), 0);
        const bal = (st.totalFee || 0) - paid;
        tStudents++;
        tCol += paid;
        tPending += bal;
    });

    const tExp = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const tNet = tCol - tExp;

    const chartData = {
        labels: ['Collected (₹)', 'Pending (₹)'],
        datasets: [{
            data: [tCol, tPending],
            backgroundColor: ['#10b981', '#f43f5e'],
            hoverOffset: 4
        }]
    };

    return (
        <div id="view-dashboard">
            <div className="dashboard-top-section">
                <div className="stats-grid">
                    <div className="stat-box blue"><h3>Total Students</h3><h2>{tStudents}</h2></div>
                    <div className="stat-box green"><h3>Gross Collection</h3><h2>₹{tCol.toLocaleString('en-IN')}</h2></div>
                    <div className="stat-box cyan"><h3>Total Pending</h3><h2>₹{tPending.toLocaleString('en-IN')}</h2></div>
                    {user?.role === 'ROLE_ADMIN' && (
                        <>
                            <div className="stat-box orange"><h3>Total Expenses</h3><h2>₹{tExp.toLocaleString('en-IN')}</h2></div>
                            <div className="stat-box red"><h3>Net Balance (In Hand)</h3><h2>₹{tNet.toLocaleString('en-IN')}</h2></div>
                        </>
                    )}
                </div>
                <div className="chart-container">
                    <h3 style={{ margin: '0 0 5px 0', fontSize: '15px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Financial Overview</h3>
                    <div className="canvas-wrapper">
                        <Doughnut data={chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h2 className="card-title"><i className="fa-solid fa-list-check"></i> Active Students List</h2>
                    <div className="table-controls">
                        <button className="btn-main" style={{ width: 'auto', background: 'var(--info)', padding: '10px 15px' }} onClick={() => window.print()}>
                            <i className="fa-solid fa-print"></i> Print List
                        </button>
                        <div className="search-box">
                            <i className="fa-solid fa-search"></i>
                            <input type="text" placeholder="Search Name/App No..." value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                        <select className="filter-dropdown" value={tradeFilter} onChange={e => setTradeFilter(e.target.value)}>
                            {trades.map(t => <option key={t} value={t}>{t === 'All' ? 'All Trades' : t}</option>)}
                        </select>
                        <select className="filter-dropdown" value={yearFilter} onChange={e => setYearFilter(e.target.value)}>
                            {years.map(y => <option key={y} value={y}>{y === 'All' ? 'All Years' : y}</option>)}
                        </select>
                    </div>
                </div>
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Student Name</th>
                                <th>Father Name</th>
                                <th>Mobile Number</th>
                                <th>Fee Status</th>
                                <th>Paid Amt</th>
                                <th>Balance</th>
                                <th className="no-print" style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map(st => {
                                const paid = (st.payments || []).reduce((sum, p) => sum + (p.amount || 0), 0);
                                const bal = (st.totalFee || 0) - paid;
                                const badgeClass = bal <= 0 ? 'badge-success' : (paid > 0 ? 'badge-warning' : 'badge-danger');
                                const badgeText = bal <= 0 ? 'Cleared' : (paid > 0 ? 'Partial' : 'Unpaid');

                                return (
                                    <tr key={st.name}>
                                        <td><div style={{ fontWeight: 'bold' }}>{st.name}</div><div style={{ fontSize: '12px', color: 'gray' }}>{st.trade}</div></td>
                                        <td>{st.fName || '-'}</td>
                                        <td>{st.mobile || '-'}</td>
                                        <td><span className={`badge ${badgeClass}`}>{badgeText}</span></td>
                                        <td style={{ fontWeight: 600 }}>₹{paid}</td>
                                        <td style={{ color: bal > 0 ? 'var(--danger)' : 'var(--success)', fontWeight: 800 }}>₹{bal}</td>
                                        <td className="no-print" style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                                            {bal > 0 && <button className="btn-icon bg-primary" onClick={() => navigate('/fee', { state: { studentName: st.name } })}><i className="fa-solid fa-indian-rupee-sign"></i></button>}
                                            <button className="btn-icon bg-danger" onClick={() => deleteStudent(st.name)}><i className="fa-solid fa-trash"></i></button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
