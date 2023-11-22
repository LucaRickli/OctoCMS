import { writable } from "svelte/store";
import type { BackendOptions } from "./schema";
import { Octokit } from "@octokit/rest";
import { RequestError } from "@octokit/request-error";

export const Octo = writable<Octokit>();

export type UserData = Awaited<
  ReturnType<InstanceType<typeof Octokit>["rest"]["users"]["getAuthenticated"]>
>["data"];
export const User = writable<UserData>();

const Token = writable<string | undefined>();

export async function initSession(backendOpt: BackendOptions) {
  console.time("initSession");

  let token = backendOpt.session.storage.getItem(backendOpt.session.key);

  async function triggerAuth() {
    token = await backendOpt.auth();
    if (!token) return triggerAuth();
    backendOpt.session.storage.setItem(backendOpt.session.key, token);
    Token.set(token);
  }

  if (!token) await triggerAuth();
  else Token.set(token);

  const octo = new Octokit({ auth: token, baseUrl: backendOpt.baseUrl });
  Octo.set(octo);

  // change to check setting open editor (maybe git org implementation?)
  if (true) {
    async function initUser() {
      try {
        const user = await octo.rest.users.getAuthenticated();
        User.set(user.data);
      } catch (err) {
        if (!(err instanceof RequestError) || err.status !== 401) {
          throw err;
        }

        Token.set(undefined);
        backendOpt.session.storage.removeItem(backendOpt.session.key);

        await triggerAuth();
        return initUser();
      }
    }

    await initUser();
  }

  console.timeEnd("initSession");
}

Token.subscribe((token) => console.log({ token }));
User.subscribe((user) => console.log({ user }));
