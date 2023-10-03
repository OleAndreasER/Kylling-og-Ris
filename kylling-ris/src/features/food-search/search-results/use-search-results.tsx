import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import Food from "./food";
import { useState, useEffect } from "react";

//Future useSearchResults:
//Use tanstack query to retreive food items.
//Include searchQuery, filters, sorts in request so that the server can take care of it.

export default temporaryUseSearchResults;

const initialResultsLoaded = 14;

//Temporarily have the client sort and filter.
//This simulates how it would be if we used our server.
function temporaryUseSearchResults(searchQuery: string): {
  foodItems: Food[];
  hasMoreFoodItems: boolean;
  loadMoreFoodItems: () => Promise<void>;
} {
  const [resultsLoaded, setResultsLoaded] =
    useState<number>(initialResultsLoaded);
  const allFoods: Food[] = useSelector((state: RootState) => state.food.foods);
  // In the future we don't want to send a new request on every character typed by the user.
  const searchQueryAfterInactivity = useUpdateOnInactivity(300, searchQuery);

  //Reset the amount of food items shown when the search changes.
  useEffect(() => {
    setResultsLoaded(initialResultsLoaded);
  }, [searchQueryAfterInactivity]);

  //Filtering based on search query.
  const filteredFoodItems = allFoods.filter((food) =>
    queryIsSimilarTo(searchQueryAfterInactivity, food.name)
  );

  return {
    foodItems: filteredFoodItems.slice(0, resultsLoaded),
    loadMoreFoodItems: async () => {
      //Simulates the loading time of retrieving from server.
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setResultsLoaded((previous) => previous + 10);
    },
    hasMoreFoodItems: resultsLoaded < filteredFoodItems.length
  };
}

//Temporary. Should be done by the server with a better algorithm.
//Query is similar, here, if the term starts with the query (case insensitive).
//"kyl" is similar to "Kyllingfilet" - "xkyl" is not.
const queryIsSimilarTo = (rawQuery: string, rawTerm: string): boolean => {
  const query = rawQuery.toLowerCase();
  const term = rawTerm.toLowerCase();
  for (let i = 0; i < query.length; i++) {
    if (term.charAt(i) !== query.charAt(i)) {
      return false;
    }
  }
  return true;
};

//Only updates the returned value after a time of inactivity updating value.
function useUpdateOnInactivity<T>(
  timeInactiveBeforeUpdate: number,
  value: T
): T {
  const [infrequentlyUpdatedValue, setInfrequentlyUpdatedValue] =
    useState<T>(value);
  const [updatesWaiting, setUpdatesWaiting] = useState<number>(0);

  useEffect(() => {
    setUpdatesWaiting((previous) => previous + 1);
    setTimeout(() => {
      setUpdatesWaiting((previous) => previous - 1);
    }, timeInactiveBeforeUpdate);
  }, [value]);

  useEffect(() => {
    if (updatesWaiting === 0) {
      setInfrequentlyUpdatedValue(value);
    }
  }, [updatesWaiting]);

  return infrequentlyUpdatedValue;
}