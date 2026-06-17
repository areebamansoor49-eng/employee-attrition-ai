import { useState } from "react";
import axios from "axios";
import "./App.css";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";

const API_URL = "http://127.0.0.1:5000";

/* ================= LOGIN ================= */
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", email);

      alert("👋 Welcome Back! Login Successful");

      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="card">
      <h1>Login 🔐</h1>

      <input placeholder="Email" value={email}
        onChange={(e) => setEmail(e.target.value)} />

      <input placeholder="Password" type="password" value={password}
        onChange={(e) => setPassword(e.target.value)} />

      <button onClick={login}>Login</button>

      <p><Link to="/register">Create Account</Link></p>
    </div>
  );
}

/* ================= REGISTER ================= */
function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const registerUser = async () => {
    try {
      await axios.post(`${API_URL}/register`, {
        username,
        email,
        password,
      });

      localStorage.setItem("username", username);

      alert("🎉 Welcome! Account Created Successfully");

      navigate("/");

    } catch (err) {
      alert(err.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="card">
      <h1>Register 🚀</h1>

      <input placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)} />

      <input placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)} />

      <input placeholder="Password" type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)} />

      <button onClick={registerUser}>Register</button>
    </div>
  );
}

/* ================= DASHBOARD ================= */
function Dashboard() {
  const [form, setForm] = useState({});
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= 34 FEATURES ================= */
  const fields = [
    "Age","BusinessTravel","DailyRate","Department","DistanceFromHome",
    "Education","EducationField","EmployeeCount","EmployeeNumber",
    "EnvironmentSatisfaction","Gender","HourlyRate","JobInvolvement",
    "JobLevel","JobRole","JobSatisfaction","MaritalStatus",
    "MonthlyIncome","MonthlyRate","NumCompaniesWorked","Over18",
    "OverTime","PercentSalaryHike","PerformanceRating",
    "RelationshipSatisfaction","StandardHours","StockOptionLevel",
    "TotalWorkingYears","TrainingTimesLastYear","WorkLifeBalance",
    "YearsAtCompany","YearsInCurrentRole",
    "YearsSinceLastPromotion","YearsWithCurrManager"
  ];

  /* ================= DROPDOWNS (ALL FIXED) ================= */
  const options = {

  Age: [
    { label: "18 Years", value: 18 },
    { label: "22 Years", value: 22 },
    { label: "25 Years", value: 25 },
    { label: "30 Years", value: 30 },
    { label: "35 Years", value: 35 },
    { label: "40 Years", value: 40 },
    { label: "45 Years", value: 45 },
    { label: "50 Years", value: 50 }
  ],

  Gender: [
    { label: "Male", value: 1 },
    { label: "Female", value: 0 },
    { label: "Not Specified", value: 2 }
  ],

  MaritalStatus: [
    { label: "Single", value: 0 },
    { label: "Married", value: 1 },
    { label: "Divorced", value: 2 },
    { label: "Widowed", value: 3 },
    { label: "Separated", value: 4 }
  ],

  BusinessTravel: [
    { label: "Never", value: 0 },
    { label: "Rarely", value: 1 },
    { label: "Frequently", value: 2 },
    { label: "Weekly", value: 3 },
    { label: "Daily", value: 4 }
  ],

  Department: [
    { label: "Human Resources", value: 0 },
    { label: "Sales", value: 1 },
    { label: "Research & Development", value: 2 },
    { label: "Information Technology", value: 3 },
    { label: "Finance", value: 4 }
  ],

  Education: [
    { label: "High School", value: 1 },
    { label: "Diploma", value: 2 },
    { label: "Bachelor Degree", value: 3 },
    { label: "Master Degree", value: 4 },
    { label: "PhD", value: 5 }
  ],

  EducationField: [
    { label: "Engineering", value: 1 },
    { label: "Commerce", value: 2 },
    { label: "Business Administration", value: 3 },
    { label: "Finance", value: 4 },
    { label: "Marketing", value: 5 },
    { label: "Human Resources", value: 6 }
  ],

  DistanceFromHome: [
    { label: "1 - 5 KM", value: 3 },
    { label: "5 - 10 KM", value: 8 },
    { label: "10 - 20 KM", value: 15 },
    { label: "20 - 30 KM", value: 25 },
    { label: "30+ KM", value: 35 }
  ],

  JobRole: [
    { label: "Sales Executive", value: 1 },
    { label: "HR Head", value: 2 },
    { label: "Treasury Head", value: 3 },
    { label: "IT Specialist", value: 4 },
    { label: "Software Engineer", value: 5 },
    { label: "Research Scientist", value: 6 },
    { label: "Project Manager", value: 7 }
  ],

  JobLevel: [
    { label: "Entry Level", value: 1 },
    { label: "Junior", value: 2 },
    { label: "Mid Level", value: 3 },
    { label: "Senior", value: 4 },
    { label: "Executive", value: 5 }
  ],

  JobInvolvement: [
    { label: "Very Low", value: 1 },
    { label: "Low", value: 2 },
    { label: "Medium", value: 3 },
    { label: "High", value: 4 },
    { label: "Very High", value: 5 }
  ],

  JobSatisfaction: [
    { label: "Very Low", value: 1 },
    { label: "Low", value: 2 },
    { label: "Medium", value: 3 },
    { label: "High", value: 4 },
    { label: "Very High", value: 5 }
  ],

  EnvironmentSatisfaction: [
    { label: "Very Low", value: 1 },
    { label: "Low", value: 2 },
    { label: "Medium", value: 3 },
    { label: "High", value: 4 },
    { label: "Very High", value: 5 }
  ],

  MonthlyIncome: [
    { label: "20,000 - 30,000", value: 25000 },
    { label: "30,000 - 40,000", value: 35000 },
    { label: "40,000 - 50,000", value: 45000 },
    { label: "50,000 - 60,000", value: 55000 },
    { label: "60,000 - 80,000", value: 70000 },
    { label: "80,000+", value: 90000 }
  ],

  NumCompaniesWorked: [
    { label: "1 Company", value: 1 },
    { label: "2 Companies", value: 2 },
    { label: "3 Companies", value: 3 },
    { label: "4 Companies", value: 4 },
    { label: "5+ Companies", value: 5 }
  ],

  OverTime: [
    { label: "No", value: 0 },
    { label: "Yes", value: 1 }
  ],

  PercentSalaryHike: [
    { label: "3%", value: 3 },
    { label: "5%", value: 5 },
    { label: "7%", value: 7 },
    { label: "10%", value: 10 },
    { label: "15%", value: 15 }
  ],

  PerformanceRating: [
    { label: "Poor", value: 1 },
    { label: "Average", value: 2 },
    { label: "Good", value: 3 },
    { label: "Excellent", value: 4 },
    { label: "Outstanding", value: 5 }
  ],

  RelationshipSatisfaction: [
    { label: "Very Low", value: 1 },
    { label: "Low", value: 2 },
    { label: "Medium", value: 3 },
    { label: "High", value: 4 },
    { label: "Very High", value: 5 }
  ],

  StandardHours: [
    { label: "8 Hours", value: 8 },
    { label: "9 Hours", value: 9 },
    { label: "10 Hours", value: 10 },
    { label: "12 Hours", value: 12 }
  ],

  TotalWorkingYears: [
    { label: "0 - 2 Years", value: 2 },
    { label: "3 - 5 Years", value: 5 },
    { label: "6 - 10 Years", value: 10 },
    { label: "11 - 15 Years", value: 15 },
    { label: "15+ Years", value: 20 }
  ],

  TrainingTimesLastYear: [
    { label: "0 Times", value: 0 },
    { label: "1 Time", value: 1 },
    { label: "2 Times", value: 2 },
    { label: "3 Times", value: 3 },
    { label: "4+ Times", value: 4 }
  ],

  WorkLifeBalance: [
    { label: "Poor", value: 1 },
    { label: "Average", value: 2 },
    { label: "Good", value: 3 },
    { label: "Excellent", value: 4 },
    { label: "Outstanding", value: 5 }
  ],

  YearsAtCompany: [
    { label: "0 - 1 Year", value: 1 },
    { label: "1 - 3 Years", value: 3 },
    { label: "3 - 5 Years", value: 5 },
    { label: "5 - 10 Years", value: 10 },
    { label: "10+ Years", value: 15 }
  ],

  YearsInCurrentRole: [
    { label: "0 - 1 Year", value: 1 },
    { label: "1 - 3 Years", value: 3 },
    { label: "3 - 5 Years", value: 5 },
    { label: "5 - 10 Years", value: 10 },
    { label: "10+ Years", value: 15 }
  ],

  YearsSinceLastPromotion: [
    { label: "0 Year", value: 0 },
    { label: "1 Year", value: 1 },
    { label: "2 Years", value: 2 },
    { label: "3 Years", value: 3 },
    { label: "5+ Years", value: 5 }
  ]

};

  const renderField = (name) => {
    if (options[name]) {
      return (
        <select name={name} onChange={handleChange}>
          <option value="">Select {name}</option>
          {options[name].map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    }

    return <input name={name} placeholder={name} onChange={handleChange} />;
  };

  const predict = async () => {
    try {
      setLoading(true);

      const payload = {};
      fields.forEach((f) => {
        payload[f] = Number(form[f]) || 0;
      });

      const res = await axios.post(
        `${API_URL}/predict`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setResult(`✨ ${res.data.result} | Risk: ${res.data.probability || 0}%`);

    } catch (err) {
      setResult("Prediction Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-white">

      {/* RIGHT SIDE USER */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>👋 Welcome to AI Dashboard</h2>
        <h3>👤 {username}</h3>
      </div>

      <div className="grid">

  {fields.map((f) => (
    <div key={f} className="field-box">

      <label className="field-label">
        {f.replace(/([A-Z])/g, " $1").trim()}
      </label>

      {renderField(f)}

    </div>
  ))}

</div>

<div className="action-buttons">

  <button className="predict-btn" onClick={predict}>
    {loading ? "Processing..." : "Predict 🚀"}
  </button>

  <button
    className="dataset-btn"
    onClick={() =>
      window.open(
        "https://www.kaggle.com/code/faressayah/ibm-hr-analytics-employee-attrition-performance",
        "_blank"
      )
    }
  >
    📊 View Dataset
  </button>

</div>

{result && (
  <h2 className="result-box">
    {result}
  </h2>
)}

</div>
);
}

/* ================= APP ================= */
export default function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Login</Link> |
        <Link to="/register">Register</Link> |
        <Link to="/dashboard">Dashboard</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}