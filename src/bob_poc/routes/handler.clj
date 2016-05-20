(ns bob-poc.routes.handler
  (:require [compojure.api.sweet :refer :all]
            [ring.util.http-response :refer :all]
            [bob-poc.routes.api-routes :refer [api-routes]]
            [bob-poc.routes.resource-routes :refer [resource-routes]]
            [bob-poc.routes.match-routes :refer [match-routes]]))

(defn wrap-dir-index
  "Middleware to force request for / to return index.html"
  [handler]
  (fn [req]
    (handler (update-in req [:uri] #(if (= "/" %) "/index.html" %)))))

(defapi app
  {:api {:invalid-routes-fn nil}
   :ring-swagger {:ignore-missing-mappings? true}}

  (middleware [wrap-dir-index] resource-routes api-routes match-routes))
