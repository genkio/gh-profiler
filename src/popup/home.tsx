import React from "react";
import { browser } from "webextension-polyfill-ts";
import { Footer } from "./footer";
import { Form } from "./form";
import { Message } from "./message";
import { Profile } from "./profile";
import { IProfile, IProfileRaw } from "./typings";

const extractRatelimit = (resp: Response) => ({
  remaining: Number(resp.headers.get("x-ratelimit-remaining")),
  reset: Math.ceil(
    (Number(resp.headers.get("x-ratelimit-reset")) -
      Math.ceil(new Date().valueOf() / 1000)) /
      60,
  ), // in minutes
});

export const Home: React.FC = () => {
  const [profile, setProfile] = React.useState<IProfile | undefined>();
  const [error, setError] = React.useState("");

  const fetchProfile = async (username: IProfile["login"]) => {
    const resp = await fetch(`https://api.github.com/users/${username}`);
    const data: IProfileRaw & { message?: string } = await resp.json();
    const ratelimit = extractRatelimit(resp);

    if (!data.login) {
      if (data.message?.includes("API rate limit exceeded")) {
        setError(
          `Slow down 🐯, please come back in ${ratelimit.reset} minutes.`,
        );
      } else if (data.message?.includes("Not Found")) {
        setError(`No developer could be found for this username: ${username}`);
      }
      return;
    }
    setError("");

    const {
      avatar_url,
      bio,
      company,
      email,
      followers,
      following,
      hireable,
      location,
      login,
      name,
      public_repos,
      type,
    } = data;

    return {
      avatar: avatar_url,
      bio,
      company,
      email,
      followers,
      following,
      hireable,
      location,
      login,
      name,
      ratelimit,
      reposCount: public_repos,
      type,
    };
  };

  const handleSucceed = (profile: IProfile | undefined) => setProfile(profile);
  const handleFailed = (err: Error) =>
    setError(`Unable to fetch data from Github: ${err.message}`);

  browser.runtime.onMessage.addListener((message) => {
    if (message.DOM) {
      const [url] = Array.from(
        new Set(message.DOM.match(/github.com\/(\w+|\d+)/gi)),
      );
      if (!url) {
        setError("No developer could be found on this page");
        return;
      }
      const [, username] = (url as string).split("/");
      fetchProfile(username).then(handleSucceed).catch(handleFailed);
    }
  });

  return (
    <div>
      {error && <Message message={error} onClose={() => setError("")} />}
      {profile?.login ? (
        <Profile profile={profile} />
      ) : (
        <>
          <Form
            onError={(message) => setError(message)}
            onSubmit={(username) =>
              fetchProfile(username).then(handleSucceed).catch(handleFailed)
            }
          />
          {profile?.ratelimit && <Footer ratelimit={profile.ratelimit} />}
        </>
      )}
    </div>
  );
};
