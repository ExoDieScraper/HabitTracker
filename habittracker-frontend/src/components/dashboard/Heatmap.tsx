type Props = {
  heatmapData: {
    day: string;
    completed: boolean;
  }[];
};

export default function Heatmap({ heatmapData }: Props) {
  return (
    <div style={{ marginBottom: "30px" }}>
      <div style={{ display: "flex", marginBottom: "12px" }}>
        Last 7 Days
      </div>

      <div
        style={{
          display: "flex",
          gap: "8px",
        }}
      >
        {heatmapData.map((d) => {
          const label = new Date(d.day).toLocaleDateString("en-US", {
            weekday: "short",
          });

          return (
            <div
              key={d.day}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span style={{ fontSize: "12px", color: "#aaa" }}>
                {label}
              </span>

              <div
                title={d.day}
                style={{
                  width: 28,
                  height: 28,
                  backgroundColor: d.completed ? "#22c55e" : "#333",
                  borderRadius: "6px",
                  border: "1px solid #444",
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
