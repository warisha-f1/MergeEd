type TrainingCardProps = {
  title: string;
  content: string;
  language: string;
  approved: boolean;
  onApprove: () => void;
};

export default function TrainingCard({
  title,
  content,
  language,
  approved,
  onApprove,
}: TrainingCardProps) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "16px",
        background: "white",
        boxShadow: "0px 2px 6px rgba(0,0,0,0.05)",
      }}
    >
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      <p style={{ color: "#411111" }}>{content}</p>
      <p>
        <b>Language:</b> {language}
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "12px",
        }}
      >
        <span style={{ color: approved ? "green" : "orange", fontWeight: "bold" }}>
          {approved ? "Approved" : "Pending Review"}
        </span>

        {!approved && (
          <button
            onClick={onApprove}
            style={{
              background: "#1F3A5F",
              color: "white",
              border: "none",
              padding: "8px 14px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Approve & Deploy
          </button>
        )}
      </div>
    </div>
  );
}