import React, {useEffect} from "react";
import {useFormik} from "formik";
import * as Yup from "yup";
import {primaryColor} from "../theme";

import {
  L1_STATUS,
  L1_PANEL_NAMES,
  L2_STATUS,
  L2_PANEL_NAMES,
  L3_STATUS,
  L3_PANEL_NAMES,
  MANAGERIAL_STATUS,
  HR_NAMES,
  HR_STATUS,
  APPROVED_BY_RAJ,
  NOTICE_PERIOD,
  FINAL_STATUS,
} from "../consts.js";

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
  // Editable fields excluding finalStatus since derived
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
    "finalStatus",
    "offeredDate",
    "dateOfJoining",
    "remarks",
  ];

  const SECTIONS = [
    {
      title: "General Details",
      fields: [
        "date", "month", "week",
      ],
    },
    {
      title: "Experience",
      fields: [
        "expYears", "expMonths", "keySkillsExperience", "workFromOffice",
        "currentCompany", "currentCompanyJoiningDate", "previousCompany"
      ],
    },
    {
      title: "Education",
      fields: [
        "education", "passedOutYear",
      ],
    },
    {
      title: "Personal",
      fields: [
        "candidateName", "contactNo", "currentLocation",
      ],
    },
    {
      title: "Screening",
      fields: [
        "screeningStatus", "hackerrankAssessment", "l1Date"
      ],
    },
    {
      title: "Other Details",
      fields: [
        "requestedId", "client", "source", "sourcerName", "recruiter",
        "employmentType", "currentRole"
      ],
    },
    // Add other sections if needed
  ];

  // Sections grouping
  const sections = [
    {
      title: "L1 Panel",
      fields: [
        {name: "l1Status", label: "L1 Status", type: "dropdown", options: L1_STATUS},
        {name: "l1PanelName", label: "L1 Panel Name", type: "dropdown", options: L1_PANEL_NAMES},
      ],
    },
    {
      title: "L2 Panel",
      fields: [
        {name: "l2Date", label: "L2 Date", type: "date"},
        {name: "l2Status", label: "L2 Status", type: "dropdown", options: L2_STATUS},
        {name: "l2PanelName", label: "L2 Panel Name", type: "dropdown", options: L2_PANEL_NAMES},
      ],
    },
    {
      title: "L3 Panel",
      fields: [
        {name: "l3Date", label: "L3 Date", type: "date"},
        {name: "l3Status", label: "L3 Status", type: "dropdown", options: L3_STATUS},
        {name: "l3PanelName", label: "L3 Panel Name", type: "dropdown", options: L3_PANEL_NAMES},
      ],
    },
    {
      title: "Managerial Round",
      fields: [
        {name: "managerialDate", label: "Managerial Date", type: "date"},
        {name: "managerialStatus", label: "Managerial Status", type: "dropdown", options: MANAGERIAL_STATUS},
      ],
    },
    {
      title: "HR Round",
      fields: [
        {name: "hrDate", label: "HR Date", type: "date"},
        {name: "hrName", label: "HR Name", type: "dropdown", options: HR_NAMES},
        {name: "hrStatus", label: "HR Status", type: "dropdown", options: HR_STATUS},
      ],
    },
    {
      title: "Compensation",
      fields: [
        {name: "fixedCTC", label: "Fixed CTC"},
        {name: "variablePay", label: "Variable Pay"},
        {name: "offeredCTC", label: "Offered CTC"},
        {name: "noticePeriod", label: "Notice Period", type: "dropdown", options: NOTICE_PERIOD},
      ],
    },
    {
      title: "Finalization",
      fields: [
        {name: "scheduledDateRaj", label: "Scheduled Date (Raj)", type: "date"},
        {name: "approvedByRaj", label: "Approved by Raj", type: "dropdown", options: APPROVED_BY_RAJ},
        // finalStatus handled separately below as derived & disabled field
        {name: "finalStatus", label: "Final Status", type: "dropdown", options: FINAL_STATUS},
        {name: "offeredDate", label: "Offered Date", type: "date"},
        {name: "offeredMonth", label: "Offered Month", type: "derived", derivedFrom: "offeredDate"},
        {name: "dateOfJoining", label: "Date Of Joining", type: "date"},
        {name: "joiningMonth", label: "Joining Month", type: "derived", derivedFrom: "dateOfJoining"},
        {name: "remarks", label: "Remarks"},
      ],
    },
  ];

  // Initialize formik initialValues with editable fields from record or empty strings
  const initialValues = {};
  editableFields.forEach((f) => (initialValues[f] = record[f] || ""));

  // Validation: required for all editable fields
  const shape = {};
  editableFields.forEach((f) => (shape[f] = Yup.string().required("Required")));
  const validationSchema = Yup.object(shape);

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true, // critical for updated record change
    onSubmit: async (values, {resetForm}) => {
      try {
        const payload = {
          ...record,
          ...values,
          email,
          offeredMonth: getMonthShort(values.offeredDate),
          joiningMonth: getMonthShort(values.dateOfJoining),
          finalStatus: formik.values.finalStatus, //ensure included
        };
        const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/record`, {
          method: "POST",
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

  // Final Status auto-calculation based on hierarchical statuses
  useEffect(() => {
    const {l1Status = "", l2Status = "", l3Status = "", managerialStatus = "", hrStatus = ""} = formik.values;
    let status = "";

    if (l1Status === "Scheduled") status = "L1 scheduled";
    if (l1Status === "Shortlisted") status = "L1 Select";
    if (l1Status === "Rejected") status = "L1 Reject";

    if (l2Status === "Scheduled") status = "L2 scheduled";
    if (l2Status === "Shortlisted") status = "L2 Select";
    if (l2Status === "Rejected") status = "L2 Reject";

    if (l3Status === "Scheduled") status = "L3 scheduled";
    if (l3Status === "Shortlisted") status = "L3 Select";
    if (l3Status === "Rejected") status = "L3 Reject";

    if (managerialStatus === "Scheduled") status = "Manager scheduled";
    if (managerialStatus === "Shortlisted") status = "Manager Select";
    if (managerialStatus === "Rejected") status = "Manager Reject";

    if (hrStatus === "Scheduled") status = "HR scheduled";
    if (hrStatus === "Shortlisted") status = "HR Select";
    if (hrStatus === "Rejected") status = "HR Reject";

    if (status !== formik.values.finalStatus) {
      formik.setFieldValue("finalStatus", status);
    }
  }, [
    formik.values.l1Status,
    formik.values.l2Status,
    formik.values.l3Status,
    formik.values.managerialStatus,
    formik.values.hrStatus,
  ]);

  return (
    <>
      <div style={{marginBottom: 40}}>
        {SECTIONS.map(({title, fields}) => (
          <div key={title} style={{marginBottom: 24}}>
            <h3>{title} (Saved Data)</h3>
            <div style={gridContainerStyle}>
              {fields.map(field => (
                record[field] !== undefined ? (
                  <div key={field} style={fieldGroupStyle}>
                    <label style={labelStyle}>
                      {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                    </label>
                    <input style={inputStyle} value={record[field] || ""} disabled/>
                  </div>
                ) : null
              ))}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={formik.handleSubmit} autoComplete="off" style={{marginTop: 20}}>
        {sections.map((section) => (
          <div key={section.title} style={{marginBottom: 32}}>
            <h3>{section.title}</h3>
            <div style={gridContainerStyle}>
              {section.fields.map(({name, label, type, options, derivedFrom}) => {
                if (type === "readOnly") {
                  return (
                    <div key={name} style={fieldGroupStyle}>
                      <label style={labelStyle}>{label}</label>
                      <input style={inputStyle} value={record[name] || ""} disabled/>
                    </div>
                  );
                }
                if (type === "derived") {
                  const derivedValue = getMonthShort(formik.values[derivedFrom]);
                  return (
                    <div key={name} style={fieldGroupStyle}>
                      <label style={labelStyle}>{label}</label>
                      <input style={inputStyle} value={derivedValue} disabled/>
                    </div>
                  );
                }
                if (type === "dropdown") {
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
                // regular input
                return (
                  <InputGroup
                    key={name}
                    name={name}
                    label={label}
                    type={type || "text"}
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
              padding: "8px 12px",
              fontSize: 17,
              backgroundColor: primaryColor,
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            {formik.isSubmitting ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </>

  );
}

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
const gridContainerStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "16px 24px",
  width: "100%",
  marginTop: 8,
};