import React from "react";
import {useFormik} from "formik";
import * as Yup from "yup";
import {primaryColor} from "../theme";

const DUMMIES = ["dummy1", "dummy2", "dummy3"];
const YESNO = ["Yes", "No"];
const SCREENING = ["Shortlisted", "Rejected", "Yet to screen"];
const HACKER = [...SCREENING, "N/A"];
const YEARS = Array.from({length: 30}, (_, i) => (i + 1).toString());
const MONTHS = Array.from({length: 12}, (_, i) => (i + 1).toString());
const EDU = ["B.Tech", "M.Tech", "MCA", "BCA", "Other"];
const YEARS_PASS = Array.from({length: 30}, (_, i) => (2025 - i).toString());
const LOCS = DUMMIES;
const L1_STATUSES = DUMMIES;
const L1_PANELS = DUMMIES;
const HR_NAMES = DUMMIES;
const HR_STATUSES = SCREENING;
const NOTICE_PERIODS = ["1 Month", "2 Months", "3 Months", "Immediate"];
const APPROVALS = ["Yes", "No"];

const getMonthShort = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleString("default", {month: "short"});
};

const InputGroup = ({name, label, type = "text", formik, loading, ...rest}) => (
  <div style={fieldGroupStyle}>
    <label style={labelStyle} htmlFor={name}>
      {label}
    </label>
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

const DropdownGroup = ({name, label, options, formik, loading}) => (
  <div style={fieldGroupStyle}>
    <label style={labelStyle} htmlFor={name}>
      {label}
    </label>
    <select
      id={name}
      name={name}
      value={formik.values[name]}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      style={inputStyle}
      disabled={loading}
    >
      <option value="" disabled>
        Select {label}
      </option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
    {formik.touched[name] && formik.errors[name] && (
      <div style={errorStyle}>{formik.errors[name]}</div>
    )}
  </div>
);

export default function ExistingRecordUpdateForm({record, email, onUpdateComplete}) {
  // Editable fields list
  const editableFields = [
    "l1Status",
    "l1PanelName",
    "l2Date",
    "l2Status",
    "l2PanelName",
    "l3Date",
    "l3Status",
    "l3PanelName",
    "managerialDate",
    "managerialStatus",
    "fixedCTC",
    "variablePay",
    "offeredCTC",
    "noticePeriod",
    "hrDate",
    "hrName",
    "hrStatus",
    "scheduledDateRaj",
    "approvedByRaj",
    "overallStatus",
    "offeredDate",
    "dateOfJoining",
    "remarks",
  ];

  const sections = [
    {
      title: 'Previously Saved Fields (Read Only)',
      fields: Object.keys(record)
        .filter(k => k !== 'email' && !editableFields.includes(k))
        .map(k => ({name: k, label: k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()), readOnly: true})),
    },
    {
      title: 'L1 Panel',
      fields: [
        {name: 'l1Status', label: 'L1 Status', type: 'dropdown', options: L1_STATUSES},
        {name: 'l1PanelName', label: 'L1 Panel Name', type: 'dropdown', options: L1_PANELS},
      ],
    },
    {
      title: 'L2 Panel',
      fields: [
        {name: 'l2Date', label: 'L2 Date', type: 'date'},
        {name: 'l2Status', label: 'L2 Status', type: 'dropdown', options: DUMMIES},
        {name: 'l2PanelName', label: 'L2 Panel Name', type: 'dropdown', options: DUMMIES},
      ],
    },
    {
      title: 'L3 Panel',
      fields: [
        {name: 'l3Date', label: 'L3 Date', type: 'date'},
        {name: 'l3Status', label: 'L3 Status', type: 'dropdown', options: DUMMIES},
        {name: 'l3PanelName', label: 'L3 Panel Name', type: 'dropdown', options: DUMMIES},
      ],
    },
    {
      title: 'Managerial Round',
      fields: [
        {name: 'managerialDate', label: 'Managerial Date', type: 'date'},
        {name: 'managerialStatus', label: 'Managerial Status', type: 'dropdown', options: DUMMIES},
      ],
    },
    {
      title: 'Compensation',
      fields: [
        {name: 'fixedCTC', label: 'Fixed CTC'},
        {name: 'variablePay', label: 'Variable Pay'},
        {name: 'offeredCTC', label: 'Offered CTC'},
        {name: 'noticePeriod', label: 'Notice Period', type: 'dropdown', options: NOTICE_PERIODS},
      ],
    },
    {
      title: 'HR Round',
      fields: [
        {name: 'hrDate', label: 'HR Date', type: 'date'},
        {name: 'hrName', label: 'HR Name', type: 'dropdown', options: HR_NAMES},
        {name: 'hrStatus', label: 'HR Status', type: 'dropdown', options: HR_STATUSES},
      ],
    },
    {
      title: 'Finalization',
      fields: [
        {name: 'scheduledDateRaj', label: 'Scheduled Date (Raj)', type: 'date'},
        {name: 'approvedByRaj', label: 'Approved by Raj', type: 'dropdown', options: APPROVALS},
        {name: 'overallStatus', label: 'Overall Status'},
        {name: 'offeredDate', label: 'Offered Date', type: 'date'},
        {name: 'offeredMonth', label: 'Offered Month', type: 'derived', derivedFrom: 'offeredDate'},
        {name: 'dateOfJoining', label: 'Date Of Joining', type: 'date'},
        {name: 'joiningMonth', label: 'Joining Month', type: 'derived', derivedFrom: 'dateOfJoining'},
        {name: 'remarks', label: 'Remarks'},
      ],
    },
  ];

  // Build initial values for editable form from record or empty string
  const initialValues = {};
  editableFields.forEach((field) => {
    initialValues[field] = record[field] || "";
  });

  // Validation schema for editable fields
  const shape = {};
  editableFields.forEach((field) => {
    shape[field] = Yup.string().required("Required");
  });
  const validationSchema = Yup.object(shape);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, {resetForm}) => {
      try {
        const payload = {
          ...record,
          ...values,
          email,
          offeredMonth: getMonthShort(values.offeredDate),
          joiningMonth: getMonthShort(values.dateOfJoining),
        };
        const res = await fetch("http://localhost:5000/api/record", {
          method: "POST", // or PUT for update if your backend supports it
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          alert("Record updated successfully!");
          resetForm();
          onUpdateComplete();
        } else {
          const data = await res.json();
          alert(data.message || "Update failed");
        }
      } catch {
        alert("Network error");
      }
    },
  });

  // Dynamically render all saved record fields (except "email" and editableFields) as read-only inputs
  const readOnlyFields = Object.keys(record).filter(
    (key) => key !== "email" && !editableFields.includes(key)
  );

  return (
    <form onSubmit={formik.handleSubmit} autoComplete="off" style={{marginTop: 20}}>
      {sections.map((section) => (
        <div key={section.title} style={{marginBottom: 32}}>
          <h3>{section.title}</h3>
          <div style={gridContainerStyle}>
            {section.fields.map(({name, label, type, options, derivedFrom}) => {
              // Read-only saved fields
              if (type === 'readOnly' || (record && !editableFields.includes(name) && name in record)) {
                return (
                  <div key={name} style={fieldGroupStyle}>
                    <label style={labelStyle}>{label}</label>
                    <input style={inputStyle} value={record[name] || ''} disabled/>
                  </div>
                );
              }
              // Derived fields
              if (type === 'derived') {
                const derivedValue = getMonthShort(formik.values[derivedFrom]);
                return (
                  <div key={name} style={fieldGroupStyle}>
                    <label style={labelStyle}>{label}</label>
                    <input style={inputStyle} value={derivedValue} disabled/>
                  </div>
                );
              }
              // Editable dropdown
              if (type === 'dropdown') {
                return (
                  <DropdownGroup
                    key={name}
                    name={name}
                    label={label}
                    options={options}
                    formik={formik}
                    loading={formik.isSubmitting}
                  />
                );
              }
              // Editable input (defaults to text)
              return (
                <InputGroup
                  key={name}
                  name={name}
                  label={label}
                  type={type || 'text'}
                  formik={formik}
                  loading={formik.isSubmitting}
                />
              );
            })}
          </div>
        </div>
      ))}

      <div style={{width: "100%", textAlign: "center"}}>
        <button
          type="submit"
          disabled={formik.isSubmitting}
          style={{
            padding: '8px 12px',
            fontSize: 17,
            backgroundColor: primaryColor,
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
          }}
        >
          {formik.isSubmitting ? 'Updating...' : 'Update'}
        </button>
      </div>
    </form>
  );
}

// Styles (use same styling as CreateEditRecord.jsx)
const fieldGroupStyle = {
  marginBottom: 16,
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
};
const labelStyle = {
  marginBottom: 6,
  fontWeight: "600",
  fontSize: 14,
  color: "#333",
};
const inputStyle = {
  width: "100%",
  padding: 10,
  borderRadius: 6,
  border: "1px solid #ccc",
  fontSize: 16,
  boxSizing: "border-box",
};
const errorStyle = {
  color: "red",
  fontSize: 12,
  marginTop: 2,
};

// New responsive grid container for multi-column layout
const gridContainerStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "16px 24px",
  width: "100%",
  marginTop: 8,
};