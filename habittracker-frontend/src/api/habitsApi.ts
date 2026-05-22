export type Habit = {
  id: number;
  name: string;
  description?: string;
  streak: number;
  createdAt: string;
};

const BASE_URL = import.meta.env.VITE_API_URL

export async function getHabits(): Promise<Habit[]> {
  const response = await fetch(`{BASE_URL}/api/habits`);
  return await response.json();
}
