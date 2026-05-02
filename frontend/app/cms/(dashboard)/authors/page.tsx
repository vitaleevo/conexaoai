"use client";

import { useActionState, useEffect, useEffectEvent, useMemo, useRef, useState } from "react";
import { Filter, Search, Shield, User as UserIcon, UserPlus } from "lucide-react";
import { cmsFetch } from "@/lib/cms-api";
import { createCmsUserAction, type CreateCmsUserState } from "./actions";

interface Author {
  id: number;
  name: string;
  email: string;
  role: "admin" | "manager" | "editor" | "author" | "viewer";
  bio: string | null;
  user_id: string | null;
}

interface CmsCurrentUser {
  role: "admin" | "manager" | "editor" | "author" | "viewer";
}

const initialCreateState: CreateCmsUserState = {
  success: false,
  message: "",
};

const roleLabels: Record<Author["role"], string> = {
  admin: "Admin",
  manager: "Manager",
  editor: "Editor",
  author: "Author",
  viewer: "Viewer",
};

export default function CmsAuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [currentRole, setCurrentRole] = useState<CmsCurrentUser["role"]>("viewer");
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const [formState, formAction, isPending] = useActionState(createCmsUserAction, initialCreateState);

  const loadAuthors = useEffectEvent(async () => {
    try {
      const [authorsData, meData] = await Promise.all([
        cmsFetch<{ results: Author[] } | Author[]>("/authors/"),
        cmsFetch<CmsCurrentUser>("/me/"),
      ]);

      setAuthors("results" in authorsData && Array.isArray(authorsData.results) ? authorsData.results : Array.isArray(authorsData) ? authorsData : []);
      setCurrentRole(meData.role);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  });

  useEffect(() => {
    queueMicrotask(() => {
      loadAuthors();
    });
  }, []);

  useEffect(() => {
    if (!formState.success) return;
    formRef.current?.reset();
    queueMicrotask(() => {
      loadAuthors();
    });
  }, [formState.success]);

  const filteredAuthors = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return authors;

    return authors.filter((author) =>
      [author.name, author.email, author.role, author.bio ?? ""].some((value) => value.toLowerCase().includes(term)),
    );
  }, [authors, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Authors</h1>
          <p className="mt-1 text-sm font-medium text-slate-500">Editorial profiles and CMS access.</p>
        </div>

        {currentRole === "admin" ? (
          <form ref={formRef} action={formAction} className="grid w-full gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:max-w-3xl lg:grid-cols-4">
            <div className="lg:col-span-2">
              <label htmlFor="name" className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-500"
                placeholder="Full name"
              />
            </div>
            <div className="lg:col-span-2">
              <label htmlFor="email" className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-500"
                placeholder="user@domain.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-500"
                placeholder="Min. 8 characters"
              />
            </div>
            <div>
              <label htmlFor="role" className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Role
              </label>
              <select
                id="role"
                name="role"
                defaultValue="editor"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-500"
              >
                {Object.entries(roleLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                <UserPlus className="h-4 w-4" />
                {isPending ? "Creating..." : "Create user"}
              </button>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 lg:col-span-4">
              <Shield className="h-4 w-4" />
              Only `admin` can create users and assign roles.
            </div>
            {formState.message ? (
              <div
                className={`rounded-lg px-3 py-2 text-sm font-medium lg:col-span-4 ${
                  formState.success ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                }`}
              >
                {formState.message}
              </div>
            ) : null}
          </form>
        ) : (
          <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
            <Shield className="h-4 w-4" />
            User creation is restricted to admin.
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-white p-2 shadow-sm sm:flex-row">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search authors..."
            className="w-full bg-transparent py-2 pl-9 pr-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
        </div>
        <div className="h-px w-full bg-slate-200 sm:h-6 sm:w-px" />
        <div className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600">
          <Filter className="h-4 w-4" />
          {filteredAuthors.length} records
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Name / Email</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Auth</th>
                <th className="px-6 py-4 font-medium">Bio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    Loading authors...
                  </td>
                </tr>
              ) : filteredAuthors.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <UserIcon className="mx-auto mb-3 h-8 w-8 text-slate-300" />
                    <p className="font-medium text-slate-500">No authors found.</p>
                  </td>
                </tr>
              ) : (
                filteredAuthors.map((author) => (
                  <tr key={author.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{author.name || "Unnamed"}</div>
                      <div className="mt-0.5 text-xs text-slate-500">{author.email || "No email"}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                        {roleLabels[author.role] ?? author.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-500">{author.user_id ? "Linked" : "No auth"}</td>
                    <td className="max-w-xs px-6 py-4 text-slate-600">{author.bio || "No biography."}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
