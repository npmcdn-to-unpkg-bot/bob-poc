(ns bob-poc.routes.band-routes
  (:require [compojure.core :refer [defroutes context GET POST]]
            [clojure.tools.logging :refer [debug]]
            [bob-poc.match.match-service :as match]
            [ring.util.http-response :refer [ok]]
            [bob-poc.match.match-handler :refer [match-ws-handler]]
            [compojure.route :refer [resources]]))

(defroutes band-routes
   (resources "/")
   (context "/v1" []
     (GET "/current-contendees" []
       (debug "Requesting how many contendees...")
       (ok (match/get-current-match)))

     (POST "/song" {{bandName :name bandImage :img streamUrl :url} :body}
       (debug (str bandName " " bandImage " " streamUrl))
       )))