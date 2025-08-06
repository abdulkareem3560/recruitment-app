import React from 'react';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {primaryColor} from '../theme';
import {useNavigate} from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('First name is required'),
      lastName: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Last name is required'),
      email: Yup.string()
        .email('Invalid email format')
        .required('Email is required'),
      password: Yup.string()
        .min(6, 'Minimum 6 characters')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm your password'),
    }),
    onSubmit: async (values, {setSubmitting, setStatus}) => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/signup`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(values),
        });
        if (!res.ok) {
          const data = await res.json();
          setStatus(data.message || 'Signup failed');
        } else {
          navigate('/login');
        }
      } catch (e) {
        setStatus('Network error');
      }
      setSubmitting(false);
    },
  });

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: '#f0f5ff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        overflowX: "hidden"
      }}>

      <div style={{
        width: "30%",
        margin: "40px auto",
        padding: 24,
        background: "#fff",
        borderRadius: 12,
        boxShadow: '0 4px 16px rgb(25 118 210 / 0.2)',
      }}>
        <h2 style={{color: primaryColor}}>Sign Up</h2>
        <form onSubmit={formik.handleSubmit}>
          {/* First Name */}
          <input
            name="firstName"
            placeholder="First Name"
            type="text"
            {...formik.getFieldProps('firstName')}
            style={inputStyle}
          />
          {formik.touched.firstName && formik.errors.firstName && (
            <div style={errorStyle}>{formik.errors.firstName}</div>
          )}

          {/* Last Name */}
          <input
            name="lastName"
            placeholder="Last Name"
            type="text"
            {...formik.getFieldProps('lastName')}
            style={inputStyle}
          />
          {formik.touched.lastName && formik.errors.lastName && (
            <div style={errorStyle}>{formik.errors.lastName}</div>
          )}

          {/* Email */}
          <input
            name="email"
            placeholder="Email"
            type="email"
            {...formik.getFieldProps('email')}
            style={inputStyle}
          />
          {formik.touched.email && formik.errors.email && (
            <div style={errorStyle}>{formik.errors.email}</div>
          )}

          {/* Password */}
          <input
            name="password"
            placeholder="Password"
            type="password"
            {...formik.getFieldProps('password')}
            style={inputStyle}
          />
          {formik.touched.password && formik.errors.password && (
            <div style={errorStyle}>{formik.errors.password}</div>
          )}

          {/* Confirm Password */}
          <input
            name="confirmPassword"
            placeholder="Confirm Password"
            type="password"
            {...formik.getFieldProps('confirmPassword')}
            style={inputStyle}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <div style={errorStyle}>{formik.errors.confirmPassword}</div>
          )}

          {/* Submit */}
          <button type="submit" style={buttonStyle} disabled={formik.isSubmitting}>
            {formik.isSubmitting ? 'Signing up...' : 'Sign Up'}
          </button>
          {formik.status && <div style={errorStyle}>{formik.status}</div>}
        </form>
        <div style={{marginTop: 12}}>
          Already have an account?{' '}
          <span style={{color: primaryColor, cursor: "pointer"}} onClick={() => navigate("/login")}>
          Log in
        </span>
        </div>
      </div>
    </div>
  );
};

const inputStyle = {width: "96%", padding: 8, margin: "8px 0", borderRadius: 6, border: "1px solid #ccc"};
const errorStyle = {color: "red", fontSize: 13, marginBottom: 2};
const buttonStyle = {
  width: "100%",
  padding: 10,
  background: primaryColor,
  color: '#fff',
  border: 'none',
  borderRadius: 6,
  fontWeight: "bold",
  fontSize: 16,
  marginTop: 16,
  cursor: "pointer"
};

export default Signup;
