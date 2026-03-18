import Cookies from "js-cookie";

export class CookiesService {
  public get(key: string): string | undefined {
    return Cookies.get(key);
  }

  public set(
    key: string,
    value: string,
    options?: Cookies.CookieAttributes,
  ): void {
    Cookies.set(key, value, options);
  }

  public remove(key: string): void {
    Cookies.remove(key);
  }

  public getAll(): { [key: string]: string } {
    return Cookies.get();
  }

  public has(key: string): boolean {
    return Cookies.get(key) !== undefined;
  }

  // Auth token
  public getAuthToken(): string | undefined {
    return Cookies.get("access_token");
  }

  public setAuthToken(token: string, options?: Cookies.CookieAttributes): void {
    Cookies.set("access_token", token, options);
  }
}
export const cookiesService = new CookiesService();
