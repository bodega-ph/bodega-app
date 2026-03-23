import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";

export async function PATCH(req: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    // Parse request body
    const body = await req.json();
    const { name, email, currentPassword } = body;

    // Validate name
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Validate email format
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // If email is being changed, verify current password
    const isEmailChanged = email.toLowerCase().trim() !== session.user.email?.toLowerCase();
    
    if (isEmailChanged) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Current password is required to change email" },
          { status: 400 }
        );
      }

      // Fetch user with password
      const userWithPassword = await prisma.user.findUnique({
        where: { id: userId },
        select: { password: true },
      });

      // Check if user has a password (OAuth users don't)
      if (!userWithPassword?.password) {
        return NextResponse.json(
          { error: "Cannot change email for OAuth accounts" },
          { status: 400 }
        );
      }

      // Verify password
      const passwordValid = await bcrypt.compare(currentPassword, userWithPassword.password);
      if (!passwordValid) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 401 }
        );
      }
    }

    // Check email uniqueness (if changed)
    if (isEmailChanged) {
      const existingUser = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
      });

      if (existingUser && existingUser.id !== userId) {
        return NextResponse.json({ error: "Email already in use" }, { status: 409 });
      }
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
