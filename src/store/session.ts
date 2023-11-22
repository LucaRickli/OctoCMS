import { get, writable } from "svelte/store";
import type { BackendOptions } from "./schema";
import { Octokit } from "@octokit/rest";
import { RequestError } from "@octokit/request-error";
import { Backend } from "./config";

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
    console.error("Failed to load token!");
    console.time("initSession");
    throw err;
  }

  async function triggerAuth() {
    const token = await backendOpt.auth();
    if (!token) return triggerAuth();
    // backendOpt.session.storage.setItem(backendOpt.session.key, token);
    Token.set(token);
    return token;
  }

  const auth = get(Token);
  if (!auth) await triggerAuth();

  const octo = new Octokit({ auth, baseUrl: backendOpt.baseUrl });
  Octo.set(octo);

  // change to check if open access is enabled (maybe git org implementation?)
  if (true) {
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
        Octo.set(new Octokit({ auth, baseUrl: backendOpt.baseUrl }));
        return initUser();
      }
    }

    await initUser();
  }

  console.timeEnd("initSession");
}

Token.subscribe((token) => {
  const backend = get(Backend);
  if (token) backend.session.storage.setItem(backend.session.key, token);
});

// dev
Token.subscribe((token) => console.log({ token }));
User.subscribe((user) => console.log({ user }));
