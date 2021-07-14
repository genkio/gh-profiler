import html2canvas from "html2canvas";
import React from "react";
import ReactTooltip from "react-tooltip";
import { browser } from "webextension-polyfill-ts";
import { RadarChart } from "./radar-chart";
import { IProfile, IRepo, IRepoRaw } from "./typings";

const calcRadarStats = (repos: IRepo[]) => {
  const stats = repos.reduce<Record<string, number>>((acc, { language }) => {
    if (!language) return acc;
    return {
      ...acc,
      [language]: acc[language] ? acc[language] + 1 : 1,
    };
  }, {});

  return { labels: Object.keys(stats), data: Object.values(stats) };
};

const format = (value: number) => new Intl.NumberFormat("en-US").format(value);

interface IProps {
  profile: IProfile;
}

export const Profile: React.FC<IProps> = ({ profile }) => {
  const [repos, setRepos] = React.useState<IRepo[]>([]);

  const fetchRepos = async () => {
    const resp = await fetch(
      `https://api.github.com/users/${profile.login}/repos?per_page=100&type=owner&sort=pushed&direction=desc`,
    );
    const data: IRepoRaw[] = await resp.json();

    setRepos(
      data.map(
        ({
          created_at,
          language,
          name,
          pushed_at,
          stargazers_count,
          updated_at,
        }) => ({
          createdAt: created_at,
          language,
          name,
          pushedAt: pushed_at,
          starsCount: stargazers_count,
          updatedAt: updated_at,
        }),
      ),
    );
  };

  React.useEffect(() => {
    fetchRepos();
  }, [profile.login]);

  const saveAsImage = async () => {
    const target = document.querySelector("#popup") as HTMLElement;
    const canvas = await html2canvas(target, { useCORS: true });
    const img = canvas.toDataURL("image/png");
    const encodedUri = encodeURI(img);
    const link = document.createElement("a");

    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${profile.login}.png`);
    document.body.appendChild(link); // Required for FF
    link.click();
  };

  const {
    avatar,
    bio,
    followers,
    following,
    name,
    login,
    reposCount,
  } = profile;
  const { labels, data } = calcRadarStats(repos);

  return (
    <>
      <ReactTooltip />
      <div className="card min-w-sm border border-gray-700 bg-gray-700 text-gray-50 transition-shadow shadow-xl hover:shadow-xl">
        <div className="w-full card__media">
          <img
            src="https://source.unsplash.com/random/576x288/?code"
            className="h-48 w-96 object-cover"
          />
        </div>
        <div className="flex items-center p-4">
          <div className="relative flex flex-col items-center w-full">
            <div className="h-24 w-24 md rounded-full relative avatar flex items-end justify-end text-purple-400 min-w-max absolute -top-16 flex bg-purple-200 text-purple-100 row-start-1 row-end-3 text-purple-650 ring-1 ring-white">
              <img
                className="h-24 w-24 md rounded-full relative cursor-pointer"
                src={avatar}
                alt="Avatar"
                onClick={saveAsImage}
              />
              {profile.type === "Organization" && (
                <span
                  className="absolute text-2xl"
                  role="img"
                  aria-label="organization"
                  data-tip="This profile belongs to an organization"
                >
                  🏢
                </span>
              )}
            </div>

            <div className="flex flex-col space-y-1 justify-center items-center -mt-12 w-full">
              <span className="text-lg whitespace-nowrap text-gray-50 font-semibold">
                {name}{" "}
                {profile.company && (
                  <span className="text-xs text-gray-500">
                    at {profile.company}
                  </span>
                )}
              </span>
              <span
                className="text-md whitespace-nowrap text-gray-400 cursor-pointer"
                onClick={() =>
                  browser.tabs.create({ url: `https://github.com/${login}` })
                }
              >
                @{login}
              </span>
              <p
                className="text-sm text-gray-200 break-words py-2"
                style={{ width: 340 }}
              >
                {bio}
              </p>
              {profile.location && (
                <p className="flex items-center text-md font-light">
                  <span
                    className="text-lg mr-1"
                    role="img"
                    aria-label="location"
                  >
                    🌍
                  </span>
                  {profile.location}
                </p>
              )}

              <div className="py-4 flex justify-center items-center w-full divide-x divide-gray-400 divide-solid">
                <span className="text-center px-2">
                  <span className="font-bold text-gray-50">
                    {format(followers)}
                  </span>
                  <span className="text-gray-100"> followers</span>
                </span>
                <span className="text-center px-2">
                  <span className="font-bold text-gray-50">
                    {format(following)}
                  </span>
                  <span className="text-gray-100"> following</span>
                </span>
                <span className="text-center px-2">
                  <span className="font-bold text-gray-50">
                    {format(reposCount)}
                  </span>
                  <span className="text-gray-100"> repos</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {!!repos.length && <RadarChart labels={labels} data={data} />}
    </>
  );
};
