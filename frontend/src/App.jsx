<<<<<<< HEAD
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import DashboardPage from "./pages/DashboardPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import BudgetPage from "./pages/BudgetPage";
import SettingsPage from "./pages/SettingsPage";

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/budget" element={<BudgetPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
=======
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
  primary: { background:'#3d3de4', color:'#fff', border:'none', padding:'6px 12px', borderRadius:6, fontSize:12, cursor:'pointer', fontWeight:500 },
  danger: { background:'#fff5f5', color:'#c53030', border:'none', padding:'6px 12px', borderRadius:6, fontSize:12, cursor:'pointer', fontWeight:500 },
  edit: { background:'#ebf8ff', color:'#2b6cb0', border:'none', padding:'6px 12px', borderRadius:6, fontSize:12, cursor:'pointer', fontWeight:500 },
  green: { background:'#1da541', color:'#ffffff', border:'none', padding:'6px 12px', borderRadius:6, fontSize:12, cursor:'pointer', fontWeight:500 },
}

const PAGE_TITLES = {
  dashboard:'Dashboard', users:'User Management',
  transactions:'Transaction Management', categories:'Category Management',
  reports:'Financial Reports & Analytics', settings:'System Settings',
}

const inputStyle = { border:'1px solid #e2e8f0', borderRadius:6, padding:'6px 10px', fontSize:13, outline:'none' }
const thStyle = { textAlign:'left', padding:'12px 16px', fontSize:12, color:'#718096', borderBottom:'1px solid #e8ecf0', background:'#f7fafc' }
const tdStyle = { padding:'13px 16px', fontSize:13, borderBottom:'1px solid #f1f5f9', color:'#2d3748' }

function Toggle({ on, onToggle }) {
  return (
    <div onClick={onToggle} style={{ width:40, height:22, borderRadius:20, background:on?'#63b3ed':'#cbd5e0', cursor:'pointer', position:'relative', transition:'background 0.2s' }}>
      <div style={{ width:18, height:18, borderRadius:'50%', background:'#fff', position:'absolute', top:2, left:on?20:2, transition:'left 0.2s' }} />
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

function Modal({ title, onClose, children }) {
  return (
    <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.35)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:999}}>
      <div style={{background:'#fff',padding:24,borderRadius:12,width:340,border:'1px solid #e8ecf0'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
          <h3 style={{fontSize:15,fontWeight:600}}>{title}</h3>
          <button onClick={onClose} style={{background:'none',border:'none',fontSize:18,cursor:'pointer',color:'#718096'}}>×</button>
        </div>
        {children}
      </div>
    </div>
  )
}

function Dashboard() { return null }
function Users() { return null }

// transactions board
const INIT_TRANSACTIONS = [
  {id:'TXN-001',user:'Alice Johnson',amount:150,type:'Income',status:'Completed',date:'2023-10-26'},
  {id:'TXN-002',user:'Bob Williams',amount:-25.5,type:'Expense',status:'Pending',date:'2023-10-26'},
  {id:'TXN-003',user:'Charlie Davis',amount:75,type:'Income',status:'Completed',date:'2023-10-25'},
  {id:'TXN-004',user:'Diana Prince',amount:-120,type:'Expense',status:'Failed',date:'2023-10-25'},
  {id:'TXN-005',user:'Eve Adams',amount:200,type:'Transfer',status:'Completed',date:'2023-10-24'},
  {id:'TXN-006',user:'Frank Green',amount:-30,type:'Expense',status:'Completed',date:'2023-10-24'},
  {id:'TXN-007',user:'Grace Hall',amount:500,type:'Income',status:'Pending',date:'2023-10-23'},
]

function Transactions() {
  const [txns,setTxns]=useState(()=>{const s=localStorage.getItem('txns');return s?JSON.parse(s):INIT_TRANSACTIONS})
  const [statusF,setStatusF]=useState('All Status')
  const [typeF,setTypeF]=useState('All Types')
  const [search,setSearch]=useState('')
  const [fromDate,setFromDate]=useState('')
  const [toDate,setToDate]=useState('')
  const [sortField,setSortField]=useState('date')
  const [sortDir,setSortDir]=useState('desc')

  useEffect(()=>{localStorage.setItem('txns',JSON.stringify(txns))},[txns])

  const handleSort=field=>{
    if(sortField===field)setSortDir(d=>d==='asc'?'desc':'asc')
    else{setSortField(field);setSortDir('asc')}
  }

  const filtered=txns
    .filter(t=>(statusF==='All Status'||t.status===statusF)&&(typeF==='All Types'||t.type===typeF))
    .filter(t=>t.user.toLowerCase().includes(search.toLowerCase())||t.id.toLowerCase().includes(search.toLowerCase()))
    .filter(t=>{
      if(fromDate&&t.date<fromDate)return false
      if(toDate&&t.date>toDate)return false
      return true
    })
    .sort((a,b)=>{
      let av=a[sortField],bv=b[sortField]
      if(sortField==='amount'){av=Number(av);bv=Number(bv)}
      if(av<bv)return sortDir==='asc'?-1:1
      if(av>bv)return sortDir==='asc'?1:-1
      return 0
    })

  const deleteTxn=id=>setTxns(txns.filter(t=>t.id!==id))
  const arrow=f=>sortField===f?(sortDir==='asc'?'↑':'↓'):'↕'
  const fmtAmt=amt=>amt>=0?`+$${amt.toFixed(2)}`:`-$${Math.abs(amt).toFixed(2)}`

  return (
    <div style={{background:'#fff',borderRadius:12,border:'1px solid #e8ecf0',overflow:'hidden'}}>
      <div style={{padding:'14px 16px',display:'flex',gap:8,borderBottom:'1px solid #e8ecf0',flexWrap:'wrap',alignItems:'center'}}>
        <input placeholder="Search user or ID…" value={search} onChange={e=>setSearch(e.target.value)} style={{...inputStyle,width:160}} />
        <select value={statusF} onChange={e=>setStatusF(e.target.value)} style={inputStyle}>
          {['All Status','Completed','Pending','Failed'].map(s=><option key={s}>{s}</option>)}
        </select>
        <select value={typeF} onChange={e=>setTypeF(e.target.value)} style={inputStyle}>
          {['All Types','Income','Expense','Transfer'].map(s=><option key={s}>{s}</option>)}
        </select>
        <div style={{display:'flex',alignItems:'center',gap:4}}>
          <span style={{fontSize:12,color:'#718096'}}>From:</span>
          <input type="date" value={fromDate} onChange={e=>setFromDate(e.target.value)} style={inputStyle} />
        </div>
        <div style={{display:'flex',alignItems:'center',gap:4}}>
          <span style={{fontSize:12,color:'#718096'}}>To:</span>
          <input type="date" value={toDate} onChange={e=>setToDate(e.target.value)} style={inputStyle} />
        </div>
      </div>

      <table style={{width:'100%',borderCollapse:'collapse'}}>
        <thead>
          <tr>
            {[['id','Transaction ID'],['user','User'],['amount','Amount'],['type','Type'],['status','Status'],['date','Date']].map(([f,l])=>(
              <th key={f} style={{...thStyle,cursor:'pointer',userSelect:'none'}} onClick={()=>handleSort(f)}>{l} {arrow(f)}</th>
            ))}
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(t=>(
            <tr key={t.id}>
              <td style={tdStyle}>{t.id}</td>
              <td style={tdStyle}>{t.user}</td>
              <td style={{...tdStyle,color:t.amount>=0?'#276749':'#c53030',fontWeight:500}}>{fmtAmt(t.amount)}</td>
              <td style={tdStyle}><Badge type={t.type}/></td>
              <td style={tdStyle}><Badge type={t.status}/></td>
              <td style={tdStyle}>{t.date}</td>
              <td style={tdStyle}><button style={BTN.danger} onClick={()=>deleteTxn(t.id)}>Delete</button></td>
            </tr>
          ))}
          {filtered.length===0&&<tr><td colSpan={7} style={{...tdStyle,textAlign:'center',color:'#a0aec0'}}>No transactions found</td></tr>}
        </tbody>
      </table>
      <div style={{padding:'10px 16px',fontSize:12,color:'#718096',borderTop:'1px solid #f1f5f9'}}>
        Showing {filtered.length} of {txns.length} transactions
      </div>
    </div>
  )
}

// categories board
const INIT_CATS = [
  {id:'CAT-001',name:'Groceries',type:'Expense',count:125},
  {id:'CAT-002',name:'Salary',type:'Income',count:12},
  {id:'CAT-003',name:'Utilities',type:'Expense',count:48},
  {id:'CAT-004',name:'Rent',type:'Expense',count:12},
  {id:'CAT-005',name:'Freelance',type:'Income',count:8},
  {id:'CAT-006',name:'Transportation',type:'Expense',count:70},
]

function Categories() {
  const [cats,setCats]=useState(()=>{const s=localStorage.getItem('cats');return s?JSON.parse(s):INIT_CATS})
  const [search,setSearch]=useState('')
  const [showAdd,setShowAdd]=useState(false)
  const [editCat,setEditCat]=useState(null)
  const [form,setForm]=useState({name:'',type:'Expense'})
  const [formError,setFormError]=useState('')
  localStorage.clear()
  useEffect(()=>{localStorage.setItem('cats',JSON.stringify(cats))},[cats])

  const addCat=()=>{
    if(!form.name.trim()){setFormError('Category name is required');return}
    if(cats.find(c=>c.name.toLowerCase()===form.name.toLowerCase())){setFormError('Category already exists');return}
    setFormError('')
    const newId=`CAT-${String(cats.length+1).padStart(3,'0')}`
    setCats([...cats,{id:newId,name:form.name.trim(),type:form.type,count:0}])
    setForm({name:'',type:'Expense'})
    setShowAdd(false)
  }

  const saveEdit=()=>{
    if(!editCat.name.trim()){setFormError('Name required');return}
    setFormError('')
    setCats(cats.map(c=>c.id===editCat.id?editCat:c))
    setEditCat(null)
  }

  const deleteCat=id=>setCats(cats.filter(c=>c.id!==id))
  const filtered=cats.filter(c=>c.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div style={{background:'#fff',borderRadius:12,border:'1px solid #e8ecf0',overflow:'hidden'}}>
      <div style={{padding:'14px 16px',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid #e8ecf0',flexWrap:'wrap',gap:8}}>
        <input placeholder="Search categories…" value={search} onChange={e=>setSearch(e.target.value)} style={{...inputStyle,width:200}} />
        <button style={BTN.primary} onClick={()=>{setShowAdd(true);setFormError('')}}>+ Add New Category</button>
      </div>
      <table style={{width:'100%',borderCollapse:'collapse'}}>
        <thead><tr>{['Category ID','Category Name','Type','Associated Transactions','Actions'].map(h=><th key={h} style={thStyle}>{h}</th>)}</tr></thead>
        <tbody>
          {filtered.map(c=>(
            <tr key={c.id}>
              <td style={tdStyle}>{c.id}</td>
              <td style={tdStyle}>{c.name}</td>
              <td style={tdStyle}><Badge type={c.type}/></td>
              <td style={tdStyle}>{c.count}</td>
              <td style={tdStyle}>
                <div style={{display:'flex',gap:8}}>
                  <button style={BTN.edit} onClick={()=>{setEditCat({...c});setFormError('')}}>Edit</button>
                  <button style={BTN.danger} onClick={()=>deleteCat(c.id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
          {filtered.length===0&&<tr><td colSpan={5} style={{...tdStyle,textAlign:'center',color:'#a0aec0'}}>No categories found</td></tr>}
        </tbody>
      </table>

      {showAdd&&(
        <Modal title="Add Category" onClose={()=>setShowAdd(false)}>
          <label style={{fontSize:12,color:'#718096',display:'block',marginBottom:4}}>Category Name</label>
          <input style={{...inputStyle,width:'100%',marginBottom:10}} placeholder="e.g. Entertainment" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
          <label style={{fontSize:12,color:'#718096',display:'block',marginBottom:4}}>Type</label>
          <select style={{...inputStyle,width:'100%',marginBottom:14}} value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
            <option>Expense</option><option>Income</option>
          </select>
          {formError&&<div style={{color:'#e53e3e',fontSize:12,marginBottom:10}}>{formError}</div>}
          <div style={{display:'flex',gap:8}}>
            <button style={BTN.primary} onClick={addCat}>Add</button>
            <button style={BTN.danger} onClick={()=>setShowAdd(false)}>Cancel</button>
          </div>
        </Modal>
      )}

      {editCat&&(
        <Modal title="Edit Category" onClose={()=>setEditCat(null)}>
          <label style={{fontSize:12,color:'#718096',display:'block',marginBottom:4}}>Category Name</label>
          <input style={{...inputStyle,width:'100%',marginBottom:10}} value={editCat.name} onChange={e=>setEditCat({...editCat,name:e.target.value})} />
          <label style={{fontSize:12,color:'#718096',display:'block',marginBottom:4}}>Type</label>
          <select style={{...inputStyle,width:'100%',marginBottom:14}} value={editCat.type} onChange={e=>setEditCat({...editCat,type:e.target.value})}>
            <option>Expense</option><option>Income</option>
          </select>
          {formError&&<div style={{color:'#e53e3e',fontSize:12,marginBottom:10}}>{formError}</div>}
          <div style={{display:'flex',gap:8}}>
            <button style={BTN.primary} onClick={saveEdit}>Save</button>
            <button style={BTN.danger} onClick={()=>setEditCat(null)}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  )
}

// reports board
function Reports() {
  const [txns]=useState(()=>{const s=localStorage.getItem('txns');return s?JSON.parse(s):INIT_TRANSACTIONS})
  const [fromDate,setFromDate]=useState('')
  const [toDate,setToDate]=useState('')

  const filtered=txns.filter(t=>{
    if(fromDate&&t.date<fromDate)return false
    if(toDate&&t.date>toDate)return false
    return true
  })

  const exportCSV=()=>{
    const headers=['ID','User','Amount','Type','Status','Date']
    const rows=filtered.map(t=>[t.id,t.user,t.amount,t.type,t.status,t.date])
    const csv=[headers,...rows].map(r=>r.join(',')).join('\n')
    const blob=new Blob([csv],{type:'text/csv'})
    const url=URL.createObjectURL(blob)
    const a=document.createElement('a')
    a.href=url;a.download='transactions_report.csv';a.click()
    URL.revokeObjectURL(url)
  }

  const months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const monthlyIncome=Array(12).fill(0)
  const monthlyExpense=Array(12).fill(0)
  txns.forEach(t=>{
    const m=new Date(t.date).getMonth()
    if(isNaN(m))return
    if(t.amount>0)monthlyIncome[m]+=t.amount
    else monthlyExpense[m]+=Math.abs(t.amount)
  })
  const maxVal=Math.max(...monthlyIncome,...monthlyExpense,1)

  // top 5 spending categories from expense transactions
  const catSpend={}
  filtered.filter(t=>t.amount<0).forEach(t=>{
    catSpend[t.type]=(catSpend[t.type]||0)+Math.abs(t.amount)
  })
const top5=[
  {name:'Groceries',pct:'25%',color:'#3b82f6'},     
  {name:'Rent',pct:'20%',color:'#ef4444'},         
  {name:'Utilities',pct:'15%',color:'#f59e0b'},     
  {name:'Transportation',pct:'10%',color:'#10b981'},
  {name:'Dining Out',pct:'8%',color:'#6366f1'},   
  {name:'Other',pct:'22%',color:'#9ca3af'},      
]
  const card={background:'#fff',borderRadius:12,padding:20,border:'1px solid #e8ecf0',marginBottom:16}

  return (
    <div>
      <div style={{...card,display:'flex',gap:10,flexWrap:'wrap',alignItems:'center',marginBottom:16}}>
        <div style={{display:'flex',alignItems:'center',gap:6}}>
          <label style={{fontSize:12,color:'#718096'}}>From:</label>
          <input type="date" value={fromDate} onChange={e=>setFromDate(e.target.value)} style={inputStyle} />
        </div>
        <div style={{display:'flex',alignItems:'center',gap:6}}>
          <label style={{fontSize:12,color:'#718096'}}>To:</label>
          <input type="date" value={toDate} onChange={e=>setToDate(e.target.value)} style={inputStyle} />
        </div>
        <select style={inputStyle}><option>All Reports</option></select>
        <button style={{...BTN.green,padding:'7px 14px',fontSize:13}} onClick={exportCSV}> Export to CSV</button>
        <button style={{...BTN.primary,padding:'7px 14px',fontSize:13}} onClick={()=>{setFromDate('');setToDate('')}}>↺ Refresh</button>
      </div>


      <div style={{display:'grid',gridTemplateColumns:'1.6fr 1fr',gap:16,marginBottom:16}}>
        <div style={card}>
          <div style={{fontSize:14,fontWeight:600,marginBottom:16}}>Monthly Income vs. Expense</div>
          <div style={{display:'flex',alignItems:'flex-end',gap:4,height:130,marginBottom:8}}>
            {months.map((m,i)=>(
              <div key={m} style={{flex:1,display:'flex',gap:2,alignItems:'flex-end'}}>
                <div style={{
  flex:1,
  height:`${(monthlyIncome[i]/maxVal)*100}%`,
  background:'#22c55e', 
  borderRadius:'3px 3px 0 0',
  minHeight:monthlyIncome[i]>0?4:0
}} />

<div style={{
  flex:1,
  height:`${(monthlyExpense[i]/maxVal)*100}%`,
  background:'#ef4444', 
  borderRadius:'3px 3px 0 0',
  minHeight:monthlyExpense[i]>0?4:0
}} />             </div>
            ))}
          </div>
          <div style={{display:'flex',gap:8,marginBottom:6}}>
            {months.map(m=><div key={m} style={{flex:1,fontSize:9,color:'#a0aec0',textAlign:'center'}}>{m}</div>)}
          </div>
<div style={{
  display:'flex',
  justifyContent:'center',
  alignItems:'center',
  gap:30,
  marginTop:12
}}>
  <div style={{display:'flex',alignItems:'center',gap:6}}>
    <span style={{width:12,height:12,background:'#22c55e',borderRadius:3}} />
    <span style={{fontSize:13,fontWeight:500,color:'#4a5568'}}>Income</span>
  </div>

  <div style={{display:'flex',alignItems:'center',gap:6}}>
    <span style={{width:12,height:12,background:'#ef4444',borderRadius:3}} />
    <span style={{fontSize:13,fontWeight:500,color:'#4a5568'}}>Expense</span>
  </div>
</div>
           </div>

        <div style={card}>
          <div style={{fontSize:14,fontWeight:600,marginBottom:16}}>Top 5 Spending Categories</div>
          {top5.map(({name,pct,color})=>(
            <div key={name} style={{display:'flex',alignItems:'center',gap:8,fontSize:13,color:'#4a5568',marginBottom:10}}>
<span style={{
  width:12,
  height:12,
  borderRadius:4,
  background:color,
  display:'inline-block'
}} />              <span style={{flex:1}}>{name}</span>
              <span style={{fontWeight:600,color:'#1a1a2e'}}>{pct}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{...card,padding:0,overflow:'hidden'}}>
        <div style={{padding:'14px 16px',borderBottom:'1px solid #e8ecf0',fontSize:14,fontWeight:600}}>
          Recent User Activity
        </div>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead><tr>{['User ID','Username','Action'].map(h=><th key={h} style={thStyle}>{h}</th>)}</tr></thead>
          <tbody>
            {[
              ['USR-001','Alice Johnson','Logged in'],
              ['USR-002','Bob Williams','Added new transaction'],
              ['USR-001','Alice Johnson','Updated profile'],
              ['USR-003','Charlie Davis','Viewed reports'],
              ['USR-002','Bob Williams','Logged out'],
            ].map(([id,u,a])=>(
              <tr key={id+a}><td style={tdStyle}>{id}</td><td style={tdStyle}>{u}</td><td style={tdStyle}>{a}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// settings board
function Settings() {
  const [saved,setSaved]=useState({
    general:'', user:'', notif:'', security:''
  })

  const [error,setError]=useState({
    general:'', user:'', notif:'', security:''
  })

  const [general,setGeneral]=useState(()=>{const s=localStorage.getItem('settings_general');return s?JSON.parse(s):{appName:'',currency:'SAR'}})
  const [userSettings,setUserSettings]=useState(()=>{const s=localStorage.getItem('settings_user');return s?JSON.parse(s):{allowReg:true,defaultRole:'Standard User',requireEmail:false}})
  const [notif,setNotif]=useState(()=>{const s=localStorage.getItem('settings_notif');return s?JSON.parse(s):{email:true,sms:false,digest:'Daily'}})
  const [security,setSecurity]=useState(()=>{const s=localStorage.getItem('settings_security');return s?JSON.parse(s):{tfa:true,minPass:8,timeout:60}})

  const showMsg=(section, ok, msg)=>{
    if(ok){
      setSaved(s=>({...s,[section]:msg}))
      setError(e=>({...e,[section]:''}))
      setTimeout(()=>setSaved(s=>({...s,[section]:''})),3000)
    }else{
      setError(e=>({...e,[section]:msg}))
      setSaved(s=>({...s,[section]:''}))
      setTimeout(()=>setError(e=>({...e,[section]:''})),3000)
    }
  }

  const saveGeneral=()=>{
    if(!general.appName.trim()){showMsg('general',false,'Application Name is required');return}
    localStorage.setItem('settings_general',JSON.stringify(general))
    showMsg('general',true,'General settings saved')
  }

  const saveUser=()=>{
    localStorage.setItem('settings_user',JSON.stringify(userSettings))
    showMsg('user',true,'User registration settings saved')
  }

  const saveNotif=()=>{
    localStorage.setItem('settings_notif',JSON.stringify(notif))
    showMsg('notif',true,'Notification settings saved')
  }

  const saveSecurity=()=>{
    if(!security.minPass||security.minPass<1){showMsg('security',false,'Minimum Password Length is required');return}
    if(!security.timeout||security.timeout<1){showMsg('security',false,'Session Timeout is required');return}
    localStorage.setItem('settings_security',JSON.stringify(security))
    showMsg('security',true,'Security settings saved')
  }

  const inp={width:'100%',padding:'8px 12px',border:'1px solid #e2e8f0',borderRadius:8,fontSize:13,outline:'none',marginBottom:14,boxSizing:'border-box'}
  const btn={background:'#3434e7',color:'#fff',border:'none',padding:'8px 16px',borderRadius:8,fontSize:13,cursor:'pointer',fontWeight:500,marginTop:6}
  const row={display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:'1px solid #f7fafc'}
  const sectionTitle={fontSize:14,fontWeight:600,marginBottom:14,paddingBottom:10,borderBottom:'1px solid #e8ecf0'}
  const card={background:'#fff',borderRadius:12,padding:20,border:'1px solid #e8ecf0',marginBottom:16}

  const successStyle = {
    background:'#f0fff4',
    border:'1px solid #9ae6b4',
    color:'#276749',
    padding:'10px 16px',
    borderRadius:8,
    marginTop:10,
    fontSize:13
  }

  const errorStyle = {
    background:'#fff5f5',
    border:'1px solid #feb2b2',
    color:'#c53030',
    padding:'10px 16px',
    borderRadius:8,
    marginTop:10,
    fontSize:13
  }

  return (
    <div>

      <div style={card}>
        <div style={sectionTitle}>General Settings</div>
        <label style={{fontSize:12,color:'#718096',display:'block',marginBottom:6}}>
          Application Name <span style={{color:'#e53e3e'}}>*</span>
        </label>
        <input
          style={{...inp,border:!general.appName.trim()?'1px solid #fed7d7':inp.border}}
          placeholder="e.g. MoneyPlan"
          value={general.appName}
          onChange={e=>setGeneral({...general,appName:e.target.value})}
        />
        {!general.appName.trim()&&<div style={{color:'#e53e3e',fontSize:11,marginTop:-10,marginBottom:10}}>Required</div>}

        <label style={{fontSize:12,color:'#718096',display:'block',marginBottom:6}}>Default Currency</label>
        <select style={inp} value={general.currency} onChange={e=>setGeneral({...general,currency:e.target.value})}>
          <option value="SAR">SAR (ريال)</option>
          <option value="USD">USD ($)</option>
          <option value="EUR">EUR (€)</option>
        </select>

        <button style={btn} onClick={saveGeneral}>Save General Settings</button>

        {saved.general && <div style={successStyle}>✓ {saved.general}</div>}
        {error.general && <div style={errorStyle}>✕ {error.general}</div>}
      </div>

      {/* User Settings */}
      <div style={card}>
        <div style={sectionTitle}>User Management Settings</div>
        <div style={row}>
          <span style={{fontSize:13}}>Allow New User Registration</span>
          <Toggle on={userSettings.allowReg} onToggle={()=>setUserSettings({...userSettings,allowReg:!userSettings.allowReg})} />
        </div>

        <label style={{fontSize:12,color:'#718096',display:'block',margin:'12px 0 6px'}}>Default User Role</label>
        <select style={inp} value={userSettings.defaultRole} onChange={e=>setUserSettings({...userSettings,defaultRole:e.target.value})}>
          <option>Standard User</option>
          <option>Admin</option>
        </select>

        <div style={row}>
          <span style={{fontSize:13}}>Require Email Verification</span>
          <Toggle on={userSettings.requireEmail} onToggle={()=>setUserSettings({...userSettings,requireEmail:!userSettings.requireEmail})} />
        </div>

        <button style={btn} onClick={saveUser}>Save User Settings</button>

        {saved.user && <div style={successStyle}>✓ {saved.user}</div>}
        {error.user && <div style={errorStyle}>✕ {error.user}</div>}
      </div>

      {/* Notification Settings */}
      <div style={card}>
        <div style={sectionTitle}>Notification Settings</div>
        <div style={row}>
          <span style={{fontSize:13}}>Enable Email Notifications</span>
          <Toggle on={notif.email} onToggle={()=>setNotif({...notif,email:!notif.email})} />
        </div>

        <div style={row}>
          <span style={{fontSize:13}}>Enable SMS Notifications</span>
          <Toggle on={notif.sms} onToggle={()=>setNotif({...notif,sms:!notif.sms})} />
        </div>

        <label style={{fontSize:12,color:'#718096',display:'block',margin:'12px 0 6px'}}>Daily Digest Email</label>
        <select style={inp} value={notif.digest} onChange={e=>setNotif({...notif,digest:e.target.value})}>
          <option>Daily</option>
          <option>Weekly</option>
          <option>Never</option>
        </select>

        <button style={btn} onClick={saveNotif}>Save Notification Settings</button>

        {saved.notif && <div style={successStyle}>✓ {saved.notif}</div>}
        {error.notif && <div style={errorStyle}>✕ {error.notif}</div>}
      </div>

      {/* Security Settings */}
      <div style={card}>
        <div style={sectionTitle}>Security Settings</div>
        <div style={row}>
          <span style={{fontSize:13}}>Enable Two-Factor Auth (2FA)</span>
          <Toggle on={security.tfa} onToggle={()=>setSecurity({...security,tfa:!security.tfa})} />
        </div>

        <label style={{fontSize:12,color:'#718096',display:'block',margin:'12px 0 6px'}}>
          Minimum Password Length <span style={{color:'#e53e3e'}}>*</span>
        </label>
        <input
          type="number"
          min={1}
          max={32}
          style={{...inp,border:(!security.minPass||security.minPass<1)?'1px solid #fed7d7':inp.border}}
          value={security.minPass}
          onChange={e=>setSecurity({...security,minPass:Number(e.target.value)})}
        />
        {(!security.minPass||security.minPass<1)&&<div style={{color:'#e53e3e',fontSize:11,marginTop:-10,marginBottom:10}}>Required</div>}

        <label style={{fontSize:12,color:'#718096',display:'block',marginBottom:6}}>
          Session Timeout (minutes) <span style={{color:'#e53e3e'}}>*</span>
        </label>
        <input
          type="number"
          min={1}
          style={{...inp,border:(!security.timeout||security.timeout<1)?'1px solid #fed7d7':inp.border}}
          value={security.timeout}
          onChange={e=>setSecurity({...security,timeout:Number(e.target.value)})}
        />
        {(!security.timeout||security.timeout<1)&&<div style={{color:'#e53e3e',fontSize:11,marginTop:-10,marginBottom:10}}>Required</div>}

        <button style={btn} onClick={saveSecurity}>Save Security Settings</button>

        {saved.security && <div style={successStyle}>✓ {saved.security}</div>}
        {error.security && <div style={errorStyle}>✕ {error.security}</div>}
      </div>

    </div>
  )
}
const PAGES = { dashboard:<Dashboard/>, users:<Users/>, transactions:<Transactions/>, categories:<Categories/>, reports:<Reports/>, settings:<Settings/> }

export default function App() {
  const [page,setPage]=useState('dashboard')
  return (
    <div style={{display:'flex',height:'100vh',fontFamily:'system-ui,sans-serif',background:'#f4f6f9',color:'#1a1a2e'}}>
      <aside style={{width:220,minWidth:220,background:'#1a1a2e',color:'#fff',display:'flex',flexDirection:'column'}}>
        <div style={{padding:'20px 20px 16px',borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
          <div style={{fontSize:16,fontWeight:600,color:'#fff'}}>FinanceFlow</div>
          <div style={{fontSize:11,color:'rgba(255,255,255,0.4)',marginTop:2}}>Admin Panel</div>
        </div>
        {NAV.map(item=>(
          <div key={item.id}>
            {item.section&&<div style={{fontSize:10,color:'rgba(255,255,255,0.25)',padding:'16px 20px 6px',letterSpacing:'0.8px',textTransform:'uppercase'}}>{item.section}</div>}
            <div onClick={()=>setPage(item.id)} style={{display:'flex',alignItems:'center',gap:10,padding:'11px 20px',fontSize:13,color:page===item.id?'#63b3ed':'rgba(255,255,255,0.65)',cursor:'pointer',borderLeft:`3px solid ${page===item.id?'#63b3ed':'transparent'}`,background:page===item.id?'rgba(99,179,237,0.15)':'transparent'}}>
              <span style={{fontSize:15,width:18,textAlign:'center'}}>{item.icon}</span>{item.label}
            </div>
          </div>
        ))}
      </aside>
      <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'auto'}}>
        <div style={{background:'#fff',borderBottom:'1px solid #e8ecf0',padding:'0 24px',height:56,display:'flex',alignItems:'center'}}>
          <span style={{fontSize:16,fontWeight:600}}>{PAGE_TITLES[page]}</span>
        </div>
        <div style={{padding:24,flex:1,overflow:'auto'}}>{PAGES[page]}</div>
      </div>
    </div>
  )
}
>>>>>>> 1bf2e26e0d79a13d3b396cd457f5feca06c7922c
