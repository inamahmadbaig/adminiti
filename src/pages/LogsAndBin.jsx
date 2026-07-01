import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LogsAndBin = () => {
    const [logs, setLogs] = useState([]);
    const [students, setStudents] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const resLogs = await axios.get('/api/logs');
        setLogs(resLogs.data);

        const resSt = await axios.get('/api/students');
        setStudents(resSt.data.filter(s => s.deletedAt));
    };

    const restoreStudent = async (name) => {
        if (window.confirm(`Restore ${name}?`)) {
            await axios.post(`/api/students/${name}/restore`);
            fetchData();
        }
    };

    return (
        <div>
            <div className="card" style={{ borderLeft: '4px solid var(--danger)' }}>
                <div className="card-header"><h2 className="card-title"><i className="fa-solid fa-trash-can-arrow-up"></i> Recycle Bin (Deleted Students)</h2></div>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '15px' }}>Students deleted will appear here. You can restore them if needed.</p>
                <div className="table-wrapper" style={{ maxHeight: '250px' }}>
                    <table>
                        <thead>
                            <tr><th>Student Name</th><th>Trade</th><th>App No</th><th>Deleted At</th><th style={{ textAlign: 'right' }}>Action</th></tr>
                        </thead>
                        <tbody>
                            {students.length === 0 ? <tr><td colSpan="5" style={{ textAlign: 'center' }}>Recycle bin is empty</td></tr> : null}
                            {students.map(st => (
                                <tr key={st.name}>
                                    <td><b>{st.name}</b></td>
                                    <td>{st.trade}</td>
                                    <td>{st.appNo || 'N/A'}</td>
                                    <td style={{ fontSize: '12px' }}>
                                        {st.deletedAt ? new Date(st.deletedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '-'}
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <button onClick={() => restoreStudent(st.name)} className="btn-icon bg-success" style={{ padding: '6px 12px', fontWeight: 'bold' }}>
                                            <i className="fa-solid fa-trash-can-arrow-up"></i> Restore
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div className="card">
                <div className="card-header"><h2 className="card-title"><i className="fa-solid fa-list"></i> System Audit Logs</h2></div>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '15px' }}>Tracking all major activities within the system.</p>
                <div className="table-wrapper" style={{ maxHeight: '400px' }}>
                    <table>
                        <thead>
                            <tr><th style={{ width: '180px' }}>Date & Time</th><th>Action Taken</th><th>Detailed Log</th></tr>
                        </thead>
                        <tbody>
                            {logs.length === 0 ? <tr><td colSpan="3" style={{ textAlign: 'center' }}>No logs available</td></tr> : null}
                            {logs.map(l => (
                                <tr key={l.id}>
                                    <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                        {new Date(l.date).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                                    </td>
                                    <td><b>{l.action}</b></td>
                                    <td style={{ fontSize: '13px' }}>{l.details}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LogsAndBin;
