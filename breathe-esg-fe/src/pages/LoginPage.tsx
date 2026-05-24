import { useState } from "react";
import { PageTitle } from "@/components/PageTitle";
import { useLogin } from "@/hooks";

export default function LoginPage() {
  const [username, setUsername] = useState("analyst");
  const [password, setPassword] = useState("demo1234");

  const login = useLogin();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    login.mutate({ username, password });
  }

  const errorMessage = login.isError
    ? "Invalid credentials. Use analyst / demo1234 after running seed_demo."
    : null;

  return (
    <div className="grid min-h-screen place-items-center bg-background px-4">
      <PageTitle title="Sign in — Breathe ESG" />
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-xl border border-border bg-surface p-8 shadow-soft"
      >
        <h1 className="font-display text-xl font-medium text-foreground">Analyst sign in</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">Connect to the Breathe ESG API.</p>
        {errorMessage && <p className="mt-3 text-[13px] text-rose">{errorMessage}</p>}
        <label className="mt-5 block text-[12px] text-muted-foreground">
          Username
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 h-9 w-full rounded-md border border-border bg-background px-3 text-foreground"
            autoComplete="username"
          />
        </label>
        <label className="mt-3 block text-[12px] text-muted-foreground">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 h-9 w-full rounded-md border border-border bg-background px-3 text-foreground"
            autoComplete="current-password"
          />
        </label>
        <button
          type="submit"
          disabled={login.isPending}
          className="mt-6 w-full rounded-md bg-foreground py-2 text-[13px] font-medium text-primary-foreground disabled:opacity-60"
        >
          {login.isPending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
