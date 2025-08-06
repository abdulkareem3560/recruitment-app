import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { primaryColor } from '../theme';
import ExistingRecordUpdateForm from "./ExistingRecordUpdateForm.jsx";

const DUMMIES = ['dummy1', 'dummy2', 'dummy3'];
const YESNO = ['Yes', 'No'];
const SCREENING = ['Shortlisted', 'Rejected', 'Yet to screen'];
const HACKER = [...SCREENING, 'N/A'];
const YEARS = Array.from({ length: 30 }, (_, i) => (i + 1).toString());
const MONTHS = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
const EDU = ['B.Tech', 'M.Tech', 'MCA', 'BCA', 'Other'];
const YEARS_PASS = Array.from({ length: 30 }, (_, i) => (2025 - i).toString());
const LOCS = DUMMIES;

// Helpers
const getMonthShort = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleString('default', { month: 'short' });
};
const getWeekOfMonth = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const week = Math.ceil((date.getDate() + 1 - date.getDay()) / 7) + 1;
  const ord = (n) => `${n}${['st', 'nd', 'rd'][((n + 90) % 100 - 10) % 10 - 1] || 'th'}`;
  return ord(week);
};

// Input component outside to avoid recreation
const InputGroup = ({ name, label, type = 'text', formik, loading, ...rest }) => (
  <div style={fieldGroupStyle}>
    <label style={labelStyle} htmlFor={name}>{label}</label>
    <input
      id={name}
      name={name}
      type={type}
      value={formik.values[name]}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      style={inputStyle}
      disabled={loading}
      {...rest}
    />
    {formik.touched[name] && formik.errors[name] && (
      <div style={errorStyle}>{formik.errors[name]}</div>
    )}
  </div>
);

// Dropdown component outside to avoid recreation
const DropdownGroup = ({ name, label, options, formik, loading }) => (
  <div style={fieldGroupStyle}>
    <label style={labelStyle} htmlFor={name}>{label}</label>
    <select
      id={name}
      name={name}
      value={formik.values[name]}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      style={inputStyle}
      disabled={loading}
    >
      <option value="" disabled>Select {label}</option>
      {options.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
    {formik.touched[name] && formik.errors[name] && (
      <div style={errorStyle}>{formik.errors[name]}</div>
    )}
  </div>
);

export default function CreateEditRecord() {
  const [email, setEmail] = useState('');
  const [record, setRecord] = useState(null);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Standalone email verify
  const verifyEmail = async () => {
    setLoading(true);
    setRecord(null);
    setError('');
    setSuccess('');
    try {
      const response = await fetch(`http://localhost:5000/api/record/${email}`);
      if (response.ok) {
        const data = await response.json();
        setRecord(data);
        setVerified(true);
      } else if (response.status === 404) {
        setRecord(null);
        setVerified(true);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error fetching record');
        setVerified(false);
      }
    } catch {
      setError('Network error');
      setVerified(false);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = e => {
    setEmail(e.target.value);
    setError('');
    setSuccess('');
  };

  const validationSchema = Yup.object({
    date: Yup.string().required('Required'),
    requestedId: Yup.string().required('Required'),
    client: Yup.string().required('Required'),
    source: Yup.string().required('Required'),
    sourcerName: Yup.string().required('Required'),
    recruiter: Yup.string().required('Required'),
    employmentType: Yup.string().required('Required'),
    currentRole: Yup.string().required('Required'),
    candidateName: Yup.string().required('Required'),
    contactNo: Yup.string().required('Required'),
    expYears: Yup.string().required('Required'),
    expMonths: Yup.string().required('Required'),
    keySkillsExperience: Yup.string().required('Required'),
    workFromOffice: Yup.string().required('Required'),
    currentCompany: Yup.string().required('Required'),
    currentCompanyJoiningDate: Yup.string().required('Required'),
    previousCompany: Yup.string().required('Required'),
    education: Yup.string().required('Required'),
    passedOutYear: Yup.string().required('Required'),
    currentLocation: Yup.string().required('Required'),
    preferredLocation: Yup.string().required('Required'),
    screeningStatus: Yup.string().required('Required'),
    hackerrankAssessment: Yup.string().required('Required'),
    l1Date: Yup.string().required('Required'),
  });

  const initialValues = {
    date: '',
    requestedId: '',
    client: '',
    source: '',
    sourcerName: '',
    recruiter: '',
    employmentType: '',
    currentRole: '',
    candidateName: '',
    contactNo: '',
    expYears: '',
    expMonths: '',
    keySkillsExperience: '',
    workFromOffice: '',
    currentCompany: '',
    currentCompanyJoiningDate: '',
    previousCompany: '',
    education: '',
    passedOutYear: '',
    currentLocation: '',
    preferredLocation: '',
    screeningStatus: '',
    hackerrankAssessment: '',
    l1Date: '',
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      setError('');
      setSuccess('');
      try {
        const payload = {
          email,
          ...values,
          month: getMonthShort(values.date),
          week: getWeekOfMonth(values.date)
        };
        const res = await fetch('http://localhost:5000/api/record', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          setSuccess('Record saved!');
          alert('Record saved successfully!');
          // resetForm();
          // setVerified(false);
          // setEmail('');
        } else {
          const data = await res.json();
          setError(data.message || 'Save failed');
        }
      } catch {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    },
  });

  const derivedMonth = getMonthShort(formik.values.date);
  const derivedWeek = getWeekOfMonth(formik.values.date);

  const getInnerContainerStyle = (verified) => ({
    width: '100%',
    maxWidth: verified ? "95%" : 420,
    background: '#fff',
    borderRadius: 12,
    padding: 24,
    boxShadow: '0 4px 16px rgb(25 118 210 / 0.2)',
    boxSizing: 'border-box',
    overflowY: 'auto',
    maxHeight: '98vh',
    transition: 'max-width 0.3s ease-in-out',
  });

  return (
    <div style={outerContainerStyle}>
      <div style={getInnerContainerStyle(verified)} className="thin-scrollbar">
        <h2 style={{ color: primaryColor, textAlign: 'center' }}>Create / Edit Record</h2>

        {/* Email input and Verify always shown */}
        <div style={emailContainerStyle}>
          <div style={emailFieldStyle}>
            <label style={labelStyle} htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              style={inputStyle}
              disabled={loading}
              required
            />
          </div>
          <button
            onClick={verifyEmail}
            disabled={!email || loading}
            style={verifyButtonStyle(email, loading)}
            type="button"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </div>

        {/* Show record if exists (disabled fields) */}
        {verified && record && (
          <ExistingRecordUpdateForm
            record={record}
            email={email}
            onUpdateComplete={() => {
              setVerified(false);
              setRecord(null);
              setEmail('');
            }}
          />
        )}

        {/* If email verified and DOES NOT exist, show Formik form */}
        {verified && !record && (
          <form style={{ marginTop: 18 }} onSubmit={formik.handleSubmit} autoComplete="off">
            <h3>General Details</h3>
            <div style={gridContainerStyle}>
              <InputGroup name="date" label="Date" type="date" formik={formik} loading={loading} />
              <div style={fieldGroupStyle}>
                <label style={labelStyle}>Month</label>
                <input style={inputStyle} value={derivedMonth} disabled />
              </div>
              <div style={fieldGroupStyle}>
                <label style={labelStyle}>Week</label>
                <input style={inputStyle} value={derivedWeek} disabled />
              </div>
            </div>

            <h3>Experience</h3>
            <div style={gridContainerStyle}>
              <InputGroup name="currentCompany" label="Current Company" formik={formik} loading={loading} />
              <DropdownGroup name="expYears" label="Exp - Years" options={YEARS} formik={formik} loading={loading} />
              <DropdownGroup name="expMonths" label="Exp - Months" options={MONTHS} formik={formik} loading={loading} />
              <InputGroup name="keySkillsExperience" label="Key Skills Experience" formik={formik} loading={loading} />
              <InputGroup name="previousCompany" label="Previous Company" formik={formik} loading={loading} />
            </div>

            <h3>Education</h3>
            <div style={gridContainerStyle}>
              <DropdownGroup name="education" label="Education" options={EDU} formik={formik} loading={loading} />
              <DropdownGroup name="passedOutYear" label="Passed out Year" options={YEARS_PASS} formik={formik} loading={loading} />
            </div>

            <h3>Personal</h3>
            <div style={gridContainerStyle}>
              <InputGroup name="candidateName" label="Candidate Name" formik={formik} loading={loading} />
              <InputGroup name="contactNo" label="Contact No" formik={formik} loading={loading} />
              <DropdownGroup name="currentLocation" label="Current Location" options={LOCS} formik={formik} loading={loading} />
            </div>

            <h3>Screening</h3>
            <div style={gridContainerStyle}>
              <DropdownGroup name="screeningStatus" label="Screening Status" options={SCREENING} formik={formik} loading={loading} />
              <DropdownGroup name="hackerrankAssessment" label="HackerRank Assessment" options={HACKER} formik={formik} loading={loading} />
              <InputGroup name="l1Date" label="L1 Date" type="date" formik={formik} loading={loading} />
            </div>

            <h3>Other Details</h3>
            <div style={gridContainerStyle}>
              <InputGroup name="requestedId" label="Requested ID" formik={formik} loading={loading} />
              <InputGroup name="client" label="Client" formik={formik} loading={loading} />
              <DropdownGroup name="source" label="Source" options={DUMMIES} formik={formik} loading={loading} />
              <DropdownGroup name="sourcerName" label="Sourcer Name" options={DUMMIES} formik={formik} loading={loading} />
              <DropdownGroup name="recruiter" label="Recruiter" options={DUMMIES} formik={formik} loading={loading} />
              <DropdownGroup name="employmentType" label="Employment Type" options={DUMMIES} formik={formik} loading={loading} />
              <DropdownGroup name="currentRole" label="Current Role" options={DUMMIES} formik={formik} loading={loading} />
              <DropdownGroup name="workFromOffice" label="Work from office" options={YESNO} formik={formik} loading={loading} />
              <DropdownGroup name="preferredLocation" label="Preferred Location" options={LOCS} formik={formik} loading={loading} />
            </div>
            <div style={{width:"100%", marginTop: "2rem", textAlign:"center"}}>
              <button
                type="submit"
                style={{
                  ...verifyButtonStyle(true, loading),
                  width: 'fit-content',
                  marginTop: 'auto',
                  fontSize: 17,
                }}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
            {error && <div style={{ color: 'red', marginTop: 10, textAlign: 'center' }}>{error}</div>}
            {success && <div style={{ color: 'green', marginTop: 10, textAlign: 'center' }}>{success}</div>}
          </form>
        )}
      </div>
    </div>
  );
}

// Styles
const outerContainerStyle = {
  width: '100vw',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  padding: 16,
  background: '#f0f5ff',
  boxSizing: 'border-box',
};
const innerContainerStyle = {
  width: '100%',
  maxWidth: "95%",
  background: '#fff',
  borderRadius: 12,
  padding: 24,
  boxShadow: '0 4px 16px rgb(25 118 210 / 0.2)',
  boxSizing: 'border-box',
  overflowY: 'auto',
  maxHeight: '98vh',
};
const emailContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-end',
  flexDirection: 'row',
  gap: 8,
  marginTop: 25,
  marginBottom: 20,
};
const fieldGroupStyle = {
  width: '100%',
  marginBottom: 16,
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
};
const emailFieldStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  flexDirection: 'column',
  minWidth: 0,
};
const labelStyle = {
  marginBottom: 6,
  fontWeight: '600',
  fontSize: 14,
  color: '#333',
};
const inputStyle = {
  width: '100%',
  padding: 8,
  borderRadius: 6,
  border: '1px solid #ccc',
  fontSize: 16,
  boxSizing: 'border-box',
};
const errorStyle = {
  color: 'red',
  fontSize: 12,
  marginTop: 2,
};
const verifyButtonStyle = (email, loading) => ({
  background: primaryColor,
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  padding: '8px 16px',
  cursor: email && !loading ? 'pointer' : 'not-allowed',
  fontWeight: 'bold',
  fontSize: 16,
  flexShrink: 0,
  height: 'fit-content',
});

// New style for grid container (3 column responsive)
const gridContainerStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '16px 24px',
  width: '100%',
  marginTop: 8,
};
