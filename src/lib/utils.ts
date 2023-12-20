import { object, type ZodSchema } from "zod";
import { parse } from "yaml";

export function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = [
    "Bytes",
    "KiB",
    "MiB",
    "GiB",
    "TiB",
    "PiB",
    "EiB",
    "ZiB",
    "YiB",
  ];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export const mdRegex = /\.md$/;

export const frontmatterRegex = /^\s*---\s*([\s\S]*?(?=\s*---))\s*---\s*/;
export function parseFrontmatter<T extends object>(
  content: string
): { content: string; frontmatter?: T } {
  const result = frontmatterRegex.exec(content);
  if (result?.length !== 2) throw new Error("Failed to parse frontmatter.");
  return {
    frontmatter: parse(result[1]),
    content: content.replace(frontmatterRegex, ""),
  };
}

export function getRef<T = any>(schema: ZodSchema, key = "ref"): T | undefined {
  const query = new URLSearchParams(location.hash?.split("?")[1]);
  const rawRef = Base64.urlDecode(query.get(key) || "");
  return rawRef ? schema.parse(JSON.parse(rawRef)) : undefined;
}

/** The Unicode Problem
 * @see {@link https://stackoverflow.com/questions/30106476/using-javascripts-atob-to-decode-base64-doesnt-properly-decode-utf-8-strings#answer-30106551}
 */
export class Base64 {
  public static encode(val: string) {
    return btoa(
      encodeURIComponent(val).replace(
        /%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
          return String.fromCharCode(Number("0x" + p1));
        }
      )
    );
  }

  public static decode(val: string) {
    return decodeURIComponent(
      atob(val)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
  }

  public static urlEncode(val: string | object) {
    const encoded = this.encode(
      typeof val === "string" ? val : JSON.stringify(val)
    );
    return encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  }

  public static urlDecode(val: string) {
    return this.decode(val.replace(/-/g, "+").replace(/_/g, "/"));
  }
}
