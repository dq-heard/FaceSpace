import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { client } from "../client";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";
import { feedQuery, searchQuery } from "../utils/data";
import { PinType } from "../utils/types";

const Feed = () => {
  const [loading, setLoading] = useState(false);
  const [pins, setPins] = useState<PinType[]>([]);

  const { categoryID } = useParams();

  useEffect(() => {
    const fetchPins = async (query: string) => {
      try {
        setLoading(true);
        const data = await client.fetch(
          query,
          {},
          {
            headers: {
              Authorization: `Bearer ${client.config().token}`,
            },
          }
        );
        setPins(data);
        setLoading(false);
      } catch (error) {
        // Handle errors
        console.error("Error fetching pins:", error);
      }
    };

    if (categoryID) {
      const query = searchQuery(categoryID);
      fetchPins(query);
    } else {
      fetchPins(feedQuery);
    }
  }, [categoryID]);

  if (loading)
    return <Spinner message="We are adding new ideas to your feed!" />;

  if (!pins?.length) return <h2>No Pins Available.</h2>;
  return <>{pins && <MasonryLayout pins={pins} />}</>;
};

export default Feed;
