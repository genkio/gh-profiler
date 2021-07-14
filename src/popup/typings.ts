export interface IRatelimit {
  remaining: number;
  reset: number;
}

export interface IProfile {
  avatar: string;
  bio: string | null;
  company: string | null;
  email: string | null;
  followers: number;
  following: number;
  hireable: boolean | null;
  location: string | null;
  login: string;
  name: string | null;
  ratelimit: IRatelimit;
  reposCount: number;
  type: "User" | "Organization";
}

export interface IProfileRaw
  extends Omit<IProfile, "avatar" | "ratelimit" | "repos" | "reposCount"> {
  avatar_url: string;
  public_repos: number;
}

export interface IRepo {
  createdAt: string;
  language: string | null;
  name: string;
  pushedAt: string;
  starsCount: number;
  updatedAt: string;
}

export interface IRepoRaw
  extends Omit<IRepo, "createdAt" | "pushedAt" | "starsCount" | "updatedAt"> {
  created_at: string;
  pushed_at: string;
  stargazers_count: number;
  updated_at: string;
}
