import { getSession, getUsers } from "./storage";
import { Session, User } from "@/types/auth";

export function isLoggedIn(): boolean {
	return !!getSession();
}

export function getCurrentUser(): User | null {
	const session: Session | null = getSession();
	if (!session) return null;
	const users = getUsers();
	return users.find((u) => u.id === session.userId) || null;
}
