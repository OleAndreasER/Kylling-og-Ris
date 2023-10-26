import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/app";
import store from "./redux/store";
import { Provider } from "react-redux";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:3000/graphql",
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // Cache policies used for loading more food search results.
          foodInfos: {
            // Only differences in these arguments
            // are to cause a new value to be stored.
            keyArgs: ["searchQuery", "sort", "allergens"],
            // If, instead, $offset changes with fetchMore, merge
            // existing foods with the incoming foods.
            // This implementation assumes incoming foods are always
            // appended to the end. useSearchResults always does this.
            merge(existing = [], incoming) {
              return [...existing, ...incoming];
            }
          }
        }
      }
    }
  })
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Provider store={store}>
        <App />
      </Provider>
    </ApolloProvider>
  </React.StrictMode>
);
