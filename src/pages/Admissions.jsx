import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Admissions = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '', fName: '', aadhaar: '', mobile: '', samagra: '', caste: 'GEN', income: '',
        address: '', trade: '', admYear: new Date().getFullYear(), appNo: '', totalFee: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const submitAdmission = async () => {
        if (!formData.name) return alert("Student Name is required!");
        try {
            await axios.post('/api/students', {
                ...formData,
                name: formData.name.trim().toUpperCase(),
                totalFee: parseFloat(formData.totalFee) || 0
            });
            alert("Saved Successfully!");
            navigate('/');
        } catch (error) {
            alert(error.response?.data || "An error occurred");
        }
    };

    return (
        <div className="card">
            <div className="card-header"><h2 className="card-title"><i className="fa-solid fa-user-plus"></i> New Student Admission</h2></div>
            <div className="form-grid">
                <div className="form-group"><label>Student Name *</label><input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required /></div>
                <div className="form-group"><label>Father's Name</label><input type="text" name="fName" placeholder="Father's Name" value={formData.fName} onChange={handleChange} /></div>
                <div className="form-group"><label>Aadhaar Number</label><input type="text" name="aadhaar" placeholder="12-digit Aadhaar Number" value={formData.aadhaar} onChange={handleChange} /></div>
                <div className="form-group"><label>Mobile Number</label><input type="text" name="mobile" placeholder="10-digit Mobile Number" value={formData.mobile} onChange={handleChange} /></div>
                <div className="form-group"><label>Samagra ID</label><input type="text" name="samagra" placeholder="Samagra ID" value={formData.samagra} onChange={handleChange} /></div>
                <div className="form-group">
                    <label>Caste</label>
                    <select name="caste" value={formData.caste} onChange={handleChange}>
                        <option value="GEN">General (GEN)</option><option value="OBC">OBC</option><option value="SC">SC</option><option value="ST">ST</option>
                    </select>
                </div>
                <div className="form-group"><label>Family Income (₹)</label><input type="number" name="income" placeholder="Yearly Income" value={formData.income} onChange={handleChange} /></div>
                <div className="form-group"><label>House Number / Full Address</label><input type="text" name="address" placeholder="Enter Full Address" value={formData.address} onChange={handleChange} /></div>
                <div className="form-group"><label>Course / Trade</label><input type="text" name="trade" placeholder="E.g., Electrician, Fitter" value={formData.trade} onChange={handleChange} /></div>
                <div className="form-group"><label>Admission Year</label><input type="text" name="admYear" placeholder="E.g., 2026" value={formData.admYear} onChange={handleChange} /></div>
                <div className="form-group"><label>App / Roll Number</label><input type="text" name="appNo" placeholder="Application Number" value={formData.appNo} onChange={handleChange} /></div>
                <div className="form-group"><label>Total Course Fee (₹)</label><input type="number" name="totalFee" placeholder="Total Fees Amount" value={formData.totalFee} onChange={handleChange} /></div>
                <div className="form-group full"><button className="btn-main" onClick={submitAdmission}><i className="fa-solid fa-save"></i> Submit Admission Record</button></div>
            </div>
        </div>
    );
};

export default Admissions;
