export default function Navbar() {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "14px 20px",
        background: "#1F3A5F",
        color: "white",
      }}
    >
      <div>
        <h2 style={{ margin: 0 }}>MergeEd</h2>
        <small>AI‑Driven Teacher Training Platform</small>
      </div>

      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        <span>
          Role: <b>DIET Admin</b>
        </span>

        <select style={{ padding: "6px", borderRadius: "4px", color: "black" }}>
          <option>English</option>
          <option>Hindi</option>
          <option>Telugu</option>
          <option>Tamil</option>
        </select>

        <button
          style={{
            background: "#4CAF8E",
            border: "none",
            padding: "8px 12px",
            color: "white",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}