import {
  dashboardCards,
  recentTransactions,
  monthOverview,
} from "../data/mockData";
import { FaWallet, FaCreditCard, FaPiggyBank, FaBell } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";

export default function DashboardPage() {
  const getCardIcon = (type) => {
    if (type === "cash") return <FaWallet className="finance-card-icon purple-icon" />;
    if (type === "card") return <FaCreditCard className="finance-card-icon red-icon" />;
    return <FaPiggyBank className="finance-card-icon green-icon" />;
  };

  return (
    <main className="page-content">
      <div className="dashboard-topbar">
        <div>
          <h1 className="page-title">Welcome back, Ola👋</h1>
          <h2 className="dashboard-subtitle">Your finances</h2>
        </div>

        <div className="dashboard-actions">
          <div className="dashboard-search">
            <IoSearchOutline className="search-icon" />
            <input type="text" placeholder="Search accounts..." />
          </div>

          <FaBell className="dashboard-bell" />
        </div>
      </div>

      <section className="dashboard-cards-grid">
        {dashboardCards.map((card) => (
          <div key={card.id} className="card finance-card">
            <div className="finance-card-top">
              <div>
                <h3>{card.title}</h3>
                <p className="finance-card-subtitle">{card.subtitle}</p>
              </div>

              {getCardIcon(card.iconType)}
            </div>

            <p className="finance-card-label">{card.balanceLabel}</p>
            <p className="finance-card-amount">${card.amount.toLocaleString()}</p>

            <button className="primary-full-btn finance-btn">View Details</button>
          </div>
        ))}
      </section>

      <section className="card recent-transactions-card">
        <h3 className="dashboard-section-title">Recent Transactions</h3>

        <div className="recent-list">
          {recentTransactions.map((item) => (
            <div key={item.id} className="recent-item">
              <div>
                <p className="recent-title">{item.title}</p>
                <p className="recent-subtitle">{item.subtitle}</p>
              </div>

              <p className={item.amount < 0 ? "amount-negative" : "amount-positive"}>
                {item.amount < 0 ? "-" : "+"}${Math.abs(item.amount).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="card month-overview-card">
        <h3 className="dashboard-section-title">This Month Overview</h3>

        <div className="status-list">
          {monthOverview.map((item) => (
            <div key={item.id} className="status-item">
              <div className="status-row">
                <span>{item.label}</span>
              </div>

              <div className="progress-bar">
                <div
                  className={`progress-fill ${item.color}`}
                  style={{ width: `${item.percent}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}