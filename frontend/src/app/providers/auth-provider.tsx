'use client';

import { AuthProvider as AuthProviderComponent } from '../../services/auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <AuthProviderComponent>{children}</AuthProviderComponent>;
}