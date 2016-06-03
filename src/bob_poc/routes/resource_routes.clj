(ns bob-poc.routes.resource-routes
  (:require [compojure.core :refer [defroutes]]
            [compojure.route :refer [resources]]))

(defroutes resource-routes
  (resources "/"))