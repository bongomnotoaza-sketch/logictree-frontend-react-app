export interface CurrentUser {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  country: string;
  province: string;
  city: string;
  street: string;
  current_activity: string;
  role: string;
  email_verified: boolean;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    const response = await fetch("https://www.logictree.co.za/auth/current-user/", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`current-user returned ${response.status}`);
    }

    const data = await response.json();

    if (data.authenticated && data.user) {
      return data.user as CurrentUser;
    }

    return null;
  } catch (error) {
    console.error("Failed to load current user:", error);
    return null;
  }
}

export function getInitials(user: CurrentUser | null): string {
  if (!user) return "";

  const first = user.first_name?.trim()[0] ?? "";
  const last = user.last_name?.trim()[0] ?? "";

  return (first + last).toUpperCase();
}