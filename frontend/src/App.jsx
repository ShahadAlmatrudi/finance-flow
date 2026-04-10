import { useState, useEffect } from 'react'

// Navigation items for sidebar
const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: '▦', section: 'Main' },
  { id: 'users', label: 'Users', icon: '👤', section: 'Management' },
  { id: 'transactions', label: 'Transactions', icon: '↕', section: null },
  { id: 'categories', label: 'Categories', icon: '◈', section: null },
  { id: 'reports', label: 'Reports', icon: '▤', section: 'Reports' },
  { id: 'settings', label: 'Settings', icon: '⚙', section: 'System' },
]
// Button styles
const BTN = {
  primary: {
    background: '#1a1a2e',
    color: '#fff',
    border: 'none',
    padding: '6px 12px',
    borderRadius: 6,
    fontSize: 12,
    cursor: 'pointer',
    fontWeight: 500
  },
  danger: {
    background: '#fff5f5',
    color: '#c53030',
    border: 'none',
    padding: '6px 12px',
    borderRadius: 6,
    fontSize: 12,
    cursor: 'pointer',
    fontWeight: 500
  },
  edit: {
    background: '#ebf8ff',
    color: '#2b6cb0',
    border: 'none',
    padding: '6px 12px',
    borderRadius: 6,
    fontSize: 12,
    cursor: 'pointer',
    fontWeight: 500
  }
}

// Shared input style
const inputStyle = {
  border:'1px solid #e2e8f0',
  borderRadius:6,
  padding:'6px 10px',
  fontSize:13,
  outline:'none'
}

// Table styles
const thStyle = {
  textAlign:'left',
  padding:'12px 16px',
  fontSize:12,
  color:'#718096',
  borderBottom:'1px solid #e8ecf0'
}

const tdStyle = {
  padding:'14px 16px',
  fontSize:13,
  borderBottom:'1px solid #f1f5f9'
}

// Page titles mapping
const PAGE_TITLES = {
  dashboard: 'Dashboard', users: 'User Management',
  transactions: 'Transaction Management', categories: 'Category Management',
  reports: 'Financial Reports & Analytics', settings: 'System Settings',
}

// Badge component for status labels
function Badge({ type }) {
  const map = {
    Active:{bg:'#f0fff4',color:'#276749'}, Pending:{bg:'#fffbeb',color:'#92400e'},
    Suspended:{bg:'#fff5f5',color:'#9b2c2c'}, Admin:{bg:'#ebf4ff',color:'#1a365d'},
    User:{bg:'#f7fafc',color:'#4a5568'}, Income:{bg:'#f0fff4',color:'#276749'},
    Expense:{bg:'#fff5f5',color:'#9b2c2c'}, Transfer:{bg:'#ebf4ff',color:'#1a365d'},
    Completed:{bg:'#f0fff4',color:'#276749'}, Failed:{bg:'#fff5f5',color:'#9b2c2c'},
  }
  const s = map[type] || {bg:'#f7fafc',color:'#4a5568'}
  return <span style={{display:'inline-block',padding:'3px 10px',borderRadius:20,fontSize:11,fontWeight:500,background:s.bg,color:s.color}}>{type}</span>
}
// Dashboard statistic card
function StatCard({ label, value, change, down }) {
  return (
    <div style={{background:'#fff',borderRadius:12,padding:20,border:'1px solid #e8ecf0'}}>
      <div style={{fontSize:12,color:'#718096',marginBottom:6,fontWeight:500}}>{label}</div>
      <div style={{fontSize:28,fontWeight:700,color:'#1a1a2e',marginBottom:4}}>{value}</div>
      <div style={{fontSize:12,color:down?'#fc8181':'#48bb78'}}>{change}</div>
    </div>
  )
}
// Dashboard page
function Dashboard() {
  return (
    <div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:24}}>
        <StatCard label="Total Users" value="1,248" change="↑ 12% since last month" />
        <StatCard label="Pending Transactions" value="43" change="↓ 5% since last week" down />
        <StatCard label="Average Saving Rate" value="68%" change="↑ 3% this month" />
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1.6fr 1fr',gap:16}}>
        <div style={{background:'#fff',borderRadius:12,padding:20,border:'1px solid #e8ecf0'}}>
          <div style={{fontSize:14,fontWeight:600,marginBottom:16}}>User Growth Over Time</div>
          <div style={{display:'flex',alignItems:'flex-end',gap:8,height:120,marginBottom:8}}>
            {[{l:'Jan',h:40,f:false},{l:'Feb',h:55,f:false},{l:'Mar',h:65,f:true},{l:'Apr',h:75,f:true},{l:'May',h:88,f:true},{l:'Jun',h:100,f:true}].map(b=>(
              <div key={b.l} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
                <div style={{width:'100%',height:`${b.h}%`,background:b.f?'#63b3ed':'#ebf4ff',borderRadius:'4px 4px 0 0'}} />
                <span style={{fontSize:10,color:'#a0aec0'}}>{b.l}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{background:'#fff',borderRadius:12,padding:20,border:'1px solid #e8ecf0'}}>
          <div style={{fontSize:14,fontWeight:600,marginBottom:16}}>Recent Admin Activity</div>
          {[
            {text:'Updated user Jane Doe',time:'2 minutes ago'},
            {text:'Approved transaction #1042',time:'1 hour ago'},
            {text:'Added category Savings',time:'3 hours ago'},
            {text:'Deleted user John S.',time:'Yesterday'},
            {text:'Reviewed report Q1 2024',time:'2 days ago'},
          ].map((a,i)=>(
            <div key={i} style={{display:'flex',gap:10,padding:'10px 0',borderBottom:'1px solid #f7fafc',alignItems:'flex-start'}}>
              <div style={{width:8,height:8,borderRadius:'50%',background:'#63b3ed',marginTop:5,flexShrink:0}} />
              <div>
                <div style={{fontSize:12,color:'#4a5568'}}>{a.text}</div>
                <div style={{fontSize:11,color:'#a0aec0',marginTop:2}}>{a.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
// Users page
function Users() {
  const [editEmailError, setEditEmailError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('users')
    return saved ? JSON.parse(saved) : DEFAULT_USERS
  })

  const [search, setSearch] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [editingUser, setEditingUser] = useState(null)

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users))
  }, [users])

const addUser = () => {
  if (!name || !email) return

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailRegex.test(email)) {
    setEmailError('Invalid email format')
    return
  }

  setEmailError('')

  setUsers([...users, {
    id: Date.now(),
    name,
    email,
    status: 'Active',
    role: 'User'
  }])

  setName('')
  setEmail('')
}

  const deleteUser = (id) => {
    setUsers(users.filter(u => u.id !== id))
  }

const saveEdit = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailRegex.test(editingUser.email)) {
    setEditEmailError('Invalid email format')
    return
  }

  setEditEmailError('')

  setUsers(users.map(u =>
    u.id === editingUser.id ? editingUser : u
  ))

  setEditingUser(null)
}

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

return (
  <div style={{
    background:'#fff',
    borderRadius:12,
    border:'1px solid #e8ecf0',
    paddingBottom:10
  }}>

    <div style={{
      padding:16,
      display:'flex',
      gap:10,
      alignItems:'center'
    }}>
      <input style={inputStyle} placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
<div style={{position:'relative', width:200}}>
  <input
    style={{
      ...inputStyle,
      width:'100%',
      border: emailError ? '1px solid #e53e3e' : inputStyle.border
    }}
    placeholder="Email"
    value={email}
    onChange={e=>{
      setEmail(e.target.value)
      setEmailError('')
    }}
  />

  {emailError && (
    <span style={{
      position:'absolute',
      top:'100%',
      left:0,
      color:'#e53e3e',
      fontSize:11,
      marginTop:4,
      whiteSpace:'nowrap'
    }}>
      {emailError}
    </span>
  )}
</div>    
      <button style={BTN.primary} onClick={addUser}>+ Add</button>
    </div>

    <div style={{padding:'0 16px 16px'}}>
      <input style={inputStyle} placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} />
    </div>

    <table style={{
      width:'100%',
      borderCollapse:'collapse'
    }}>
      <thead>
        <tr>
          <th style={thStyle}>Name</th>
          <th style={thStyle}>Email</th>
          <th style={thStyle}>Status</th>
          <th style={thStyle}>Action</th>
        </tr>
      </thead>

      <tbody>
        {filtered.map(u => (
          <tr key={u.id}>
            <td style={tdStyle}>{u.name}</td>
            <td style={tdStyle}>{u.email}</td>
            <td style={tdStyle}><Badge type={u.status} /></td>
            <td style={tdStyle}>
              <div style={{display:'flex', gap:8}}>
                <button style={BTN.edit} onClick={() => setEditingUser(u)}>Edit</button>
                <button style={BTN.danger} onClick={() => deleteUser(u.id)}>Delete</button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {editingUser && (
      <div style={{
        position:'fixed',
        top:0,left:0,right:0,bottom:0,
        background:'rgba(0,0,0,0.3)',
        display:'flex',
        alignItems:'center',
        justifyContent:'center'
      }}>
        <div style={{
          background:'#fff',
          padding:20,
          borderRadius:12,
          width:300
        }}>
          <h3 style={{marginBottom:10}}>Edit User</h3>

          <input
            style={{...inputStyle, width:'100%', marginBottom:10}}
            value={editingUser.name}
            onChange={e=>setEditingUser({...editingUser,name:e.target.value})}
          />

      <div style={{position:'relative', marginBottom:14}}>
        <input
           style={{
             ...inputStyle,
             width:'100%',
             border: editEmailError ? '1px solid #e53e3e' : inputStyle.border
                    }}
           value={editingUser.email}
               onChange={e=>{
                       setEditingUser({...editingUser,email:e.target.value})
                       setEditEmailError('')
               }}
  />

  {editEmailError && (
    <span style={{
      top:'100%',
      left:0,
      color:'#e53e3e',
      fontSize:11,
      marginTop:8,
      marginBottom:6,    }}>
      {editEmailError}
      
    </span>
  )}
          </div>

          <div style={{display:'flex', gap:8, marginTop:18}}>
            <button style={BTN.primary} onClick={saveEdit}>Save</button>
            <button style={BTN.danger} onClick={()=>setEditingUser(null)}>Cancel</button>
          </div>
        </div>
      </div>
    )}

  </div>
)
}

function Transactions() {
  return null
}

function Categories() {
  return null
}

function Reports() {
  return null
}

function Settings() {
  return null
}

// Page mapping
const PAGES = { dashboard:<Dashboard/>, users:<Users/>, transactions:<Transactions/>, categories:<Categories/>, reports:<Reports/>, settings:<Settings/> }

// Login component
function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [mode, setMode] = useState('login') // login | signup | reset

  const inputStyle = {
    width:'100%',
    padding:'8px 12px',
    border:'1px solid #e2e8f0',
    borderRadius:8,
    fontSize:13,
    outline:'none',
    marginBottom:12
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const phoneRegex = /^[0-9]+$/

  const handleLogin = () => {
    if (!email || !password) {
      setError('Please fill all fields')
      return
    }

    if (password !== '1234') {
      setError('Wrong password')
      return
    }

    localStorage.setItem('adminAuth','true')
    onLogin()
  }

  return (
    <div style={{
      height:'100vh',
      display:'flex',
      justifyContent:'center',
      alignItems:'center',
      background:'#f4f6f9'
    }}>
      <div style={{
        background:'#fff',
        padding:30,
        borderRadius:12,
        width:320,
        border:'1px solid #e8ecf0'
      }}>
        
        {/* TITLE */}
        <div style={{fontSize:18,fontWeight:600,marginBottom:6}}>
          {mode === 'login' && 'Admin Login'}
          {mode === 'signup' && 'Create Account'}
          {mode === 'reset' && 'Reset Password'}
        </div>

        <div style={{fontSize:12,color:'#718096',marginBottom:16}}>
          {mode === 'login' && 'Enter your credentials'}
          {mode === 'signup' && 'Create a new admin account'}
          {mode === 'reset' && 'Enter your email to reset password'}
        </div>

        {/* SIGNUP EXTRA */}
        {mode === 'signup' && (
          <>
            <input
              style={inputStyle}
              placeholder="Full Name"
              value={name}
              onChange={e=>setName(e.target.value)}
            />

            <input
              style={inputStyle}
              placeholder="Username"
              value={username}
              onChange={e=>setUsername(e.target.value)}
            />

            <input
              style={{
                ...inputStyle,
                border: error === 'Phone must be numbers only'
                  ? '1px solid #e53e3e'
                  : inputStyle.border
              }}
              placeholder="Phone Number"
              value={phone}
              onChange={e=>{
                setPhone(e.target.value)
                setError('')
              }}
            />
          </>
        )}

        <input
          style={{
            ...inputStyle,
            border: error === 'Invalid email format'
              ? '1px solid #e53e3e'
              : inputStyle.border
          }}
          placeholder="Email"
          value={email}
          onChange={e=>{
            setEmail(e.target.value)
            setError('')
          }}
        />

        {mode !== 'reset' && (
          <>
            <input
              type="password"
              style={inputStyle}
              placeholder="Password"
              value={password}
              onChange={e=>{
                setPassword(e.target.value)
                setError('')
              }}
            />

            {mode === 'signup' && (
              <input
                type="password"
                style={inputStyle}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={e=>setConfirmPassword(e.target.value)}
              />
            )}
          </>
        )}

        {error && (
          <div style={{color:'#e53e3e',fontSize:12,marginBottom:10}}>
            {error}
          </div>
        )}

        <button
          style={{...BTN.primary, width:'100%', marginBottom:10}}
          onClick={()=>{
            if (mode === 'login') {
              handleLogin()
              return
            }

            if (mode === 'signup') {
              if (!name || !username || !phone || !email || !password || !confirmPassword) {
                setError('Please fill all fields')
                return
              }

              if (!phoneRegex.test(phone)) {
                setError('Phone must be numbers only')
                return
              }

              if (!emailRegex.test(email)) {
                setError('Invalid email format')
                return
              }

              if (password !== confirmPassword) {
                setError('Passwords do not match')
                return
              }

              alert('Account created (demo only)')
              setMode('login')
              return
            }

            if (mode === 'reset') {
              if (!email) {
                setError('Enter your email')
                return
              }

              alert('Password reset link sent (demo)')
              setMode('login')
            }
          }}
        >
          {mode === 'login' && 'Login'}
          {mode === 'signup' && 'Sign Up'}
          {mode === 'reset' && 'Send Reset Link'}
        </button>

        <div style={{display:'flex',gap:8,justifyContent:'space-between',alignItems:'center'}}>

          {mode === 'login' && (
            <>
              <button
                style={{...BTN.edit, width:'50%'}}
                onClick={()=>setMode('signup')}
              >
                Sign Up
              </button>

              <span
                style={{fontSize:12,color:'#2b6cb0',cursor:'pointer'}}
                onClick={()=>setMode('reset')}
              >
                Forgot password?
              </span>
            </>
          )}

          {mode !== 'login' && (
 <button
  style={{
    ...BTN.edit,
    width:'100%',
    marginTop:6
  }}
  onClick={()=>setMode('login')}
>
  Back to login
</button>
          )}

        </div>

      </div>
    </div>
  )
}


// Main App
export default function App() {
  const [page,setPage]=useState('dashboard')

    // Check auth from localStorage
  const [isAuth,setIsAuth]=useState(
    localStorage.getItem('adminAuth') === 'true'
  )

  const handleLogin = () => setIsAuth(true)

  const logout = () => {
    localStorage.removeItem('adminAuth')
    setIsAuth(false)
  }

  if (!isAuth) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <div style={{
      display:'flex',
      height:'100vh',
      width:'100vw',
      overflow:'hidden',
      fontFamily:'system-ui, sans-serif',
      background:'#f4f6f9',
      color:'#1a1a2e'
    }}>

      <aside style={{
        width:220,
        background:'#1a1a2e',
        color:'#fff',
        display:'flex',
        flexDirection:'column'
      }}>
        
        <div style={{padding:'20px',borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
          <div style={{fontSize:16,fontWeight:600}}>FinanceFlow</div>
          <div style={{fontSize:11,opacity:0.6}}>Admin Panel</div>
        </div>

        {NAV.map(item=>(
          <div key={item.id}>
            {item.section && (
              <div style={{
                fontSize:10,
                opacity:0.4,
                padding:'16px 20px 6px',
                textTransform:'uppercase'
              }}>
                {item.section}
              </div>
            )}

            <div
              onClick={()=>setPage(item.id)}
              style={{
                padding:'11px 20px',
                cursor:'pointer',
                color:page===item.id?'#63b3ed':'rgba(255,255,255,0.65)',
                background:page===item.id?'rgba(99,179,237,0.15)':'transparent'
              }}
            >
              {item.label}
            </div>
          </div>
        ))}

        {/* LOGOUT */}
        <div style={{marginTop:'auto', padding:20}}>
          <button style={{...BTN.danger, width:'100%'}} onClick={logout}>
            Logout
          </button>
        </div>

      </aside>

      <div style={{flex:1,display:'flex',flexDirection:'column'}}>
        
        <div style={{
          background:'#fff',
          borderBottom:'1px solid #e8ecf0',
          padding:'0 24px',
          height:56,
          display:'flex',
          alignItems:'center',
          justifyContent:'space-between'
        }}>
          <span style={{fontWeight:600}}>
            {PAGE_TITLES[page]}
          </span>
        </div>

        <div style={{padding:24,flex:1,overflowY:'auto'}}>
          {PAGES[page]}
        </div>

      </div>

    </div>
  )
}
