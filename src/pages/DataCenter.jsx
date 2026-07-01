import React from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { useAuth } from '../context/AuthContext';

const DataCenter = () => {
    const { logout } = useAuth();

    const clearData = async () => {
        if (window.confirm("WARNING: This will delete ALL data. Type 'CONFIRM' to proceed.") === 'CONFIRM' || window.confirm("Are you really sure?")) {
            await axios.post('/api/database/reset');
            alert("System Reset Complete!");
            logout();
        }
    };

    const downloadTemplate = () => {
        const ws = XLSX.utils.json_to_sheet([{
            name: "Rahul Kumar", fName: "Rajesh Kumar", aadhaar: "123412341234", mobile: "9988776655", samagra: "987654321",
            caste: "OBC", income: "50000", address: "Seoni", trade: "Electrician", admYear: "2026", appNo: "APP123", totalFee: 25000
        }]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Students");
        XLSX.writeFile(wb, "Student_Upload_Template.xlsx");
    };

    const uploadExcel = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (evt) => {
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, { type: 'binary' });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data = XLSX.utils.sheet_to_json(ws);

            let added = 0;
            for (let st of data) {
                if (st.name) {
                    try {
                        await axios.post('/api/students', st);
                        added++;
                    } catch (err) {
                        console.error("Failed to add", st.name, err);
                    }
                }
            }
            alert(`Successfully imported ${added} records!`);
            window.location.href = "/";
        };
        reader.readAsBinaryString(file);
    };

    return (
        <div className="card">
            <div className="card-header"><h2 className="card-title"><i className="fa-solid fa-server"></i> Database Management</h2></div>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>
                Excel Upload Instructions: Excel file must have standard columns. Click download template to see the format.
            </p>
            <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
                <button className="btn-main" onClick={downloadTemplate} style={{ background: 'var(--info)', width: 'auto' }}>
                    <i className="fa-solid fa-download"></i> Download Excel Template
                </button>
                
                <input type="file" id="excelFile" accept=".xlsx, .xls" style={{ display: 'none' }} onChange={uploadExcel} />
                <button className="btn-main" onClick={() => document.getElementById('excelFile').click()} style={{ background: 'var(--success)', width: 'auto' }}>
                    <i className="fa-solid fa-upload"></i> Upload Excel Data
                </button>
            </div>

            <hr style={{ border: 0, borderTop: '1px solid var(--border-color)', marginBottom: '20px' }} />
            <h4 style={{ color: 'var(--danger)', marginTop: 0 }}>Danger Zone</h4>
            <button className="btn-main" style={{ background: 'white', color: 'var(--danger)', border: '2px solid var(--danger)', width: 'auto' }} onClick={clearData}>
                <i className="fa-solid fa-trash"></i> Master Reset (Delete All)
            </button>
        </div>
    );
};

export default DataCenter;
