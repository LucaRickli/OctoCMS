import { get, writable } from "svelte/store";
import { Octokit } from "@octokit/rest";
import { RequestError } from "@octokit/request-error";

import { Backend } from "./config";
import type { BackendOptions } from "./schema";

export const Octo = writable<Octokit>();

export type UserData = Awaited<
  ReturnType<InstanceType<typeof Octokit>["rest"]["users"]["getAuthenticated"]>
>["data"];
export const User = writable<UserData>();

const Token = writable<string | undefined>();

export async function initSession(backendOpt: BackendOptions) {
  console.time("initSession");

  try {
    const token = backendOpt.session.storage.getItem(backendOpt.session.key);
    if (token) Token.set(token);
  } catch (err) {
    console.error(new Error("Failed to load token!"));
    console.time("initSession");
    throw err;
  }

  async function triggerAuth() {
    const token = await backendOpt.auth();
    if (!token) return triggerAuth();
    Token.set(token);
    return token;
  }

  let auth = get(Token);
  if (!auth) auth = await triggerAuth();
  const octo = new Octokit({ auth, baseUrl: backendOpt.git.baseUrl });
  Octo.set(octo);

  async function initUser() {
    try {
      const user = await get(Octo).rest.users.getAuthenticated();
      User.set(user.data);
    } catch (err) {
      if (!(err instanceof RequestError) || err.status !== 401) {
        throw err;
      }

      Token.set(undefined);
      backendOpt.session.storage.removeItem(backendOpt.session.key);

      const auth = await triggerAuth();
      Octo.set(new Octokit({ auth, baseUrl: backendOpt.git.baseUrl }));
      return initUser();
    }
  }

  // change to check if open access is enabled (maybe git org implementation?)
  if (true) await initUser();

  console.timeEnd("initSession");
}

Token.subscribe((token) => {
  const backend = get(Backend);
  if (token) backend.session.storage.setItem(backend.session.key, token);
});

// dev
// Token.subscribe((token) => console.log({ token }));
User.subscribe((user) => console.log({ user }));
