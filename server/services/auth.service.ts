import { supabase } from "../config/db";
import { User } from "../types/user";
import bcrypt from "bcryptjs";

export const registerUser = async (
  email: string,
  password: string,
  phone_number: string,
  name: string,
  surname: string
): Promise<User> => {
  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);
  // Step 1: Create the user in Supabase's authentication system.
  const { data: authData, error: authError } =
    await supabase.auth.admin.createUser({
      email,
      password,
      phone: phone_number,
      email_confirm: true, // Auto-confirm user for simplicity in this context
    });

  if (authError) {
    console.error("Error creating auth user:", authError);
    throw new Error(authError.message);
  }

  if (!authData.user) {
    throw new Error("User could not be created in Supabase Auth.");
  }

  // Step 2: Insert the user's profile into the public 'users' table.
  const { data: profileData, error: profileError } = await supabase
    .from("users")
    .insert({
      id: authData.user.id, // Use the ID from the auth user
      email,
      name,
      surname,
      phone_number,
      password: password_hash,
    })
    .select()
    .single();

  if (profileError) {
    console.error("Error creating user profile:", profileError);
    // Optional: Clean up by deleting the auth user if profile creation fails
    await supabase.auth.admin.deleteUser(authData.user.id);
    throw new Error(profileError.message);
  }

  return profileData;
};

export const loginUser = async (
  email: string,
  password: string
): Promise<{ token: string; user: User }> => {
  // Step 1: Sign in the user to get a session.
  const { data: sessionData, error: sessionError } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (sessionError) {
    throw new Error(sessionError.message || "Invalid email or password");
  }

  if (!sessionData.session || !sessionData.user) {
    throw new Error("Could not log in. Session or user not found.");
  }

  // Step 2: Fetch the user's profile from the public 'users' table.
  const user = await getUserById(sessionData.user.id);
  if (!user) {
    throw new Error("User profile not found.");
  }

  return {
    token: sessionData.session.access_token,
    user,
  };
};

export const getUserById = async (id: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 = 'exact one row not found'
    console.error("Error fetching user by ID:", error);
    throw error;
  }

  return data;
};
