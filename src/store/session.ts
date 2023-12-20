import { get, writable } from "svelte/store";
import { Octokit } from "@octokit/rest";
import { RequestError } from "@octokit/request-error";

import { Backend, Storage } from "./config";
import type { BackendOptions, StorageOptions } from "./schema";

export type UserData = Awaited<
  ReturnType<InstanceType<typeof Octokit>["rest"]["users"]["getAuthenticated"]>
>["data"];
export type BranchData = Awaited<
  ReturnType<InstanceType<typeof Octokit>["rest"]["repos"]["listBranches"]>
>["data"];

export const User = writable<UserData>();
export const Octo = writable<Octokit>();
export const Branches = writable<BranchData>();

const Token = writable<string | undefined>();

export async function initSession(
  backendOpt: BackendOptions,
  storage: StorageOptions["session"]
) {
  console.log({ storage });
  console.time("initSession");

  try {
    const token = storage.location.getItem(storage.git_token_key);
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
    storage.location.setItem(storage.git_token_key, token);
    return token;
  }
  function createOcto(auth: string) {
    Octo.set(
      new Octokit({
        auth,
        baseUrl: backendOpt.git.baseUrl,
        log: console,
      })
    );
  }

  let token = get(Token);
  if (!token) token = await triggerAuth();
  createOcto(token);

  async function initUser() {
    try {
      const user = await get(Octo).rest.users.getAuthenticated();
      User.set(user.data);

      const branches = await get(Octo).rest.repos.listBranches({
        ...get(Backend).git,
      });
      Branches.set(branches.data);
    } catch (err) {
      if (!(err instanceof RequestError) || err.status !== 401) {
        throw err;
      }

      Token.set(undefined);
      storage.location.removeItem(storage.git_token_key);

      const auth = await triggerAuth();
      Octo.set(new Octokit({ auth, baseUrl: backendOpt.git.baseUrl }));
      return initUser();
    }
  }

  // change to check if open access is enabled (maybe git org implementation?)
  if (true) await initUser();

  console.timeEnd("initSession");
}

// Token.subscribe((token) => {
//   const storage = get(Storage);
//   if (token) {
//     storage?.session.location.setItem(storage.session.git_token_key, token);
//   }
// });

// dev
// Token.subscribe((token) => console.log({ token }));
User.subscribe((user) => console.log({ user }));
Branches.subscribe((branches) => console.log({ branches }));
