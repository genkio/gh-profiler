import React, { FormEvent } from "react";
import { browser } from "webextension-polyfill-ts";

interface IProps {
  onError: (message: string) => void;
  onSubmit: (username: string) => void;
}

export const Form: React.FC<IProps> = ({ onError, onSubmit }) => {
  const [username, setUsername] = React.useState("");

  const handleFetch = () => {
    return browser.tabs
      .query({ active: true })
      .then(([tab]) =>
        tab.id
          ? browser.tabs.sendMessage(tab.id, { getDOM: true })
          : Promise.resolve(),
      )
      .catch((err) => onError(`Unable to send signal: ${err.message}`));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (username) {
      const [value] = username.split("/").slice(-1);
      onSubmit(value);
    }
  };

  return (
    <div className="py-8 px-8 rounded-xl">
      <div className="flex justify-center">
        <img src={browser.extension.getURL("icon-128x128.png")} />
      </div>

      <h1 className="font-medium text-2xl mt-3 text-center text-gray-900">
        ghProfiler
      </h1>
      <p className="text-sm mt-2 text-center font-light text-gray-400">
        Find developer on this page
      </p>

      <div className="grid gap-2 mt-7">
        <div>
          <button
            className="text-center w-full text-white bg-blue-700 p-3 duration-300 rounded-sm hover:bg-blue-900 uppercase"
            onClick={handleFetch}
          >
            Try Find
          </button>
        </div>
      </div>

      <div className="flex justify-center items-center mt-10">
        <div className="text-sm font-light text-gray-400">
          Or, fetch a developer you already know
        </div>
      </div>

      <form className="mt-6" onSubmit={handleSubmit}>
        <div className="my-5 text-sm">
          <input
            type="text"
            id="username"
            className="rounded-sm px-4 py-3 mt-3 focus:outline-none bg-gray-100 w-full"
            placeholder="Github username or URL"
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>

        <button
          className="block text-center text-white bg-gray-800 p-3 duration-300 rounded-sm hover:bg-black w-full uppercase"
          type="submit"
        >
          Go Fetch
        </button>
      </form>
    </div>
  );
};
