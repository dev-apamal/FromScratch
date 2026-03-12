import AsyncStorage from "@react-native-async-storage/async-storage";
import { BookSessionData, SessionItem } from "@/types/sessionItem";

const SESSION_KEY_PREFIX = "session_data_";

export async function getBookSessionData(
  bookId: string,
): Promise<BookSessionData> {
  try {
    const raw = await AsyncStorage.getItem(SESSION_KEY_PREFIX + bookId);
    if (raw) return JSON.parse(raw) as BookSessionData;
  } catch {}
  return {
    bookId,
    sessions: [],
    totalTimeSeconds: 0,
    totalPagesRead: 0,
  };
}

export async function saveSession(
  bookId: string,
  session: SessionItem,
  newCurrentPage: number,
): Promise<BookSessionData> {
  const data = await getBookSessionData(bookId);
  data.sessions.push(session);
  data.totalTimeSeconds += session.durationSeconds;
  data.totalPagesRead = newCurrentPage;

  await AsyncStorage.setItem(SESSION_KEY_PREFIX + bookId, JSON.stringify(data));
  return data;
}
