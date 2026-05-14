export type Habit = {
  id: number;
  name: string;
  description?: string;
  streak: number;
  createdAt: string;
};

export async function getHabits(): Promise<Habit[]> {
  const response = await fetch("http://localhost:5016/api/habits");
  return await response.json();
}