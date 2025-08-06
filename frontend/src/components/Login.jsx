import React from 'react';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {primaryColor} from '../theme';
import {useNavigate} from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {email: '', password: ''},
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email format').required('Email is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: async (values, {setSubmitting, setStatus}) => {
      try {
        const res = await fetch('http://localhost:5000/api/login', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(values),
        });
        if (!res.ok) {
          const data = await res.json();
          setStatus(data.message || 'Login failed');
        } else {
          navigate('/home');
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
        <h2 style={{color: primaryColor}}>Login</h2>
        <form onSubmit={formik.handleSubmit}>
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
          <button type="submit" style={buttonStyle} disabled={formik.isSubmitting}>
            {formik.isSubmitting ? 'Logging in...' : 'Log In'}
          </button>
          {formik.status && <div style={errorStyle}>{formik.status}</div>}
        </form>
        <div style={{marginTop: 12}}>
          Don't have an account?{' '}
          <span style={{color: primaryColor, cursor: "pointer"}} onClick={() => navigate("/signup")}>
          Create one
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

export default Login;
