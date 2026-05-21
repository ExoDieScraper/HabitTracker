type Props = {
  heatmapData: {
    day: string;
    completed: boolean;
  }[];
};

export default function Heatmap({ heatmapData }: Props) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-6 flex flex-col items-center">

      <p className="text-sm text-zinc-400 mb-3">
        Last 7 Days
      </p>

      <div className="flex gap-3">
        {heatmapData.map((d) => {
          const label = new Date(d.day).toLocaleDateString("en-US", {
            weekday: "short",
          });

          return (
            <div
              key={d.day}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-xs text-zinc-500">
                {label}
              </span>

              <div
                title={d.day}
                className={`
                  w-7 h-7 rounded-md border border-zinc-700
                  transition
                  ${d.completed ? "bg-green-500" : "bg-zinc-800"}
                `}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
