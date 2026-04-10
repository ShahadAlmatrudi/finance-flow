import { useState, useEffect } from 'react'

const NAV = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'users', label: 'Users' },
  { id: 'transactions', label: 'Transactions' },
  { id: 'categories', label: 'Categories' },
  { id: 'reports', label: 'Reports' },
  { id: 'settings', label: 'Settings' },
]

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  users: 'User Management',
  transactions: 'Transaction Management',
  categories: 'Category Management',
  reports: 'Reports',
  settings: 'Settings',
}

// ---------- UI HELPERS ----------
function Badge({ text }) {
  return (
    <span style={{
      padding:'3px 10px',
      borderRadius:20,
      fontSize:11,
      background:'#edf2f7'
    }}>
      {text}
    </span>
  )
}

// ---------- DASHBOARD ----------
function Dashboard() {
  return (
    <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>
      <div style={card}>Total Users: 120</div>
      <div style={card}>Transactions: 340</div>
      <div style={card}>Reports Generated: 12</div>
    </div>
  )
}

const card = {
  background:'#fff',
  padding:20,
  borderRadius:10,
  border:'1px solid #e2e8f0'
}

// ---------- USERS ----------
function Users() {
  const [users,setUsers] = useState([])
  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const [search,setSearch] = useState('')
  const [editing,setEditing] = useState(null)

  useEffect(()=>{
    const saved = localStorage.getItem('users')
    if (saved) setUsers(JSON.parse(saved))
  },[])

  useEffect(()=>{
    localStorage.setItem('users', JSON.stringify(users))
  },[users])

  const addUser = () => {
    if (!name || !email) return
    setUsers([...users,{id:Date.now(),name,email,status:'Active'}])
    setName('')
    setEmail('')
  }

  const deleteUser = (id) => {
    setUsers(users.filter(u=>u.id!==id))
  }

  const saveEdit = () => {
    setUsers(users.map(u=>u.id===editing.id?editing:u))
    setEditing(null)
  }

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{background:'#fff',padding:16,borderRadius:10}}>

      {/* ADD */}
      <div style={{display:'flex',gap:8,marginBottom:10}}>
        <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <button onClick={addUser}>Add</button>
      </div>

      {/* SEARCH */}
      <input placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} />

      {/* TABLE */}
      <table style={{width:'100%',marginTop:10}}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map(u=>(
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td><Badge text={u.status}/></td>
              <td>
                <button onClick={()=>setEditing(u)}>Edit</button>
                <button onClick={()=>deleteUser(u.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* EDIT MODAL */}
      {editing && (
        <div style={{
          position:'fixed',
          top:0,left:0,right:0,bottom:0,
          background:'rgba(0,0,0,0.3)',
          display:'flex',
          alignItems:'center',
          justifyContent:'center'
        }}>
          <div style={{background:'#fff',padding:20}}>
            <h3>Edit User</h3>
            <input
              value={editing.name}
              onChange={e=>setEditing({...editing,name:e.target.value})}
            />
            <input
              value={editing.email}
              onChange={e=>setEditing({...editing,email:e.target.value})}
            />
            <button onClick={saveEdit}>Save</button>
            <button onClick={()=>setEditing(null)}>Cancel</button>
          </div>
        </div>
      )}

    </div>
  )
}

// ---------- EMPTY PAGES ----------
function Transactions(){ return null }
function Categories(){ return null }
function Reports(){ return null }
function Settings(){ return null }

// ---------- ROUTING ----------
const PAGES = {
  dashboard:<Dashboard/>,
  users:<Users/>,
  transactions:<Transactions/>,
  categories:<Categories/>,
  reports:<Reports/>,
  settings:<Settings/>
}

// ---------- APP ----------
export default function App() {
  const [page,setPage]=useState('dashboard')

  return (
    <div style={{display:'flex',height:'100vh'}}>

      <aside style={{width:200,background:'#1a1a2e',color:'#fff'}}>
        {NAV.map(item=>(
          <div key={item.id}
            onClick={()=>setPage(item.id)}
            style={{padding:12,cursor:'pointer'}}>
            {item.label}
          </div>
        ))}
      </aside>

      <div style={{flex:1}}>
        <div style={{padding:20,fontWeight:'bold'}}>
          {PAGE_TITLES[page]}
        </div>

        <div style={{padding:20}}>
          {PAGES[page]}
        </div>
      </div>

    </div>
  )
}