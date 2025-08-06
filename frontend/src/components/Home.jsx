import React from 'react';
import {useNavigate} from 'react-router-dom';
import {primaryColor, textColor} from '../theme';
// import { EditIcon, InfoIcon, HelpIcon, HomeIcon } from './Icons';

import {Home as HomeIcon, Edit, Info, Help} from '@mui/icons-material';

const buttonData = [
  {label: "Create/Edit record", Icon: Edit, to: "/create-edit"},
  {label: "Dummy 1", Icon: Info, to: "/dummy1"},
  {label: "Dummy 2", Icon: Help, to: "/dummy2"},
  {label: "Dummy 3", Icon: HomeIcon, to: "/dummy3"},
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{
      width: '100vw',
      display: 'flex',
      height: '100vh',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#f0f5ff',
    }}>
      <div style={{
        margin: "40px auto",
        padding: "40px 50px",
        borderRadius: 16,
        background: "#fff",
        boxShadow: '0 4px 16px rgb(25 118 210 / 0.2)',
      }}>
        <h2 style={{color: primaryColor, textAlign: "center"}}>Welcome Home</h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr", gap: 40, marginTop: 30
        }}>
          {buttonData.map(({label, Icon, to}) => (
            <button key={label}
                    onClick={() => navigate(to)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      background: primaryColor,
                      color: textColor,
                      border: "none",
                      borderRadius: 8,
                      fontSize: 18,
                      fontWeight: "bold",
                      padding: "12px 20px",
                      gap: 16,
                      cursor: "pointer",
                      transition: "box-shadow .2s",
                      boxShadow: "0 3px 9px #1976d244"
                    }}>
              <Icon fontSize="large"/>
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
