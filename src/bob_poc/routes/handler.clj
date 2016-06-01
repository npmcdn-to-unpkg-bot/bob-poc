(ns bob-poc.routes.handler
  (:require [compojure.api.sweet :refer :all]
            [ring.util.http-response :refer :all]
            [bob-poc.routes.api-routes :refer [api-routes]]
            [bob-poc.routes.resource-routes :refer [resource-routes]]
            [bob-poc.routes.match-routes :refer [match-routes]]
            [bob-poc.application.properties :refer [current-env]]))

(defn- wrap-dir-index
  "Middleware to force request for / to return index.html"
  [handler]
  (fn [req]
    (handler (update-in req [:uri] #(if (= "/" %) "/index.html" %)))))

(defn- wrap-dev-cors-support
  "Used to allow CORS requests in dev environment because front is running with Webpack in different port"
  [handler]
  (fn [req]
    (if (= (current-env) "dev")
      (let [response (handler req)]
        (-> response
            (assoc-in [:headers "Access-Control-Allow-Origin"]  "http://localhost:8080")
            (assoc-in [:headers "Access-Control-Allow-Methods"] "GET,PUT,POST,DELETE,OPTIONS")
            (assoc-in [:headers "Access-Control-Allow-Headers"] "X-Requested-With,Content-Type,Cache-Control")))
      (handler req))))

(defapi app
  {:api {:invalid-routes-fn nil}
   :ring-swagger {:ignore-missing-mappings? true}}

  (middleware [wrap-dir-index wrap-dev-cors-support] resource-routes api-routes match-routes))
