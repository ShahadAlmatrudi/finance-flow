import { useState, useEffect } from 'react'

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: '▦', section: 'Main' },
  { id: 'users', label: 'Users', icon: '👤', section: 'Management' },
  { id: 'transactions', label: 'Transactions', icon: '↕', section: null },
  { id: 'categories', label: 'Categories', icon: '◈', section: null },
  { id: 'reports', label: 'Reports', icon: '▤', section: 'Reports' },
  { id: 'settings', label: 'Settings', icon: '⚙', section: 'System' },
]

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

const inputStyle = {
  border:'1px solid #e2e8f0',
  borderRadius:6,
  padding:'6px 10px',
  fontSize:13,
  outline:'none'
}

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


const PAGE_TITLES = {
  dashboard: 'Dashboard', users: 'User Management',
  transactions: 'Transaction Management', categories: 'Category Management',
  reports: 'Financial Reports & Analytics', settings: 'System Settings',
}

function Toggle({ on, onToggle }) {
  return (
    <div onClick={onToggle} style={{ width:40, height:22, borderRadius:20, background: on?'#63b3ed':'#cbd5e0', cursor:'pointer', position:'relative', transition:'background 0.2s' }}>
      <div style={{ width:18, height:18, borderRadius:'50%', background:'#fff', position:'absolute', top:2, left: on?20:2, transition:'left 0.2s' }} />
    </div>
  )
}

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

function StatCard({ label, value, change, down }) {
  return (
    <div style={{background:'#fff',borderRadius:12,padding:20,border:'1px solid #e8ecf0'}}>
      <div style={{fontSize:12,color:'#718096',marginBottom:6,fontWeight:500}}>{label}</div>
      <div style={{fontSize:28,fontWeight:700,color:'#1a1a2e',marginBottom:4}}>{value}</div>
      <div style={{fontSize:12,color:down?'#fc8181':'#48bb78'}}>{change}</div>
    </div>
  )
}

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

const DEFAULT_USERS = [
  {id:1,name:'John Doe',email:'john.doe@example.com',status:'Active',role:'User'},
  {id:2,name:'Jane Smith',email:'jane.smith@example.com',status:'Pending',role:'User'},
]

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

    {/* ADD USER */}
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
</div>    <button style={BTN.primary} onClick={addUser}>+ Add</button>
    </div>

    {/* SEARCH */}
    <div style={{padding:'0 16px 16px'}}>
      <input style={inputStyle} placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} />
    </div>

    {/* TABLE */}
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

    {/* EDIT MODAL */}
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
      position:'absolute',
      top:'100%',
      left:0,
      color:'#e53e3e',
      fontSize:11,
      marginTop:4,
      whiteSpace:'nowrap'
    }}>
      {editEmailError}
    </span>
  )}
</div>

          <div style={{display:'flex', gap:8}}>
            <button style={BTN.primary} onClick={saveEdit}>Save</button>
            <button style={BTN.danger} onClick={()=>setEditingUser(null)}>Cancel</button>
          </div>
        </div>
      </div>
    )}

  </div>
)
}


const TRANSACTIONS = [
  {id:'TXN-001',user:'Alice Johnson',amount:'+$150.00',type:'Income',status:'Completed',date:'2023-10-26'},
  {id:'TXN-002',user:'Bob Williams',amount:'-$25.50',type:'Expense',status:'Pending',date:'2023-10-26'},
  {id:'TXN-003',user:'Charlie Davis',amount:'+$75.00',type:'Income',status:'Completed',date:'2023-10-25'},
  {id:'TXN-004',user:'Diana Prince',amount:'-$120.00',type:'Expense',status:'Failed',date:'2023-10-25'},
  {id:'TXN-005',user:'Eve Adams',amount:'+$200.00',type:'Transfer',status:'Completed',date:'2023-10-24'},
]

function Transactions() {
  return null
}

const CATEGORIES = [
  {id:'CAT-001',name:'Groceries',type:'Expense',count:125},
  {id:'CAT-002',name:'Salary',type:'Income',count:12},
  {id:'CAT-003',name:'Utilities',type:'Expense',count:48},
  {id:'CAT-004',name:'Rent',type:'Expense',count:12},
  {id:'CAT-005',name:'Freelance',type:'Income',count:8},
  {id:'CAT-006',name:'Transportation',type:'Expense',count:70},
]

function Categories() {
  return null
}

function Reports() {
  return null
}

function Settings() {
  return null
}

const PAGES = { dashboard:<Dashboard/>, users:<Users/>, transactions:<Transactions/>, categories:<Categories/>, reports:<Reports/>, settings:<Settings/> }


export default function App() {
  const [page, setPage] = useState('dashboard');

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        fontFamily: 'system-ui, sans-serif',
        background: '#f4f6f9',
        color: '#1a1a2e',
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: 220,
          minWidth: 220,
          background: '#1a1a2e',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: '20px 20px 16px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 600 }}>FinanceFlow</div>
          <div
            style={{
              fontSize: 11,
              color: 'rgba(255,255,255,0.4)',
              marginTop: 2,
            }}
          >
            Admin Panel
          </div>
        </div>

        {/* Navigation */}
        {NAV.map((item) => (
          <div key={item.id}>
            {item.section && (
              <div
                style={{
                  fontSize: 10,
                  color: 'rgba(255,255,255,0.25)',
                  padding: '16px 20px 6px',
                  letterSpacing: '0.8px',
                  textTransform: 'uppercase',
                }}
              >
                {item.section}
              </div>
            )}

            <div
              onClick={() => setPage(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '11px 20px',
                fontSize: 13,
                color:
                  page === item.id
                    ? '#63b3ed'
                    : 'rgba(255,255,255,0.65)',
                cursor: 'pointer',
                borderLeft:
                  page === item.id
                    ? '3px solid #63b3ed'
                    : '3px solid transparent',
                background:
                  page === item.id
                    ? 'rgba(99,179,237,0.15)'
                    : 'transparent',
              }}
            >
              <span
                style={{
                  fontSize: 15,
                  width: 18,
                  textAlign: 'center',
                }}
              >
                {item.icon}
              </span>
              {item.label}
            </div>
          </div>
        ))}
      </aside>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Top Bar */}
        <div
          style={{
            background: '#fff',
            borderBottom: '1px solid #e8ecf0',
            padding: '0 24px',
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: 16, fontWeight: 600 }}>
            {PAGE_TITLES[page]}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Search */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: '#f4f6f9',
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                padding: '6px 12px',
              }}
            >
              <span style={{ color: '#a0aec0', fontSize: 13 }}>⌕</span>
              <input
                placeholder="Search…"
                style={{
                  border: 'none',
                  background: 'transparent',
                  fontSize: 13,
                  outline: 'none',
                  width: 180,
                }}
              />
            </div>

            {/* Avatar */}
            <span
              style={{
                background: '#1a1a2e',
                color: '#fff',
                fontSize: 11,
                fontWeight: 600,
                padding: '4px 10px',
                borderRadius: 20,
              }}
            >
              AD
            </span>
          </div>
        </div>

        {/* Page Content */}
        <div
          style={{
            padding: 24,
            flex: 1,
            overflowY: 'auto',
          }}
        >
          {PAGES[page]}
        </div>
      </div>
    </div>
  );
}
