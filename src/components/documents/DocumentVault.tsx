"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Dictionary } from "@/lib/i18n/dictionaries";

const categories = ["passport", "travel", "treatment", "booking", "invoice", "other"] as const;

export function DocumentVault({ d }: { d: Dictionary }) {
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success" | "empty">("idle");
  const [files, setFiles] = useState<{ id: string; filename: string; category: string; storage_path: string }[]>([]);

  async function refresh() {
    const supabase = createClient();
    if (!supabase) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    const { data, error } = await supabase.from("documents").select("id, filename, category, storage_path").is("deleted_at", null).order("created_at", { ascending: false });
    if (error) {
      setStatus("error");
      return;
    }
    setFiles(data ?? []);
    setStatus((data ?? []).length === 0 ? "empty" : "success");
  }

  async function onSubmit(formData: FormData) {
    const file = formData.get("file");
    const category = String(formData.get("category") ?? "other");
    if (!(file instanceof File) || file.size === 0 || file.size > 10_485_760) {
      setStatus("error");
      return;
    }
    const supabase = createClient();
    if (!supabase) {
      setStatus("error");
      return;
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "");
    const path = `${user.id}/${crypto.randomUUID()}-${safeName || "file"}`;
    const uploaded = await supabase.storage.from("documents").upload(path, file, { contentType: file.type, upsert: false });
    if (uploaded.error) {
      setStatus("error");
      return;
    }
    const inserted = await supabase.from("documents").insert({
      owner_id: user.id,
      category,
      storage_path: path,
      filename: file.name,
      mime: file.type,
      size_bytes: file.size,
    });
    if (inserted.error) {
      await supabase.storage.from("documents").remove([path]);
      setStatus("error");
      return;
    }
    await refresh();
  }

  async function openFile(path: string) {
    const supabase = createClient();
    if (!supabase) return;
    const { data, error } = await supabase.storage.from("documents").createSignedUrl(path, 60);
    if (error || !data?.signedUrl) {
      setStatus("error");
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <div>
      <p className="text-sm text-faint">{d.documents.private}</p>
      <form action={onSubmit} className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
        <label>{d.documents.upload}
          <input name="file" type="file" accept="application/pdf,image/jpeg,image/png,image/webp" required className="mt-1 block w-full" />
        </label>
        <label>{d.documents.title}
          <select name="category" className="mt-1 w-full rounded-xl bg-midnight px-3 py-3">
            {categories.map((item) => <option key={item} value={item}>{d.documents.categories[item]}</option>)}
          </select>
        </label>
        <button className="self-end rounded-full bg-cyan px-4 py-3 font-semibold text-ink" type="submit">{d.documents.upload}</button>
      </form>
      <button className="mt-4 text-sm text-cyan" type="button" onClick={() => void refresh()}>{d.common.retry}</button>
      {status === "loading" ? <p role="status">{d.common.loading}</p> : null}
      {status === "error" ? <p role="alert">{d.common.error}</p> : null}
      {status === "empty" ? <p role="status">{d.documents.empty}</p> : null}
      <ul className="mt-4 space-y-2">
        {files.map((file) => (
          <li key={file.id} className="flex items-center justify-between gap-3 rounded-2xl border border-line px-3 py-3">
            <span>{file.filename}</span>
            <button type="button" className="text-cyan" onClick={() => void openFile(file.storage_path)}>{d.common.next}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
