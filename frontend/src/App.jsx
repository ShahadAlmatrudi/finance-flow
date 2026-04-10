import { useState } from 'react'

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

const PAGES = {
  dashboard: <div />,
  users: <div />,
  transactions: <div />,
  categories: <div />,
  reports: <div />,
  settings: <div />
}

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