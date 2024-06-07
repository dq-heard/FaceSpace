import { Dispatch, SetStateAction, useState, useEffect } from "react";

import MasonryLayout from "./MasonryLayout";
import { client } from "../client";
import { searchQuery } from "../utils/data";
import Spinner from "./Spinner";
import { PinType } from "../utils/types";

type SearchProps = {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
};

const Search: React.FC<SearchProps> = ({ searchTerm }) => {
  const [pins, setPins] = useState<PinType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (searchTerm !== "") {
      setLoading(true);
      const query = searchQuery(searchTerm.toLowerCase());
      client
        .fetch<PinType[]>(query)
        .then((data) => {
          setPins(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setLoading(false);
          setPins([]);
        });
    } else {
      setPins([]);
    }
  }, [searchTerm]);

  return (
    <div>
      {loading && <Spinner message="Searching pins..." />}
      {!loading && pins.length > 0 && <MasonryLayout pins={pins} />}
      {!loading && pins.length === 0 && searchTerm !== "" && (
        <div className="mt-10 text-center text-xl">No Pins Found.</div>
      )}
    </div>
  );
};

export default Search;
